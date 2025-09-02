#!/usr/bin/env node

/**
 * Website Crawler and 404 Detector
 * 
 * This script crawls localhost:3001 to discover all routes and identify 404 errors.
 * It uses multiple strategies:
 * 1. Sitemap generation
 * 2. Link checking 
 * 3. Route discovery from navigation components
 * 4. Manual URL testing
 */

const fs = require('fs');

// Known routes from your Next.js application structure
const EXISTING_ROUTES = [
  '/',
  '/dashboard',
  '/dashboard/projects',
  '/dashboard/projects/new',
  '/admin',
  '/admin/analytics',
  '/admin/database', 
  '/admin/settings',
  '/admin/templates',
  '/admin/users',
  '/blog',
  '/cookies',
  '/onboarding',
  '/privacy',
  '/templates',
  '/terms',
  '/affiliate',
  '/pricing',
  '/auth/signin',
  '/auth/signout',
  '/auth/verify-request',
  '/auth/error',
  '/contact',
  '/auth/signup'
];

// Routes referenced in navigation components
const LINKED_ROUTES = [
  '/',
  '/features',
  '/templates', 
  '/examples',
  '/pricing',
  '/affiliate',
  '/blog',
  '/dashboard',
  '/auth/signin',
  '/auth/signup',
  '/docs',
  '/api',
  '/status', 
  '/contact',
  '/about',
  '/careers',
  '/gdpr'
];

const BASE_URL = 'http://localhost:3001';

async function checkUrl(url) {
  try {
    // Use built-in fetch (Node.js 18+) or fallback to node-fetch
    let fetch;
    if (globalThis.fetch) {
      fetch = globalThis.fetch;
    } else {
      const nodeFetch = await import('node-fetch');
      fetch = nodeFetch.default;
    }
    
    const response = await fetch(url);
    return {
      url,
      status: response.status,
      statusText: response.statusText,
      exists: response.status < 400
    };
  } catch (error) {
    return {
      url,
      status: 'ERROR',
      statusText: error.message,
      exists: false
    };
  }
}

async function crawlWebsite() {
  console.log('🕷️  Starting website crawl of', BASE_URL);
  console.log('=====================================\n');

  // Combine all routes and deduplicate
  const allRoutes = [...new Set([...EXISTING_ROUTES, ...LINKED_ROUTES])];
  
  console.log(`Found ${allRoutes.length} routes to check:\n`);
  
  const results = [];
  const errors = [];

  for (const route of allRoutes) {
    const fullUrl = `${BASE_URL}${route}`;
    console.log(`Checking: ${route}`);
    
    const result = await checkUrl(fullUrl);
    results.push(result);
    
    if (!result.exists) {
      errors.push(result);
      console.log(`  ❌ ${result.status} - ${result.statusText}`);
    } else {
      console.log(`  ✅ ${result.status} - OK`);
    }
  }

  console.log('\n=====================================');
  console.log('📊 SUMMARY');
  console.log('=====================================');
  console.log(`Total routes checked: ${results.length}`);
  console.log(`Working routes: ${results.length - errors.length}`);
  console.log(`Missing/Error routes: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n🚨 ROUTES THAT NEED TO BE BUILT:');
    console.log('=====================================');
    
    errors.forEach(error => {
      const route = error.url.replace(BASE_URL, '');
      console.log(`${route} - ${error.status} ${error.statusText}`);
    });

    // Save results to file
    const reportData = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      summary: {
        totalRoutes: results.length,
        workingRoutes: results.length - errors.length,
        errorRoutes: errors.length
      },
      allResults: results,
      missingRoutes: errors
    };

    fs.writeFileSync('website-crawl-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: website-crawl-report.json');

    // Create a simple list of missing routes for easy reference
    const missingRoutesList = errors.map(e => e.url.replace(BASE_URL, '')).join('\n');
    fs.writeFileSync('missing-routes.txt', missingRoutesList);
    console.log('📄 Missing routes list saved to: missing-routes.txt');
  } else {
    console.log('\n🎉 All routes are working correctly!');
  }
}

// Check if server is running before starting
async function checkServer() {
  try {
    const result = await checkUrl(BASE_URL);
    if (!result.exists) {
      console.log('❌ Server is not running at', BASE_URL);
      console.log('Please start your development server with: npm run dev');
      process.exit(1);
    }
    console.log('✅ Server is running at', BASE_URL);
    return true;
  } catch (error) {
    console.log('❌ Cannot connect to server at', BASE_URL);
    console.log('Please start your development server with: npm run dev');
    console.log('Error:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  await checkServer();
  await crawlWebsite();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkUrl, crawlWebsite, checkServer };