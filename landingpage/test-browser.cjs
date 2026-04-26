const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });
  
  // click hero tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.admin__tab'));
    const heroTab = tabs.find(t => t.textContent.includes('Hero'));
    if (heroTab) heroTab.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
