#!/usr/bin/env node
/**
 * Production-grade deployment health monitor.
 *
 * This script is designed to run in GitHub Actions and locally.
 * It verifies website routes, build assets, public API dependencies, and
 * Supabase connectivity using the smallest possible queries.
 */

import { writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { createClient } from '@supabase/supabase-js';
import { URL } from 'node:url';

const HEALTH_REPORT_PATH = './health-report.json';
const HEALTH_LOG_PATH = './health-check.log';
const SITE_ROUTES = [
  '/',
  '/auth',
  '/dashboard',
  '/preferences',
  '/recommendations',
  '/recent',
  '/trending',
  '/login',
  '/register',
  '/non-existent-route'
];
const OPTIONAL_ASSETS = ['/robots.txt'];
const SUPABASE_CANDIDATE_TABLES = [
  { table: 'profiles', key: 'id' },
  { table: 'anime', key: 'mal_id' },
  { table: 'reviews', key: 'id' }
];
const EXTERNAL_API_CHECKS = [
  {
    name: 'Jikan seasons now',
    url: 'https://api.jikan.moe/v4/seasons/now?limit=1',
    method: 'GET',
    validate: async (response, body) => {
      if (response.status !== 200) {
        return 'Expected HTTP 200';
      }
      const payload = JSON.parse(body);
      if (!payload?.data || !Array.isArray(payload.data)) {
        return 'Invalid Jikan response shape';
      }
      return null;
    }
  },
  {
    name: 'Anilist GraphQL',
    url: 'https://graphql.anilist.co',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'query { Page(page:1, perPage:1) { media(type: ANIME, sort:POPULARITY_DESC) { id title { romaji } } } }'
    }),
    validate: async (response, body) => {
      if (response.status !== 200) {
        return 'Expected HTTP 200';
      }
      const payload = JSON.parse(body);
      if (!payload?.data?.Page?.media || !Array.isArray(payload.data.Page.media)) {
        return 'Invalid Anilist GraphQL response shape';
      }
      return null;
    }
  }
];
const REQUIRED_ENV_VARS = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const WEBSITE_URL_ENV_VARS = ['WEBSITE_URL', 'PRODUCTION_URL', 'VERCEL_URL'];

const logs = [];

function printUsage() {
  console.log('Usage: node scripts/health-check.js <deploy-url>');
  console.log('Example: node scripts/health-check.js https://your-app.vercel.app');
}

function appendLog(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = level === 'error' ? '❌' : level === 'success' ? '✅' : 'ℹ️';
  const line = `${prefix} [${timestamp}] ${message}`;
  logs.push(line);
  console.log(line);
  return line;
}

function normalizeUrl(value) {
  if (!value) return '';
  const trimmed = value.toString().trim().replace(/\/$/, '');
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function resolveDeploymentUrl(cliUrl) {
  const fallback = WEBSITE_URL_ENV_VARS.map((name) => process.env[name]).find(Boolean);
  const resolved = cliUrl || fallback;
  if (!resolved) {
    throw new Error(
      'Missing deployment URL. Set WEBSITE_URL / PRODUCTION_URL, or provide the URL as the first argument.'
    );
  }
  return normalizeUrl(resolved);
}

function buildReportBase() {
  return {
    generatedAt: new Date().toISOString(),
    checks: [],
    summary: {
      website: { passed: 0, failed: 0, warnings: 0 },
      api: { passed: 0, failed: 0, warnings: 0 },
      supabase: { passed: 0, failed: 0, warnings: 0 },
      overall: 'unknown',
      durationMs: 0,
      websiteUrl: null,
      safeSupabaseTable: null,
      runMode: 'github-actions'
    }
  };
}

function recordCheck(report, check) {
  report.checks.push(check);
  const group = check.group || 'website';
  const summary = report.summary[group] || { passed: 0, failed: 0, warnings: 0 };
  if (check.ok) summary.passed += 1;
  else if (check.critical) summary.failed += 1;
  else summary.warnings += 1;
  report.summary[group] = summary;
}

async function saveArtifacts(report) {
  await writeFile(HEALTH_REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');
  await writeFile(HEALTH_LOG_PATH, logs.join('\n') + '\n', 'utf8');
}

async function fetchWithTiming(url, options = {}) {
  const start = performance.now();
  const response = await fetch(url, options);
  const durationMs = Math.round(performance.now() - start);
  const body = await response.text();
  return { response, body, durationMs };
}

function findAssetUrls(html, baseUrl) {
  const urls = new Set();
  const pattern = /(?:href|src)=['"]([^'"\s>]+)['"]/gi;
  let match;
  const origin = new URL(baseUrl).origin;
  while ((match = pattern.exec(html))) {
    const raw = match[1];
    if (!raw || raw.startsWith('data:') || raw.startsWith('mailto:') || raw.startsWith('tel:')) continue;
    try {
      const resolved = new URL(raw, baseUrl);
      if (resolved.origin === origin) urls.add(resolved.toString());
    } catch {
      // Skip invalid URLs
    }
  }
  return Array.from(urls).slice(0, 20);
}

async function checkWebsiteRoutes(report, targetUrl) {
  appendLog(`Starting website route checks for ${targetUrl}`);
  const homepageResult = { route: '/', html: null };

  for (const route of SITE_ROUTES) {
    const routeUrl = new URL(route, targetUrl).toString();
    const start = performance.now();
    try {
      const { response, body, durationMs } = await fetchWithTiming(routeUrl, { cache: 'no-store' });
      const ok = response.status === 200;
      appendLog(`Route ${route} returned ${response.status} in ${durationMs}ms`, ok ? 'success' : 'error');
      recordCheck(report, {
        group: 'website',
        name: `Route ${route}`,
        route,
        ok,
        critical: true,
        status: response.status,
        durationMs,
        timestamp: new Date().toISOString(),
        details: ok ? 'OK' : `Expected 200, got ${response.status}`
      });
      if (!ok) break;
      if (route === '/') {
        homepageResult.html = body;
        if (body.includes('Configuration Error') || body.includes('Missing required environment variable')) {
          appendLog('Homepage contains environment configuration error text', 'error');
          recordCheck(report, {
            group: 'website',
            name: 'Homepage configuration validation',
            route,
            ok: false,
            critical: true,
            status: response.status,
            durationMs,
            timestamp: new Date().toISOString(),
            details: 'Detected homepage configuration error text'
          });
          break;
        }
      }
      if (route === '/non-existent-route' && response.status !== 200) break;
    } catch (error) {
      const durationMs = Math.round(performance.now() - start);
      appendLog(`Route ${route} failed: ${error.message}`, 'error');
      recordCheck(report, {
        group: 'website',
        name: `Route ${route}`,
        route,
        ok: false,
        critical: true,
        status: null,
        durationMs,
        timestamp: new Date().toISOString(),
        details: error.message
      });
      break;
    }
  }

  if (homepageResult.html) {
    await checkAssets(report, targetUrl, homepageResult.html);
  }
}

async function checkAssets(report, targetUrl, homepageHtml) {
  appendLog('Checking frontend assets discovered in homepage HTML');
  const assetUrls = findAssetUrls(homepageHtml, targetUrl);
  const requiredAssets = assetUrls.filter((url) => !OPTIONAL_ASSETS.some((p) => url.endsWith(p)));
  const optionalAssets = OPTIONAL_ASSETS.map((path) => new URL(path, targetUrl).toString());

  for (const assetUrl of [...requiredAssets, ...optionalAssets]) {
    const isOptional = OPTIONAL_ASSETS.some((path) => assetUrl.endsWith(path));
    const start = performance.now();
    try {
      const { response, durationMs } = await fetchWithTiming(assetUrl, { cache: 'no-store' });
      const ok = response.status === 200;
      appendLog(`Asset ${assetUrl} returned ${response.status} in ${durationMs}ms`, ok ? 'success' : isOptional ? 'info' : 'error');
      recordCheck(report, {
        group: 'website',
        name: `Asset ${assetUrl}`,
        route: assetUrl,
        ok,
        critical: !isOptional,
        status: response.status,
        durationMs,
        timestamp: new Date().toISOString(),
        details: ok ? 'Loaded' : `Expected 200, got ${response.status}`
      });
    } catch (error) {
      const durationMs = Math.round(performance.now() - start);
      appendLog(`Asset ${assetUrl} failed: ${error.message}`, isOptional ? 'info' : 'error');
      recordCheck(report, {
        group: 'website',
        name: `Asset ${assetUrl}`,
        route: assetUrl,
        ok: false,
        critical: !isOptional,
        status: null,
        durationMs,
        timestamp: new Date().toISOString(),
        details: error.message
      });
    }
  }
}

async function checkExternalApis(report) {
  appendLog('Checking external API dependencies');

  for (const api of EXTERNAL_API_CHECKS) {
    const headers = api.headers || {};
    const options = { method: api.method, headers, cache: 'no-store' };
    if (api.body) options.body = api.body;
    const start = performance.now();

    try {
      const { response, body, durationMs } = await fetchWithTiming(api.url, options);
      const validationError = await api.validate(response, body);
      const ok = !validationError;
      appendLog(`${api.name} returned ${response.status} in ${durationMs}ms`, ok ? 'success' : 'error');
      recordCheck(report, {
        group: 'api',
        name: api.name,
        route: api.url,
        ok,
        critical: true,
        status: response.status,
        durationMs,
        timestamp: new Date().toISOString(),
        details: ok ? 'OK' : validationError
      });
    } catch (error) {
      const durationMs = Math.round(performance.now() - start);
      appendLog(`${api.name} check failed: ${error.message}`, 'error');
      recordCheck(report, {
        group: 'api',
        name: api.name,
        route: api.url,
        ok: false,
        critical: true,
        status: null,
        durationMs,
        timestamp: new Date().toISOString(),
        details: error.message
      });
    }
  }
}

async function findSafeSupabaseTable(supabaseUrl, anonKey) {
  appendLog('Determining safe Supabase table for anonymous access');
  for (const candidate of SUPABASE_CANDIDATE_TABLES) {
    const supabase = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const start = performance.now();
    const { data, error } = await supabase.from(candidate.table).select(candidate.key).limit(1);
    const durationMs = Math.round(performance.now() - start);
    if (!error) {
      appendLog(`Candidate table ${candidate.table} accessible in ${durationMs}ms`, 'success');
      return { ...candidate, durationMs, rows: Array.isArray(data) ? data.length : 0 };
    }
    if (error.code === 'PGRST116') {
      appendLog(`Candidate table ${candidate.table} accessible but empty (${error.message})`, 'success');
      return { ...candidate, durationMs, rows: 0 };
    }
    appendLog(`Candidate table ${candidate.table} not accessible: ${error.message}`, 'info');
  }
  throw new Error('No safe public Supabase table is readable with the anonymous key');
}

async function checkSupabase(report, supabaseUrl, anonKey) {
  appendLog('Checking Supabase connectivity');
  const safeTable = await findSafeSupabaseTable(supabaseUrl, anonKey);
  report.summary.safeSupabaseTable = safeTable.table;

  const restStart = performance.now();
  const restUrl = new URL(`/rest/v1/${safeTable.table}?select=${safeTable.key}&limit=1`, supabaseUrl).toString();
  try {
    const { response, body, durationMs } = await fetchWithTiming(restUrl, {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/json'
      }
    });
    if (response.status !== 200) {
      throw new Error(`Supabase REST returned ${response.status}`);
    }
    const payload = JSON.parse(body);
    if (!Array.isArray(payload)) {
      throw new Error('Supabase REST response did not return an array');
    }
    appendLog(`Supabase REST check passed for ${safeTable.table} in ${durationMs}ms`, 'success');
    recordCheck(report, {
      group: 'supabase',
      name: `Supabase REST ${safeTable.table}`,
      route: restUrl,
      ok: true,
      critical: true,
      status: response.status,
      durationMs,
      timestamp: new Date().toISOString(),
      details: `Rows returned: ${payload.length}`
    });
  } catch (error) {
    const durationMs = Math.round(performance.now() - restStart);
    appendLog(`Supabase REST check failed: ${error.message}`, 'error');
    recordCheck(report, {
      group: 'supabase',
      name: `Supabase REST ${safeTable.table}`,
      route: restUrl,
      ok: false,
      critical: true,
      status: null,
      durationMs,
      timestamp: new Date().toISOString(),
      details: error.message
    });
  }

  const clientStart = performance.now();
  try {
    const supabase = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const { data, error } = await supabase.from(safeTable.table).select(safeTable.key).limit(1);
    const durationMs = Math.round(performance.now() - clientStart);
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    if (!Array.isArray(data) && error?.code !== 'PGRST116') {
      throw new Error('Supabase client returned unexpected data');
    }
    appendLog(`Supabase client query passed in ${durationMs}ms`, 'success');
    recordCheck(report, {
      group: 'supabase',
      name: `Supabase client ${safeTable.table}`,
      route: safeTable.table,
      ok: true,
      critical: true,
      status: 200,
      durationMs,
      timestamp: new Date().toISOString(),
      details: `Safe table: ${safeTable.table}`
    });
  } catch (error) {
    const durationMs = Math.round(performance.now() - clientStart);
    appendLog(`Supabase client check failed: ${error.message}`, 'error');
    recordCheck(report, {
      group: 'supabase',
      name: `Supabase client ${safeTable.table}`,
      route: safeTable.table,
      ok: false,
      critical: true,
      status: null,
      durationMs,
      timestamp: new Date().toISOString(),
      details: error.message
    });
  }
}

function aggregateSummary(report) {
  const website = report.summary.website;
  const api = report.summary.api;
  const supabase = report.summary.supabase;
  const criticalFailed = [website, api, supabase].some((group) => group.failed > 0);
  report.summary.overall = criticalFailed ? 'fail' : 'pass';
  return !criticalFailed;
}

function summarizeReport(report) {
  appendLog('\nHealth report generated');
  appendLog(`Website: passed=${report.summary.website.passed} failed=${report.summary.website.failed} warnings=${report.summary.website.warnings}`);
  appendLog(`API: passed=${report.summary.api.passed} failed=${report.summary.api.failed} warnings=${report.summary.api.warnings}`);
  appendLog(`Supabase: passed=${report.summary.supabase.passed} failed=${report.summary.supabase.failed} warnings=${report.summary.supabase.warnings}`);
  appendLog(`Overall result: ${report.summary.overall.toUpperCase()}`);
  if (report.summary.safeSupabaseTable) {
    appendLog(`Safe Supabase table used: ${report.summary.safeSupabaseTable}`);
  }
}

export async function runHealthChecks({ baseUrl }) {
  const report = buildReportBase();
  const startedAt = performance.now();

  try {
    report.summary.websiteUrl = normalizeUrl(resolveDeploymentUrl(baseUrl));
  } catch (error) {
    appendLog(error.message, 'error');
    recordCheck(report, {
      group: 'website',
      name: 'Website URL validation',
      ok: false,
      critical: true,
      status: null,
      durationMs: 0,
      timestamp: new Date().toISOString(),
      details: error.message
    });
    report.summary.overall = 'fail';
    await saveArtifacts(report);
    return false;
  }

  const websiteUrl = report.summary.websiteUrl;

  let envOk = true;
  for (const name of REQUIRED_ENV_VARS) {
    try {
      requiredEnv(name);
      recordCheck(report, {
        group: 'website',
        name: `Environment variable ${name}`,
        ok: true,
        critical: true,
        status: 200,
        durationMs: 0,
        timestamp: new Date().toISOString(),
        details: 'Present'
      });
    } catch (error) {
      appendLog(error.message, 'error');
      recordCheck(report, {
        group: 'website',
        name: `Environment variable ${name}`,
        ok: false,
        critical: true,
        status: null,
        durationMs: 0,
        timestamp: new Date().toISOString(),
        details: error.message
      });
      envOk = false;
    }
  }

  if (envOk) {
    await checkWebsiteRoutes(report, websiteUrl);
    await checkExternalApis(report);
    try {
      await checkSupabase(report, requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_ANON_KEY'));
    } catch (error) {
      appendLog(error.message, 'error');
      recordCheck(report, {
        group: 'supabase',
        name: 'Supabase table discovery',
        ok: false,
        critical: true,
        status: null,
        durationMs: 0,
        timestamp: new Date().toISOString(),
        details: error.message
      });
    }
  }

  report.summary.durationMs = Math.round(performance.now() - startedAt);
  const success = aggregateSummary(report);
  summarizeReport(report);
  await saveArtifacts(report);
  return success;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const rawArg = process.argv[2];
  if (!rawArg || rawArg === '--help' || rawArg === '-h') {
    printUsage();
    process.exit(0);
  }

  const baseUrl = rawArg;
  try {
    const success = await runHealthChecks({ baseUrl });
    process.exit(success ? 0 : 1);
  } catch (error) {
    appendLog(`Health check runner failed: ${error.message}`, 'error');
    await writeFile(HEALTH_REPORT_PATH, JSON.stringify({ error: error.message, generatedAt: new Date().toISOString() }, null, 2), 'utf8');
    await writeFile(HEALTH_LOG_PATH, logs.join('\n') + '\n', 'utf8');
    process.exit(1);
  }
}
