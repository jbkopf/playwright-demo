# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project purpose

A learning project: the owner is getting hands-on with Playwright. Their most recent work was backend testing, and before that they did UI automation with Protractor and Selenium. Favor idiomatic, current Playwright practices (web-first assertions, role-based locators, fixtures) and briefly explain where Playwright's approach differs from Selenium/Protractor.

**Do not write test code for the owner.** Specs, page objects, and fixtures are theirs to write. Explain the concept, point to the relevant API/docs or tools (`codegen`, aria snapshots, UI mode), give hints or tiny illustrative snippets, then review and run what they write. Explain failures instead of silently fixing them. Write full code only when explicitly asked for a specific piece.

## Project state

A freshly scaffolded Playwright Test project (output of `npm init playwright`). The only spec is the generated `tests/example.spec.ts`, which targets playwright.dev, not the app under test. There are no npm scripts and no page objects or fixtures yet.

The app under test runs at `http://localhost:4200` (set as `use.baseURL`), so specs should use relative paths like `page.goto('/')`. It must already be running before tests start; nothing in this repo starts it.

## Conventions

- Locator preference: user-facing locators first (`getByRole`, `getByLabel`, `getByText`, etc.), then `getByTestId` with Playwright's default `data-testid` attribute only when necessary, and CSS/XPath as a last resort.

## Commands

```bash
npm ci                                   # install deps
npx playwright install --with-deps       # install browsers (needed once / on CI)
npx playwright test                      # run all tests on chromium, firefox, webkit
npx playwright test tests/example.spec.ts           # single file
npx playwright test -g "has title"                  # single test by title
npx playwright test --project=chromium              # single browser
npx playwright test --ui                            # interactive UI mode
npx playwright test --debug                         # step through with inspector
npx playwright show-report                          # open last HTML report
npx playwright show-trace test-results/<...>/trace.zip
```

No lint or build step exists; TypeScript is compiled on the fly by Playwright.

## Configuration notes (`playwright.config.ts`)

- `testDir: ./tests`, `fullyParallel: true`, HTML reporter.
- Behavior changes when `CI` is set: `forbidOnly`, 2 retries, 1 worker. Traces are captured only `on-first-retry`, so locally (0 retries) no trace is recorded unless you pass `--trace on`.
- `.env` (git-ignored) is loaded via dotenv at the top of the config; `.env.example` lists the required keys (`ADMIN_USER_EMAIL`, `ADMIN_USER_PASSWORD`, `ADMIN_USERNAME` — the single privileged account). Copy it to `.env` before running tests. `webServer` is still commented out.
- `package.json` sets `"type": "commonjs"`.

## CI

`.github/workflows/playwright.yml` is manual-trigger only (`workflow_dispatch`) until CI has a running Conduit app and `ADMIN_*` secrets. Steps: `npm ci` → `npx playwright install --with-deps` → `npx playwright test`, then uploads `playwright-report/` as an artifact (30-day retention).
