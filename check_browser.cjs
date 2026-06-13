const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Catch console messages
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    
    // Catch page errors
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    
    await page.goto('http://localhost:5175/', { waitUntil: 'networkidle2' });
    
    // wait a bit for react to render
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const html = await page.content();
    console.log('PAGE HTML LENGTH:', html.length);
    if (html.length < 2000) {
       console.log('HTML SNIPPET:', html.substring(0, 500));
    }
    
    await browser.close();
  } catch (error) {
    console.error('SCRIPT ERROR:', error);
  }
})();
