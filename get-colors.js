const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.permitindo.com/');
  
  // Extract CSS variables from :root
  const colors = await page.evaluate(() => {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    const result = {};
    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      if (prop.startsWith('--')) {
        result[prop] = computed.getPropertyValue(prop).trim();
      }
    }
    return result;
  });
  
  console.log(JSON.stringify(colors, null, 2));
  
  // Extract background colors of buttons
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, button')).map(el => {
      const style = getComputedStyle(el);
      return { text: el.innerText.trim(), bg: style.backgroundColor, color: style.color };
    }).filter(b => b.bg !== 'rgba(0, 0, 0, 0)' && b.bg !== 'transparent');
  });
  console.log(buttons.slice(0, 10));

  await browser.close();
})();