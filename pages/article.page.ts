import { type Page, type Locator } from '@playwright/test';

export class ArticlePage {
    readonly articleTitle: Locator;
    readonly deleteButton: Locator;
    private readonly banner: Locator;
    private readonly content: Locator;

    constructor(private readonly page: Page) { 
        this.banner = page.locator('.banner');
        this.content = page.locator('.article-content');
        this.articleTitle = this.banner.getByRole('heading', { level: 1 });
        this.deleteButton = this.banner.getByRole('button', { name: 'Delete Article' });
    };

    getAuthor(username: string) {
        return this.banner.getByRole('link', { name: username, exact: true });
    }

    getBody(body: string) {
        return this.content.getByText(body);
    }

    async goto(slug: string) {
        await this.page.goto(`/article/${slug}`);
    };
};