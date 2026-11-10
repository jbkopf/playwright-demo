import { test, expect } from '../fixtures';

test.describe('created article', () => {
    test('created article is visible', async ({ createdArticle, articlePage, adminUser }) => {
        await articlePage.goto(createdArticle.slug);
        await expect(articlePage.articleTitle).toHaveText(createdArticle.title);
        await expect(articlePage.getBody(createdArticle.body)).toBeVisible();
        await expect(articlePage.getAuthor(adminUser.username)).toBeVisible();
        await expect(articlePage.deleteButton).toBeVisible();
    });
});
