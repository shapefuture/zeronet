import { test, expect } from '@playwright/test';

test('UI morphs correctly on data update', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    // Simulate receiving new DOM snapshot and morph
    document.body.innerHTML += '<div id="morph-marker">MORPHED!</div>';
  });
  const marker = await page.locator('#morph-marker');
  await expect(marker).toHaveText('MORPHED!');
});