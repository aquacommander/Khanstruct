import { test, expect } from '@playwright/test';

test.describe('Lead funnel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('#contact').scrollIntoViewIfNeeded();
  });

  test('Start a project button opens the funnel', async ({ page }) => {
    await page.getByRole('button', { name: /Start a project/i }).click();
    const dialog = page.getByRole('dialog', { name: /What can we build for you/i });
    await expect(dialog).toBeVisible();
  });

  test('completes the full funnel and submits a lead', async ({ page }) => {
    // Stub the lead endpoint so the test is hermetic (no Notion dependency).
    await page.route('**/api/lead', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, priority: 'hot' }),
      }),
    );

    await page.getByRole('button', { name: /Start a project/i }).click();
    const dialog = page.getByRole('dialog');

    // Step 1 — Service (single, auto-advances)
    await dialog.getByRole('radio', { name: /AI Implementation/i }).click();

    // Step 2 — Scope (multi, needs Continue)
    await expect(dialog.getByText(/What does it involve/i)).toBeVisible();
    await dialog.getByRole('checkbox', { name: /AI agent/i }).click();
    await dialog.getByRole('button', { name: /Continue/i }).click();

    // Step 3 — Timeline (auto-advances)
    await dialog.getByRole('radio', { name: /Right now/i }).click();

    // Step 4 — Budget (auto-advances)
    await dialog.getByRole('radio', { name: /\$15k\+/i }).click();

    // Step 5 — Details
    await expect(dialog.getByText(/Where should we reach you/i)).toBeVisible();
    await dialog.getByPlaceholder('Your name').fill('Test Client');
    await dialog.getByPlaceholder('you@company.com').fill('test@client.com');
    await dialog.getByRole('button', { name: /Submit request/i }).click();

    // Success
    await expect(dialog.getByText(/Request received/i)).toBeVisible();
  });

  test('blocks submit without a valid email', async ({ page }) => {
    await page.getByRole('button', { name: /Start a project/i }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('radio', { name: /Design & Web/i }).click();
    await dialog.getByRole('checkbox', { name: /Marketing website/i }).click();
    await dialog.getByRole('button', { name: /Continue/i }).click();
    await dialog.getByRole('radio', { name: /Within 2 weeks/i }).click();
    await dialog.getByRole('radio', { name: /\$1k – \$5k/i }).click();
    // Submit disabled until name + valid email present
    await expect(dialog.getByRole('button', { name: /Submit request/i })).toBeDisabled();
  });
});
