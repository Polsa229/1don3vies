import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('1Don3Vies-intro-seen', '1');
    });
    await use(page);
  },
});

export { expect };
