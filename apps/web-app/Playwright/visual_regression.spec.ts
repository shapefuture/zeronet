import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const BASELINE_DIR = path.resolve(__dirname, '../../screenshots/baseline');
const PR_DIR = path.resolve(__dirname, '../../screenshots/pr');
const DIFF_DIR = path.resolve(__dirname, '../../screenshots/diff');
const THRESHOLD = 0.05;

test('Visual regression against baseline', async ({ page }) => {
  await page.goto('/');
  const screenshot = await page.screenshot();
  const fileName = 'home.png';
  const baselinePath = path.join(BASELINE_DIR, fileName);
  const prPath = path.join(PR_DIR, fileName);
  const diffPath = path.join(DIFF_DIR, fileName);

  fs.mkdirSync(PR_DIR, { recursive: true });
  fs.mkdirSync(DIFF_DIR, { recursive: true });
  fs.writeFileSync(prPath, screenshot);

  if (fs.existsSync(baselinePath)) {
    const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
    const img2 = PNG.sync.read(fs.readFileSync(prPath));
    const diff = new PNG({ width: img1.width, height: img1.height });
    const mismatched = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: THRESHOLD });
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    expect(mismatched).toBeLessThan(img1.width * img1.height * THRESHOLD);
  } else {
    // First PR run: promote actual as baseline
    fs.copyFileSync(prPath, baselinePath);
  }
});