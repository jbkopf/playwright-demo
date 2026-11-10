import { mergeTests } from '@playwright/test';
import { test as pagesTest } from './pages.fixture';
import { test as articleTest } from './created-article.fixture';

export const test = mergeTests(pagesTest, articleTest);

export { expect } from '@playwright/test';