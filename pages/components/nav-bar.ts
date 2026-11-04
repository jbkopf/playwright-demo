import { type Page, type Locator } from '@playwright/test';

export class NavBar {
    readonly home: Locator;
    readonly newArticle: Locator;
    readonly settings: Locator;
    readonly root: Locator;
    readonly signIn: Locator;
    readonly signUp: Locator;

    constructor(page: Page) {
        this.root = page.getByRole('navigation').filter({ has: page.getByRole('link', { name: 'Conduit' }) });
        this.home = this.root.getByRole('link', { name: 'Home' });
        this.newArticle = this.root.getByRole('link', { name: 'New Article' });
        this.settings = this.root.getByRole('link', { name: 'Settings' });
        this.signIn = this.root.getByRole('link', { name: 'Sign in' });
        this.signUp = this.root.getByRole('link', { name: 'Sign up' });
    }

    userLink(username: string) {
        return this.root.getByRole('link', { name: username, exact: true });
    }
}