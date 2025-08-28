#!/usr/bin/env node

/**
 * Post-deployment smoke test script for CineSage
 * Validates critical functionality after deployment
 */

const https = require('https');
const http = require('http');

class PostDeployChecker {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.results = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${path}`;
      const client = url.startsWith('https') ? https : http;
      
      const req = client.get(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  async checkRoute(path, expectedStatus = 200, description = '') {
    try {
      this.log(`Checking ${path}${description ? ` - ${description}` : ''}`);
      const response = await this.makeRequest(path);
      
      if (response.statusCode === expectedStatus) {
        this.log(`✓ ${path} returned ${response.statusCode}`, 'success');
        this.results.push({ path, status: 'pass', statusCode: response.statusCode });
        return true;
      } else {
        this.log(`✗ ${path} returned ${response.statusCode}, expected ${expectedStatus}`, 'error');
        this.results.push({ path, status: 'fail', statusCode: response.statusCode, expected: expectedStatus });
        return false;
      }
    } catch (error) {
      this.log(`✗ ${path} failed: ${error.message}`, 'error');
      this.results.push({ path, status: 'error', error: error.message });
      return false;
    }
  }

  async checkSPARouting() {
    this.log('\n🔍 Testing SPA Routing...');
    const routes = [
      '/',
      '/auth',
      '/dashboard',
      '/catalog',
      '/preferences',
      '/recommendations',
      '/profile',
      '/non-existent-route' // Should still return 200 for SPA
    ];

    let passed = 0;
    for (const route of routes) {
      const success = await this.checkRoute(route, 200, 'SPA routing');
      if (success) passed++;
    }

    return passed === routes.length;
  }

  async checkStaticAssets() {
    this.log('\n📦 Testing Static Assets...');
    const assets = [
      '/favicon.ico',
      '/robots.txt'
    ];

    let passed = 0;
    for (const asset of assets) {
      const success = await this.checkRoute(asset, 200, 'static asset');
      if (success) passed++;
    }

    return passed >= assets.length - 1; // Allow some assets to be missing
  }

  async checkEnvironmentVariables() {
    this.log('\n🔧 Checking Environment Configuration...');
    
    try {
      const response = await this.makeRequest('/');
      const html = response.body;
      
      // Check if the app loads without configuration errors
      if (html.includes('Configuration Error') || html.includes('environment variable')) {
        this.log('✗ Environment configuration issues detected', 'error');
        return false;
      }
      
      this.log('✓ No obvious environment configuration errors', 'success');
      return true;
    } catch (error) {
      this.log(`✗ Failed to check environment: ${error.message}`, 'error');
      return false;
    }
  }

  async checkPerformance() {
    this.log('\n⚡ Performance Check...');
    
    const start = Date.now();
    try {
      await this.makeRequest('/');
      const loadTime = Date.now() - start;
      
      if (loadTime < 3000) {
        this.log(`✓ Page loaded in ${loadTime}ms`, 'success');
        return true;
      } else {
        this.log(`⚠️ Page loaded in ${loadTime}ms (slow)`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`✗ Performance check failed: ${error.message}`, 'error');
      return false;
    }
  }

  async checkSecurityHeaders() {
    this.log('\n🔒 Security Headers Check...');
    
    try {
      const response = await this.makeRequest('/');
      const headers = response.headers;
      
      const securityChecks = [
        { header: 'x-frame-options', required: false },
        { header: 'x-content-type-options', required: false },
        { header: 'referrer-policy', required: false }
      ];

      let passed = 0;
      for (const check of securityChecks) {
        if (headers[check.header]) {
          this.log(`✓ ${check.header}: ${headers[check.header]}`, 'success');
          passed++;
        } else if (check.required) {
          this.log(`✗ Missing required header: ${check.header}`, 'error');
        } else {
          this.log(`ℹ️ Optional header not set: ${check.header}`);
        }
      }

      return true; // Security headers are optional for this check
    } catch (error) {
      this.log(`✗ Security headers check failed: ${error.message}`, 'error');
      return false;
    }
  }

  generateReport() {
    this.log('\n📊 DEPLOYMENT HEALTH REPORT');
    this.log('=' .repeat(50));
    
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const errors = this.results.filter(r => r.status === 'error').length;
    
    this.log(`Total Checks: ${this.results.length}`);
    this.log(`Passed: ${passed}`, 'success');
    this.log(`Failed: ${failed}`, failed > 0 ? 'error' : 'info');
    this.log(`Errors: ${errors}`, errors > 0 ? 'error' : 'info');
    
    if (failed > 0 || errors > 0) {
      this.log('\n❌ DEPLOYMENT ISSUES DETECTED', 'error');
      this.log('Please review the failed checks above.');
      return false;
    } else {
      this.log('\n✅ DEPLOYMENT HEALTHY', 'success');
      this.log('All critical checks passed!');
      return true;
    }
  }

  async runAllChecks() {
    this.log(`🚀 Starting post-deployment checks for: ${this.baseUrl}`);
    this.log('=' .repeat(60));

    const checks = [
      () => this.checkSPARouting(),
      () => this.checkStaticAssets(),
      () => this.checkEnvironmentVariables(),
      () => this.checkPerformance(),
      () => this.checkSecurityHeaders()
    ];

    for (const check of checks) {
      await check();
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause between checks
    }

    return this.generateReport();
  }
}

// CLI Usage
if (require.main === module) {
  const baseUrl = process.argv[2];
  
  if (!baseUrl) {
    console.error('❌ Usage: node post-deploy-check.js <base-url>');
    console.error('   Example: node post-deploy-check.js https://your-app.vercel.app');
    process.exit(1);
  }

  const checker = new PostDeployChecker(baseUrl);
  checker.runAllChecks()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Unexpected error:', error.message);
      process.exit(1);
    });
}

module.exports = PostDeployChecker;
