import { test as base } from '@playwright/test';
import { adminUser, type AdminUser } from '../data/users';
import { type Article, createArticle } from '../data/articles';

type DataFixtures = {
    adminUser: AdminUser;
    article: Article;
}

export const test = base.extend<DataFixtures>({
    adminUser: async ({ }, use) => {
        await use(adminUser);
    },
    article: async ({ }, use) => {
        const article = createArticle();
        await use(article);
    },
});