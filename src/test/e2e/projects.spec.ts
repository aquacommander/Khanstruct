import { test, expect } from '@playwright/test';

test.describe('Projects Pages', () => {
  test('projects index loads', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveTitle(/Projects|Khanstruct/);
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('discipline cards are shown', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('button', { name: /Frontend/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Backend/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /AI/i })).toBeVisible();
  });

  test('drilling into a discipline shows project cards linking to live projects', async ({ page }) => {
    await page.goto('/projects');
    // Level 1 → pick a discipline
    await page.getByRole('button', { name: /AI/i }).click();
    // Level 2 → project cards open the real project URL in a new tab
    const firstCard = page.locator('main a[target="_blank"]').first();
    await expect(firstCard).toBeVisible();
    const href = await firstCard.getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);
  });

  test('project detail has back navigation', async ({ page }) => {
    await page.goto('/projects/zebracat');
    const back = page.locator('a:has-text("All Projects")');
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/projects');
  });

  test('project detail has next project link', async ({ page }) => {
    await page.goto('/projects/zebracat');
    const next = page.locator('a:has-text("Next Project")').or(
      page.locator('.next')
    );
    await expect(next.first()).toBeAttached();
  });

  test('404 on unknown project slug', async ({ page }) => {
    const response = await page.goto('/projects/not-a-real-project-slug-xyz');
    expect(response?.status()).toBe(404);
  });
});
