import { test as setup, expect } from '../fixtures';


setup('authenticate as admin', async ({ loginPage, navBar, page, adminUser }) => {
    await loginPage.login(adminUser.email, adminUser.password);
    await expect(page).toHaveURL('/');
    await expect(navBar.userLink(adminUser.username)).toBeVisible();
    await expect(navBar.signIn).not.toBeVisible();
    await page.context().storageState({ path: 'playwright/.auth/admin.json' });
});
