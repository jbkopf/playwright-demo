import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { NavBar } from '../pages/components/nav-bar';
import { adminUser, type AdminUser } from '../data/users';
import { HomePage } from '../pages/home.page';

type MyFixtures = {
    loginPage: LoginPage;
    navBar: NavBar;
    adminUser: AdminUser;
    homePage: HomePage;
}

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await use(loginPage);
    },
    navBar: async ({ page }, use) => {
        const navBar = new NavBar(page);
        await use(navBar);
    },
    adminUser: async ({ }, use) => {
        await use(adminUser);
    },
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await use(homePage);
    }
});

export { expect } from '@playwright/test';