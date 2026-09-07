import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('response', response => {
    if (!response.ok()) {
      console.log('PAGE NETWORK ERROR:', response.status(), response.url());
    }
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  
  await browser.close();
})();
