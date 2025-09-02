# Website Crawler Tool Guide

## Overview

The `website-crawler.js` tool is a comprehensive Node.js script designed to crawl your ClipForge AI website at `http://localhost:3001` to discover all routes and identify 404 errors or missing pages.

## Features

- **Route Discovery**: Automatically identifies routes from:
  - Next.js application structure (`/src/app/*/page.tsx` files)
  - Navigation components (Header and Footer link references)
- **404 Detection**: Tests each route and reports HTTP status codes
- **Comprehensive Reporting**: Generates detailed reports in JSON and text formats
- **Server Status Check**: Verifies the development server is running before crawling
- **Error Handling**: Robust error handling with detailed error messages
- **Modern Node.js**: Uses built-in fetch (Node.js 18+) with fallback support

## Usage

### Prerequisites

1. **Node.js 18+ required** (uses built-in fetch)
2. **Development server running** at `http://localhost:3001`

### Starting the Development Server

```bash
# Start your Next.js development server
npm run dev
# or
yarn dev
# or 
pnpm dev
```

### Running the Crawler

```bash
# Make the script executable
chmod +x website-crawler.js

# Run the crawler
node website-crawler.js
```

### Expected Output

```
🕷️  Starting website crawl of http://localhost:3001
=====================================

Found 25 routes to check:

Checking: /
  ✅ 200 - OK
Checking: /dashboard
  ✅ 200 - OK
Checking: /features
  ❌ 404 - Not Found
...

=====================================
📊 SUMMARY
=====================================
Total routes checked: 25
Working routes: 20
Missing/Error routes: 5

🚨 ROUTES THAT NEED TO BE BUILT:
=====================================
/features - 404 Not Found
/examples - 404 Not Found
/docs - 404 Not Found
/api - 404 Not Found
/about - 404 Not Found

📄 Detailed report saved to: website-crawl-report.json
📄 Missing routes list saved to: missing-routes.txt
```

## Generated Reports

### 1. `website-crawl-report.json`
Comprehensive JSON report with:
- Timestamp and configuration
- Summary statistics
- Full results for all tested routes
- Detailed error information

### 2. `missing-routes.txt`
Simple list of missing routes (one per line) for easy reference:
```
/features
/examples
/docs
/api
/about
```

## Routes Tested

The crawler automatically tests these types of routes:

### Existing Routes (from app structure)
- `/` - Home page
- `/dashboard` - User dashboard
- `/dashboard/projects` - Projects listing
- `/dashboard/projects/new` - New project
- `/admin/*` - Admin pages
- `/auth/*` - Authentication pages
- Legal pages (`/privacy`, `/terms`, `/cookies`)

### Navigation Routes (from components)
- `/features` - Product features
- `/templates` - Template gallery
- `/examples` - Usage examples
- `/docs` - Documentation
- `/api` - API reference
- `/status` - System status
- `/about` - Company information
- `/careers` - Job listings
- `/gdpr` - GDPR compliance

## Error Handling

The crawler handles various error scenarios:

1. **Server not running**: Checks if `localhost:3001` is accessible
2. **Network errors**: Reports connection failures
3. **HTTP errors**: Captures and reports status codes
4. **Timeout handling**: Built-in fetch timeout support

## Integration with Development Workflow

### 1. Before Deployment
Run the crawler to identify missing pages:
```bash
node website-crawler.js
```

### 2. Create Missing Pages
Based on the report, create missing pages:
```bash
# Example: Create missing features page
mkdir -p src/app/features
echo "export default function FeaturesPage() { return <div>Features</div> }" > src/app/features/page.tsx
```

### 3. Re-run to Verify
```bash
node website-crawler.js
```

## Advanced Usage

### Custom Base URL
Modify the `BASE_URL` constant in the script:
```javascript
const BASE_URL = 'https://your-domain.com';
```

### Adding Custom Routes
Add routes to the `LINKED_ROUTES` array:
```javascript
const LINKED_ROUTES = [
  // ... existing routes
  '/custom-route',
  '/another-route'
];
```

### Programmatic Usage
Import and use the functions:
```javascript
const { checkUrl, crawlWebsite } = require('./website-crawler');

async function customCrawl() {
  const result = await checkUrl('http://localhost:3001/test');
  console.log(result);
}
```

## Troubleshooting

### Common Issues

1. **"Server is not running"**
   - Start your development server: `npm run dev`
   - Verify it's running at `localhost:3001`

2. **Permission denied**
   - Make script executable: `chmod +x website-crawler.js`

3. **Node.js version issues**
   - Ensure Node.js 18+ for built-in fetch
   - Script falls back to node-fetch for older versions

4. **Network timeouts**
   - Check your network connection
   - Verify no firewall blocking localhost access

### Debug Mode
Add console logs for debugging:
```javascript
// Add to the checkUrl function
console.log(`DEBUG: Testing URL: ${url}`);
```

## Contributing

To extend the crawler:

1. **Add new route sources**: Modify route discovery logic
2. **Enhanced reporting**: Add new report formats
3. **Performance testing**: Add response time tracking
4. **Content validation**: Check for specific content on pages

## Best Practices

1. **Run regularly**: Include in your development workflow
2. **CI/CD integration**: Add to your deployment pipeline  
3. **Documentation**: Keep route lists updated
4. **Monitoring**: Use for ongoing site maintenance

This tool helps ensure your ClipForge AI website has no broken internal links and all navigation routes are properly implemented.