import { test, expect, type Page } from './fixtures';

/** Champ de recherche visible (sidebar desktop ou barre mobile, l'autre reste dans le DOM). */
function visibleSearchInput(page: Page) {
  return page.locator('input[placeholder*="Rechercher"]:visible');
}

test.describe('Centres — états d’interface', () => {
  test('affiche aucun résultat pour une recherche impossible', async ({ page }) => {
    await page.goto('/centres');
    await visibleSearchInput(page).fill('___aucun_centre___');
    await expect(page.getByRole('status').filter({ hasText: /aucun centre/i })).toBeVisible();
  });

  test('la recherche retrouve Cotonou', async ({ page }) => {
    await page.goto('/centres');
    await visibleSearchInput(page).fill('Cotonou');
    await expect(
      page.getByRole('heading', { name: /Centre National de Transfusion Sanguine/i }),
    ).toBeVisible();
  });
});

test.describe('Centres — clavier', () => {
  test('Tab atteint le champ de recherche', async ({ page }) => {
    await page.goto('/centres');
    const search = visibleSearchInput(page);
    await search.focus();
    await expect(search).toBeFocused();
  });
});
