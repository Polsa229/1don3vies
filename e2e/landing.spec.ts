import { test, expect } from './fixtures';

test.describe('Landing — clavier et focus', () => {
  test('Tab place le focus sur un élément interactif', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const tagName = await page.evaluate(
      () => document.activeElement?.tagName ?? '',
    );
    expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(tagName);
  });

  test('le simulateur affiche une alerte si soumis vide', async ({ page }) => {
    await page.goto('/#eligibility');
    await page.getByRole('button', { name: /voir mon résultat/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('le simulateur affiche un résultat pour un profil valide', async ({ page }) => {
    await page.goto('/#eligibility');
    await page.getByLabel(/quel âge/i).fill('30');
    await page.getByRole('button', { name: /^homme$/i }).click();
    await page.getByLabel(/poids/i).fill('70');
    await page.getByRole('button', { name: /^non$/i }).click();
    await page.getByRole('button', { name: /voir mon résultat/i }).click();
    await expect(page.getByRole('status')).toContainText(/vous pouvez donner/i);
  });
});

test.describe('Landing — responsive', () => {
  test('affiche le hero sans débordement horizontal', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1;
    });
    expect(hasOverflow).toBe(false);
  });
});
