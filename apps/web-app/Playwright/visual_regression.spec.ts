import { test, expect } from '@playwright/test';
import fs from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

test('@visual Visual regression: home page', async ({ page }) => {
  await page.goto('/');
  const screenshot = await page.screenshot({ fullPage: true });
  const baselinePath = './screenshots/baseline-home.png';
  const currentPath = './screenshots/pr-home.png';
  fs.writeFileSync(currentPath, screenshot);

  if (!fs.existsSync(baselinePath)) {
    // Save first baseline
    fs.writeFileSync(baselinePath, screenshot);
    // Test passes since there's nothing to diff against
    return;
  }
  // Load PNGs
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const current = PNG.sync.read(fs.readFileSync(currentPath));
  const { width, height } = baseline;
  const diff = new PNG({ width, height });
  const pixelDiff = pixelmatch(
    baseline.data, current.data, diff.data, width, height, { threshold: 0.05 }
  );
  if (pixelDiff > 0) {
    const diffPath = './screenshots/diff-home.png';
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
  }
  // Fail test if significant difference
  expect(pixelDiff).toBeLessThan(200);
});