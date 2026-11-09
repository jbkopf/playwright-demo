import { test, expect } from '../fixtures';
import { ConduitApi } from '../api/conduit-api';

test.describe('API_crud', () => {
    let conduitApi: ConduitApi;
    test.beforeAll(async ({ baseURL, adminUser }) => {
        conduitApi = await ConduitApi.Login(adminUser.email, adminUser.password, baseURL);
    });
    
    test('can create and delete an article via API', async ({ article }) => {

        const slug = await conduitApi.createArticle(article);
        expect(slug).toBeTruthy();

        await conduitApi.deleteArticle(slug);
        const response = await conduitApi.getArticle(slug);
        expect(response.status()).toBe(404);
    });

    test.afterAll(async ({ }) => {
        await conduitApi?.request.dispose();
    });
});