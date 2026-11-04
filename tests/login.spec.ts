import { test, expect } from '../fixtures';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
    test('can login with valid credentials', async ({ loginPage, navBar, page, adminUser }) => {
        await loginPage.login(adminUser.email, adminUser.password);
        await expect(page).toHaveURL('/');
        await expect(navBar.userLink(adminUser.username)).toBeVisible();
        await expect(navBar.signIn).not.toBeVisible();
    });

    test('shows error with invalid credentials', async ({ loginPage }) => {
        await loginPage.login('invalid@test.dev', 'wrongpassword');
        await expect(loginPage.errors).toBeVisible();
    });
});
