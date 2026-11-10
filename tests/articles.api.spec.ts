import { test, expect } from '../fixtures';

test.describe('API_crud', () => {    
    test('can create and delete an article via API', async ({ article, conduitApi }) => {

        const slug = await conduitApi.createArticle(article);
        expect(slug).toBeTruthy();

        await conduitApi.deleteArticle(slug);
        const response = await conduitApi.getArticle(slug);
        expect(response.status()).toBe(404);
    });
});