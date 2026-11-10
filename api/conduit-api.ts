import { request, expect, APIRequestContext } from '@playwright/test';
import { Article } from '../data/articles';

export class ConduitApi {
    constructor(readonly request: APIRequestContext) { }

    static async Login(email: string, password: string, baseURL?: string ) {
        const ctx = await request.newContext({ baseURL });
        const apiToken = await ctx.post('/api/users/login', { data: { user: { email, password } } });
        await expect(apiToken).toBeOK();
        
        const data = await apiToken.json();
        await ctx.dispose();
        const authed = await request.newContext({
            baseURL,
            extraHTTPHeaders: {
                'Authorization': `Token ${data.user.token}`
            }
        });
        return new ConduitApi(authed);
    };

    async createArticle(article: Article) : Promise<string> {
        const response = await this.request.post('/api/articles', {
            data: {
                article
            },
        });
        await expect(response).toBeOK();
        const data = await response.json();
        return data.article.slug;
    };

    async deleteArticle(slug: string) {
        const response = await this.request.delete(`/api/articles/${slug}`);
        await expect(response).toBeOK();
        return response;
    };

    async getArticle(slug: string) {
        const response = await this.request.get(`/api/articles/${slug}`);
        return response;
    }
}