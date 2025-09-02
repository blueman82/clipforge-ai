#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function checkRoute(baseUrl, route) {
  try {
    const url = `${baseUrl}${route}`;
    const response = await fetch(url, { 
      method: 'GET',
      redirect: 'manual'
    });
    return {
      route,
      status: response.status,
      ok: response.ok,
      redirected: response.status >= 300 && response.status < 400
    };
  } catch (error) {
    return {
      route,
      status: 'error',
      ok: false,
      error: error.message
    };
  }
}

async function findAllRoutes() {
  const routes = new Set();
  
  // Add known routes from navigation and spec
  const knownRoutes = [
    '/',
    '/pricing',
    '/templates',
    '/blog',
    '/affiliate',
    '/contact',
    '/about',
    '/features',
    '/how-it-works',
    '/faq',
    '/auth/signin',
    '/auth/signup',
    '/auth/signout',
    '/auth/verify-request',
    '/auth/error',
    '/dashboard',
    '/dashboard/projects',
    '/dashboard/projects/new',
    '/dashboard/settings',
    '/dashboard/billing',
    '/dashboard/affiliate',
    '/admin',
    '/admin/users',
    '/admin/templates',
    '/admin/analytics',
    '/admin/database',
    '/admin/settings',
    '/admin/jobs',
    '/onboarding',
    '/terms',
    '/privacy',
    '/cookies',
    '/api/health',
    '/sitemap.xml',
    '/robots.txt'
  ];
  
  knownRoutes.forEach(route => routes.add(route));
  
  // Find all page.tsx files
  const appDir = path.join(__dirname, 'src/app');
  
  function scanDirectory(dir, basePath = '') {
    try {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('_') && file !== 'api') {
          const newBasePath = basePath + '/' + file;
          
          // Check if directory has page.tsx
          const pageFile = path.join(filePath, 'page.tsx');
          if (fs.existsSync(pageFile)) {
            routes.add(newBasePath || '/');
          }
          
          // Recurse into subdirectory
          scanDirectory(filePath, newBasePath);
        }
      });
    } catch (error) {
      console.error(`Error scanning ${dir}:`, error.message);
    }
  }
  
  scanDirectory(appDir);
  
  return Array.from(routes).sort();
}

async function crawlWebsite() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🕷️  Starting website crawler...\n');
  
  // Check if server is running
  try {
    await fetch(baseUrl);
  } catch (error) {
    console.error('❌ Server not running at', baseUrl);
    console.log('Please start the dev server with: npm run dev');
    process.exit(1);
  }
  
  const routes = await findAllRoutes();
  console.log(`Found ${routes.length} routes to check\n`);
  
  const results = [];
  const missing = [];
  const errors = [];
  
  for (const route of routes) {
    const result = await checkRoute(baseUrl, route);
    results.push(result);
    
    if (result.status === 404) {
      missing.push(route);
      console.log(`❌ 404: ${route}`);
    } else if (result.status === 'error') {
      errors.push(route);
      console.log(`⚠️  Error: ${route} - ${result.error}`);
    } else if (result.redirected) {
      console.log(`↪️  ${result.status}: ${route} (redirected)`);
    } else if (result.ok) {
      console.log(`✅ ${result.status}: ${route}`);
    } else {
      console.log(`⚠️  ${result.status}: ${route}`);
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`Total routes: ${routes.length}`);
  console.log(`✅ Working: ${results.filter(r => r.ok).length}`);
  console.log(`❌ Missing (404): ${missing.length}`);
  console.log(`⚠️  Errors: ${errors.length}`);
  
  if (missing.length > 0) {
    console.log('\n🔴 Missing pages that need to be created:');
    missing.forEach(route => console.log(`  - ${route}`));
  }
  
  // Save results to file
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl,
    summary: {
      total: routes.length,
      ok: results.filter(r => r.ok).length,
      missing: missing.length,
      errors: errors.length
    },
    results,
    missing,
    errors
  };
  
  fs.writeFileSync('crawler-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Full report saved to crawler-report.json');
}

crawlWebsite().catch(console.error);