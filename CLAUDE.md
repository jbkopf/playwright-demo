# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project purpose

A learning project: the owner is getting hands-on with Playwright. Their most recent work was backend testing, and before that they did UI automation with Protractor and Selenium. Favor idiomatic, current Playwright practices (web-first assertions, role-based locators, fixtures) and briefly explain where Playwright's approach differs from Selenium/Protractor.

**Do not write test code for the owner.** Specs, page objects, and fixtures are theirs to write. Explain the concept, point to the relevant API/docs or tools (`codegen`, aria snapshots, UI mode), give hints or tiny illustrative snippets, then review and run what they write. Explain failures instead of silently fixing them. Write full code only when explicitly asked for a specific piece.

## Architecture

The app under test is Conduit (RealWorld) at `http://localhost:4200` (`use.baseURL`), so specs use relative paths like `page.goto('/')`. It must already be running before tests start; nothing in this repo starts it. Its REST API is served from the same origin under `/api` (token auth: `Authorization: Token <jwt>`).

- **Specs import `test`/`expect` from `../fixtures`, not `@playwright/test`.** Fixtures are split by concern and layered by dependency:
  - `data.fixture.ts` extends `base` and provides `adminUser` and `article`. `article` is a fresh faker object per test.
  - `api.fixture.ts` extends the data `test` and provides `conduitApi`, a logged-in `ConduitApi` (test scope), disposed after `use()`.
  - `pages.fixture.ts` extends `base` and provides `loginPage`, `homePage` and `navBar`. `loginPage` and `homePage` navigate on creation, so just requesting one loads that page.
  - `index.ts` only does `mergeTests(pagesTest, apiTest)` and re-exports `expect`; the data fixtures arrive through the API branch.

  A new fixture file extends whichever `test` has the fixtures it depends on (fixture types only see what their parent `test` declares), then gets added to the merge in `index.ts`.
- **Page objects** (`pages/*.page.ts`, shared components in `pages/components/`) expose `readonly Locator` fields built in the constructor, plus `goto()`/action methods. They contain no assertions; assertions stay in specs.
- **Auth via storage state.** The `setup` project (`tests/*.setup.ts`) logs in through the UI as the admin user and saves `playwright/.auth/admin.json` (git-ignored). The chromium/firefox/webkit projects depend on `setup` and use that file, so **every test starts signed in by default**. Signed-out tests opt out with `test.use({ storageState: { cookies: [], origins: [] } })`.
- **Test data** (`data/`): `users.ts` reads the admin account from env and throws at import if a key is missing; `articles.ts` generates article content with `@faker-js/faker`.
- **API layer** (`api/conduit-api.ts`): `ConduitApi.Login()` gets a token and returns a client wrapping an authenticated `APIRequestContext`, for creating and cleaning up data without the UI. Action methods (`createArticle`, `deleteArticle`) assert `toBeOK()`. `getArticle` returns the raw response so tests can assert failure statuses. Specs use it through the `conduitApi` fixture, as in `tests/api-scratch.spec.ts`.

Runtime: Node 26 (via nvm; `@types/node` ^26). No npm scripts.

## Conventions

- Locator preference: user-facing locators first (`getByRole`, `getByLabel`, `getByText`, etc.), then `getByTestId` with Playwright's default `data-testid` attribute only when necessary, and CSS/XPath as a last resort.

## Commands

```bash
npm ci                                   # install deps
npx playwright install --with-deps       # install browsers (needed once / on CI)
npx playwright test                      # setup project, then all tests on chromium, firefox, webkit
npx playwright test tests/login.spec.ts             # single file (setup project still runs first)
npx playwright test -g "has the Conduit title"      # single test by title
npx playwright test --project=chromium              # single browser
npx playwright test --ui                            # interactive UI mode
npx playwright test --debug                         # step through with inspector
npx playwright show-report                          # open last HTML report
npx playwright show-trace test-results/<...>/trace.zip
```

No lint or build step exists; TypeScript is compiled on the fly by Playwright, which strips types without checking them. Type errors only show in the editor: `tsconfig.json` (strict, `nodenext`, `noEmit`) exists for VS Code's TS server, and `typescript` isn't a dependency, so there's no `tsc` command.

## Configuration notes (`playwright.config.ts`)

- `testDir: ./tests`, `fullyParallel: true`, HTML reporter.
- Behavior changes when `CI` is set: `forbidOnly`, 2 retries, 1 worker. Traces are captured only `on-first-retry`, so locally (0 retries) no trace is recorded unless you pass `--trace on`.
- `.env` (git-ignored) is loaded via dotenv at the top of the config; `.env.example` lists the required keys (`ADMIN_USER_EMAIL`, `ADMIN_USER_PASSWORD`, `ADMIN_USERNAME` — the single privileged account). Copy it to `.env` before running tests. `webServer` is still commented out.
- `package.json` sets `"type": "commonjs"`.

## CI

`.github/workflows/playwright.yml` is manual-trigger only (`workflow_dispatch`) until CI has a running Conduit app and `ADMIN_*` secrets. Steps: `npm ci` → `npx playwright install --with-deps` → `npx playwright test`, then uploads `playwright-report/` as an artifact (30-day retention).
