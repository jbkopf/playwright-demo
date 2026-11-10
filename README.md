# Conduit Playwright Tests

End-to-end tests in TypeScript with [Playwright Test](https://playwright.dev) for [Conduit](https://github.com/gothinkster/realworld), the RealWorld demo blogging app (a Medium clone). The suite runs on Chromium, Firefox and WebKit. It mixes UI tests with API calls: the API creates and cleans up test data, and the UI tests check what a user sees.

```text
$ npx playwright test
  34 passed (12.4s)        # 1 auth setup + 11 tests × 3 browsers
```

## What it demonstrates

| Area | Where to look |
|---|---|
| **User-facing locators**: `getByRole`, `getByText` and accessible names, with CSS only where the app offers nothing else (it has no test ids) | [`pages/`](pages/) |
| **Page Object Model**: locators as `readonly` fields, data-dependent locators built by methods, no assertions inside page objects | [`pages/article.page.ts`](pages/article.page.ts), [`pages/components/nav-bar.ts`](pages/components/nav-bar.ts) |
| **Custom fixtures, split by concern** and combined with `mergeTests` | [`fixtures/`](fixtures/) |
| **Log in once per run**: a `setup` project logs in through the UI and saves the session (`storageState`), every browser project reuses it, and signed-out tests opt out | [`tests/auth.setup.ts`](tests/auth.setup.ts), [`playwright.config.ts`](playwright.config.ts) |
| **API client** on Playwright's `APIRequestContext` with token auth | [`api/conduit-api.ts`](api/conduit-api.ts) |
| **Hybrid tests**: the article is created through the API before the test, checked in the UI, and deleted in fixture teardown even when the test fails | [`fixtures/created-article.fixture.ts`](fixtures/created-article.fixture.ts), [`tests/created-article.spec.ts`](tests/created-article.spec.ts) |
| **Generated test data**: a new Faker article for every test | [`data/articles.ts`](data/articles.ts) |
| **Configuration through environment variables**: credentials come from `.env` (git-ignored) and a missing key fails immediately with a clear error | [`data/users.ts`](data/users.ts), [`.env.example`](.env.example) |
| **Web-first assertions** (`toBeVisible`, `toHaveText`, `toHaveURL`), with no manual waits or sleeps | all specs |
| **Strict TypeScript**, with typed fixtures and intersection types for data returned by fixtures | [`tsconfig.json`](tsconfig.json) |

## How the fixtures fit together

Each fixture file extends the `test` that provides the fixtures it depends on. `fixtures/index.ts` merges the branches, and specs import everything from that one place.

```text
@playwright/test
├── data.fixture.ts             adminUser, article (fresh Faker data each test)
│   └── api.fixture.ts          conduitApi (logged-in client, disposed after each test)
│       └── created-article     createdArticle (created via API, deleted after the test)
└── pages.fixture.ts            loginPage, homePage, navBar, articlePage

index.ts = mergeTests(pagesTest, articleTest)
```

The result is a spec that contains only the behaviour under test:

```ts
test('created article is visible', async ({ createdArticle, articlePage, adminUser }) => {
  await articlePage.goto(createdArticle.slug);
  await expect(articlePage.articleTitle).toHaveText(createdArticle.title);
  await expect(articlePage.getBody(createdArticle.body)).toBeVisible();
  await expect(articlePage.getAuthor(adminUser.username)).toBeVisible();
  await expect(articlePage.deleteButton).toBeVisible();
});
```

## Test coverage

| Spec | Covers |
|---|---|
| `auth.setup.ts` | Logs in through the UI and saves the session for the other projects |
| `login.spec.ts` | Login with valid credentials; error message for invalid credentials |
| `home.spec.ts` | Home page signed out (banner, navigation, Global Feed, tags, Sign in link) and signed in (Your Feed, navigation for logged-in users) |
| `created-article.spec.ts` | An article created through the API shows its title, body and author in the UI, with owner-only controls |
| `articles.api.spec.ts` | API only: create and delete an article, then check that it returns 404 |

## Running it

**Prerequisites:** Node.js 20 or newer (developed on Node 26), and a Conduit app running at `http://localhost:4200` that serves its REST API on the same origin under `/api`. This was developed against an Angular Conduit frontend with a Python backend. The tests don't start the app.

```bash
npm ci
npx playwright install --with-deps
cp .env.example .env        # then fill in an existing Conduit account
```

```bash
npx playwright test                              # all browsers
npx playwright test --project=chromium           # one browser
npx playwright test tests/login.spec.ts          # one file
npx playwright test --ui                         # interactive UI mode
npx playwright show-report                       # HTML report of the last run
```

## CI

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs the full suite on every push and pull request to `main`, against a complete Conduit stack built on the GitHub runner:

1. Checks out the [Django backend](https://github.com/c4ffein/realworld-django-ninja) and the [Angular frontend](https://github.com/realworld-apps/angular-realworld-example-app), each pinned to a commit so upstream changes can't break the build unannounced.
2. Starts the backend and Postgres with Docker Compose.
3. Points the frontend at that backend instead of the public demo API (small overrides in [`ci/frontend/`](ci/frontend/)) and serves it on `:4200`, proxying `/api` to the backend.
4. Registers the test account through the API. The database is new for each run, so no secrets are needed.
5. Runs the tests on all three browsers inside the official Playwright Docker image (matched to the installed Playwright version), which already has the browsers and their system libraries. It then prints the app logs if anything fails, and uploads the HTML report as an artifact.

## Roadmap

- [x] Page objects, custom fixtures, saved login session (`storageState`)
- [x] API client and API-driven test data with automatic cleanup
- [x] CI against the full Conduit stack (backend in Docker, frontend built on the runner) on every push and pull request
- [ ] Mock API responses with `page.route` to test how the UI handles errors
- [ ] Assert on the network calls the UI makes (`page.waitForResponse`)
