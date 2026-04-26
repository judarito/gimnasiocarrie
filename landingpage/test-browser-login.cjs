const puppeteer = require('puppeteer');
const http = require('http');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  // Bypass Auth: I will just disable auth requirement in the API for this test.
  // Actually, wait, let's just use the real db to find a user and hash a token!
  // No, just modifying the response of the API is easier, but we don't have access to modify the running server easily.
  // Let's create a SQLite script to insert a token!
  
  await browser.close();
})();
