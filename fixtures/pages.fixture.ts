import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { NavBar } from '../pages/components/nav-bar';
import { HomePage } from '../pages/home.page';

type PageFixtures = {
    loginPage: LoginPage;
    navBar: NavBar;
    homePage: HomePage;
}

export const test = base.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await use(loginPage);
    },
    navBar: async ({ page }, use) => {
        const navBar = new NavBar(page);
        await use(navBar);
    },
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await use(homePage);
    },
});