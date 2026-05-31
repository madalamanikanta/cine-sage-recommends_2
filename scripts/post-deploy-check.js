#!/usr/bin/env node
// Post-deployment checker wrapper for CineSage.
// This script forwards the CLI to the shared health-check utility.

import { runHealthChecks } from './health-check.js';

const targetUrl = process.argv[2] || process.env.WEBSITE_URL || process.env.PRODUCTION_URL;

if (!targetUrl) {
  console.error('❌ Usage: node scripts/post-deploy-check.js <base-url>');
  console.error('   Or set WEBSITE_URL / PRODUCTION_URL as an environment variable.');
  process.exit(1);
}

try {
  const success = await runHealthChecks({ baseUrl: targetUrl });
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error('❌ Unexpected error:', error.message);
  process.exit(1);
}
