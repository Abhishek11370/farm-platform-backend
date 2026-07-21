const { chromium } = require('playwright');
const fs = require('fs');

const URL = 'http://localhost:5174/login';
const ADMIN_EMAIL = 'admin@farmplatform.com';
const ADMIN_PASS = 'Admin@123';

const errors = [];
const networkErrors = [];

async function main() {
  console.log('Starting QA Script...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
      console.log(`[PAGE ERROR] ${msg.text()}`);
    }
  });

  page.on('response', response => {
    if (response.status() >= 400 && response.status() !== 401) { // 401 on first login check might be expected
      networkErrors.push(`[${response.status()}] ${response.url()}`);
      console.log(`[NETWORK ERROR] ${response.status()} ${response.url()}`);
    }
  });

  try {
    // 1. Login
    console.log('Navigating to Login...');
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    console.log('✅ Login successful');

    // 2. Sidebar items to test
    const routes = [
      '/admin', // Dashboard
      '/admin/users', // Users
      '/admin/farmers', // Farmers
      '/admin/products', // Products
      '/admin/categories', // Categories
      '/admin/inventory', // Inventory
      '/admin/orders', // Orders
      '/admin/auctions', // Auctions
      '/admin/payments', // Payments
      '/admin/delivery', // Delivery
      '/admin/reviews', // Reviews
      '/admin/support/chats', // Chats
      '/admin/support', // Support
      '/admin/notifications', // Notifications
      '/admin/reports', // Reports
      '/admin/analytics', // Analytics
      '/admin/ai', // AI
      '/admin/cms', // CMS
      '/admin/marketing', // Marketing
      '/admin/settings' // Settings
    ];

    console.log('Checking all routes...');
    for (const route of routes) {
      console.log(`Navigating to ${route}...`);
      await page.goto(`http://localhost:5174${route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500); // give it a moment to render tables
      
      // Check if page loaded without throwing a giant react error
      const bodyText = await page.innerText('body');
      if (bodyText.includes('Application Error') || bodyText.includes('Minified React error')) {
         errors.push(`React Crash on ${route}`);
      }

      // If it's a table page, check for rows
      const hasTable = await page.$('table');
      if (hasTable) {
        const rowCount = await page.$$eval('tbody tr', rows => rows.length);
        console.log(`   Table found on ${route} with ${rowCount} rows.`);
        if (rowCount === 0) {
           // Might be empty but let's record it
           // errors.push(`Empty table on ${route}`); 
           console.log(`   (No records found on ${route})`);
        }
      }
    }
    console.log('✅ All routes visited');
    
    // 3. Output Report
    const report = `# QA Execution Report\n\n` +
      `## Pages Visited\n${routes.map(r => '- ' + r).join('\n')}\n\n` +
      `## Console Errors\n${errors.length === 0 ? 'None' : errors.join('\n')}\n\n` +
      `## Network Errors\n${networkErrors.length === 0 ? 'None' : networkErrors.join('\n')}\n`;

    fs.writeFileSync('../FINAL_QA_REPORT.md', report);
    console.log('Report generated at ../FINAL_QA_REPORT.md');

  } catch (e) {
    console.error('QA Script failed:', e);
    fs.writeFileSync('../FINAL_QA_REPORT.md', `# QA Failure\nScript failed during execution:\n${e.message}`);
  } finally {
    await browser.close();
  }
}

main();
