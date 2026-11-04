import { test, expect } from '../fixtures';

test.describe('Home page (signed out)', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  
  test.beforeEach(async ({ homePage }) => {
    // requesting homePage navigates to '/'
  });

  test('has the Conduit title', async ({ page }) => {
    await expect(page).toHaveTitle('Conduit');
  });

  test('shows signed-out navigation links', async ({ navBar }) => {
    await expect(navBar.home).toBeVisible();
    await expect(navBar.signIn).toBeVisible();
    await expect(navBar.signUp).toBeVisible();
  });

  test('shows the Global Feed tab and Popular Tags', async ({ homePage }) => {
    await expect(homePage.globalFeed).toBeVisible();
    await expect(homePage.popularTags).toBeVisible();
  });

  test('shows the signed-out banner', async ({ homePage }) => {
    await expect(homePage.banner).toBeVisible();
    await expect(homePage.yourFeed).toBeHidden();
  });

  test('Sign in link navigates to the login page', async ({ navBar, page }) => {
    await navBar.signIn.click();

    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });
});

test.describe('Home page (signed in)', () => {
  test.beforeEach(async ({ homePage }) => {
    // requesting homePage navigates to '/'
  });

  test('shows signed-in navigation links', async ({ navBar }) => {
    await expect(navBar.home).toBeVisible();
    await expect(navBar.settings).toBeVisible();
    await expect(navBar.newArticle).toBeVisible();
  });

  test('shows your feed', async ({ homePage }) => {
    await expect(homePage.yourFeed).toBeVisible();
    await expect(homePage.banner).toBeHidden();
  });
});
