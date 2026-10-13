// Regenerates public/og-en.png, public/og-ru.png and public/apple-touch-icon.png.
// Usage: node scripts/make-og.cjs  (requires Playwright: npx playwright or a global install)
const path = require("node:path");
let pw;
try { pw = require("playwright"); } catch { pw = require(require("node:child_process").execSync("npm root -g").toString().trim() + "/playwright"); }
(async () => {
  const browser = await pw.chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const card = "file://" + path.join(__dirname, "og-card.html");
  for (const l of ["en", "ru"]) {
    await page.goto(`${card}?${l}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(__dirname, `../public/og-${l}.png`) });
  }
  await page.setViewportSize({ width: 180, height: 180 });
  await page.setContent(`<body style="margin:0;width:180px;height:180px;background:#0B1016;display:grid;place-items:center"><svg width="120" height="120" viewBox="0 0 56 56" fill="none"><circle cx="22" cy="28" r="14" stroke="#4F8AFF" stroke-width="3"/><circle cx="34" cy="28" r="14" fill="#4F8AFF"/><path d="M22 14a14 14 0 010 28" stroke="#0B1016" stroke-width="3" stroke-linecap="round"/></svg></body>`);
  await page.screenshot({ path: path.join(__dirname, "../public/apple-touch-icon.png") });
  await browser.close();
})();
