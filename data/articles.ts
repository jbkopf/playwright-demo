import { faker } from '@faker-js/faker';

export const createArticle = () => { 
    const article = {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(2),
        tagList: [faker.lorem.word(), faker.lorem.word()]
    };

    return article;
};

export type Article = ReturnType<typeof createArticle>;