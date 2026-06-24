import { test, expect } from '@playwright/test';

test.describe('Work gallery', () => {
  test('page loads with filters and grid', async ({ page }) => {
    await page.goto('/work');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('tab', { name: /All/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^View /i }).first()).toBeVisible();
  });

  test('clicking a card opens the lightbox, Escape closes it', async ({ page }) => {
    await page.goto('/work');
    await page.getByRole('button', { name: /^View /i }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('category filter narrows the grid', async ({ page }) => {
    await page.goto('/work');
    const before = await page.getByRole('button', { name: /^View /i }).count();
    // Pick the first real category (tab index 1 — index 0 is "All").
    await page.getByRole('tab').nth(1).click();
    const after = await page.getByRole('button', { name: /^View /i }).count();
    expect(after).toBeLessThanOrEqual(before);
    expect(after).toBeGreaterThan(0);
  });

  test('homepage showreel links to /work', async ({ page }) => {
    await page.goto('/');
    await page.locator('#work').scrollIntoViewIfNeeded();
    const link = page.getByRole('link', { name: /View all work/i });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/work$/);
  });
});
