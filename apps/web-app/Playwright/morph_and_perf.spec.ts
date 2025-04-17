import { test, expect } from '@playwright/test';

test('DOM morph patching renders expected snapshot', async ({ page }) => {
  await page.goto('/');
  // Trigger snapshot morph (simulate new data)
  await page.evaluate(() => {
    document.querySelector("#morph-trigger")?.dispatchEvent(new Event("update"));
  });
  const marker = await page.locator("h1");
  await expect(marker).toHaveText(/Ultra-Low Latency/);
});

test('First Contentful Paint is low', async ({ page }) => {
  await page.goto('/');
  const fcp = await page.evaluate(() =>
    new Promise(resolve => {
      new PerformanceObserver((list) => {
        const entry = list.getEntriesByName('first-contentful-paint')[0];
        if (entry) resolve(entry.startTime);
      }).observe({ type: 'paint', buffered: true });
    })
  );
  expect(Number(fcp)).toBeLessThan(2000); // 2s budget
});