import { test as apiTest } from './api.fixture';
import { type Article } from '../data/articles';

type ArticleFixtures = {
    createdArticle: Article & { slug: string };
}

export const test = apiTest.extend<ArticleFixtures>({
    createdArticle: async ({ conduitApi, article }, use) => {
        const slug = await conduitApi.createArticle(article);
        await use({slug, ...article});
        await conduitApi.deleteArticle(slug);
    },
   
});