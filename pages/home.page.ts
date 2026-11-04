import { type Page, type Locator } from '@playwright/test';

export class HomePage {
    readonly globalFeed: Locator;
    readonly popularTags: Locator;
    readonly banner: Locator;
    readonly yourFeed: Locator


    constructor(private readonly page: Page) { 
        this.globalFeed = page.getByRole('link', { name: 'Global Feed' });
        this.popularTags = page.getByText('Popular Tags');
        this.banner = page.getByRole('heading', { name: 'Conduit', exact: true });
        this.yourFeed = page.getByRole('link', { name: 'Your Feed' });
    };

    async goto() {
        await this.page.goto('/');
    };
};
