# LifeStyle Stores

LifeStyle Stores is an Angular shopping-cart demo app. It shows products from
the Fake Store API, lets users filter and sort the catalog, switch product grid
layouts, add items to a cart, update quantities, and start a Stripe Checkout
flow.

The app is built with Angular standalone components, Angular signals, RxJS,
Angular Material, Tailwind CSS, Karma/Jasmine unit testing, and Playwright E2E
testing.

## Project At A Glance

- Catalog page with category filters, sort controls, item-limit controls, and
  1/3/4-column layouts.
- Cart state managed by `CartService` with derived streams for item count,
  totals, and empty state.
- Header cart menu with item summary, total, clear-cart action, and cart-page
  navigation.
- Cart page with quantity controls, remove item, clear all, subtotal, and
  checkout entry point.
- Payment success and cancel routes.
- Playwright coverage workflow that instruments a development build and
  generates Istanbul HTML/LCOV reports.

## Tech Stack

- Angular `21`
- TypeScript `5.9`
- RxJS `7.8`
- Angular Material `21`
- Tailwind CSS `3`
- ESLint with `angular-eslint` and `typescript-eslint`
- Karma/Jasmine for Angular unit tests
- Playwright for E2E tests
- NYC/Istanbul for Playwright coverage reports

## Getting Started

Install dependencies from the project directory:

```bash
npm install
```

Start the Angular dev server:

```bash
npm start
```

Open the app at:

```text
http://localhost:4200
```

The root route redirects to `/home`.

## Available Scripts

Run scripts from `lifestyle-stores/`.

| Command | Purpose |
| --- | --- |
| `npm start` | Starts the local Angular dev server with `ng serve`. |
| `npm run build` | Creates a production build in `dist/lifestyle-stores`. |
| `npm run build:coverage` | Creates a development-style build with source maps and stable file names for E2E coverage instrumentation. |
| `npm test` | Runs Angular unit tests through Karma/Jasmine. |
| `npm run watch` | Builds continuously with the Angular development configuration. |
| `npm run e2e` | Runs Playwright E2E tests through the Angular Playwright schematic. |
| `npm run coverage:instrument` | Prepares and instruments the latest coverage build. Usually called by `npm run e2e:coverage`. |
| `npm run e2e:coverage` | Builds, instruments, runs Playwright against the instrumented app, and writes Istanbul coverage reports. |
| `npm run lint` | Runs Angular ESLint checks. |
| `npm run ng -- <args>` | Passes commands directly to Angular CLI. |

## Common Workflows

### Development

```bash
npm start
```

Use this for day-to-day app work. Angular serves the app at port `4200` and
reloads when source files change.

### Production Build

```bash
npm run build
```

The production build uses the default Angular production configuration from
`angular.json`.

### Unit Tests

```bash
npm test
```

This project uses Karma/Jasmine through Angular CLI. The README previously
mentioned Vitest, but Vitest is not configured in this app.

### E2E Tests

```bash
npm run e2e
```

Playwright specs live under `e2e/`. API calls to `https://fakestoreapi.com` are
mocked in the tests so the core E2E suite is deterministic.

### E2E Coverage

```bash
npm run e2e:coverage
```

This command performs the full coverage flow:

1. Builds the app with the `coverage` Angular configuration.
2. Copies the build to `dist/lifestyle-stores-instrumented`.
3. Instruments the copied JavaScript with NYC/Istanbul.
4. Serves the instrumented build with `tools/serve-static.mjs`.
5. Runs Playwright using `playwright.coverage.config.ts`.
6. Collects `window.__coverage__` after each test.
7. Generates coverage reports in `coverage/e2e`.

Coverage outputs:

- HTML report: `coverage/e2e/index.html`
- LCOV report: `coverage/e2e/lcov.info`
- Raw coverage JSON: `.nyc_output/`

The raw `.nyc_output/` directory is ignored by Git. The `coverage/` directory is
also ignored because it contains generated reports.

## App Structure

```text
src/
  main.ts                         Angular bootstrap, routes, app providers
  app/
    app.component.ts              Root layout with header and router outlet
    components/
      layout/header.component.ts  Top navigation and cart menu
      pages/                      Routed pages
      products/                   Product filters, header controls, cards
    models/                       Product and cart interfaces
    services/                     Cart and store data services
e2e/
  components/                     Playwright component-flow specs
  services/                       Playwright service-behavior specs
  coverage.ts                     Shared Playwright fixture for coverage
tools/
  prepare-coverage-build.mjs      Copies build output and clears old coverage
  serve-static.mjs                Small SPA-aware static server for coverage
```

## Routes

Routes are defined in `src/main.ts`.

| Route | Component | Purpose |
| --- | --- | --- |
| `/home` | `HomeComponent` | Product catalog, filters, sort, layout controls. |
| `/cart` | `CartComponent` | Cart details, quantity updates, subtotal, checkout. |
| `/payment-success` | `PaymentSuccessComponent` | Success screen; clears the cart. |
| `/payment-cancel` | `PaymentCancelComponent` | Cancel screen; links back to cart. |
| `/` | Redirect | Redirects to `/home`. |
| `**` | Redirect | Redirects unknown routes to `/home`. |

## Services

### `StoreService`

`StoreService` loads product and category data from:

```text
https://fakestoreapi.com
```

It keeps sort, limit, and category selections in `BehaviorSubject`s and exposes
cached product/category streams with `shareReplay`.

### `CartService`

`CartService` owns in-memory cart state and exposes:

- `cartItems$`
- `cartTotal$`
- `cartItemCount$`
- `isEmpty$`

It supports adding items, reducing quantity, removing items, clearing the cart,
and showing Angular Material snack-bar messages.

## Path Aliases

The project defines this TypeScript path alias in `tsconfig.json`:

```json
{
  "@app/*": ["./src/app/*"]
}
```

Prefer `@app/...` imports for app-level models and services.

## Styling

Tailwind scans `src/**/*.{html,ts}`. Most component templates are inline in
standalone component files, so Tailwind classes are written directly in the
component templates.

Angular Material is used for icons, menus, and snack bars.

## Notes And Caveats

- The checkout flow currently calls Stripe Checkout directly from
  `CartComponent` with a test secret key. That is useful for a demo, but a real
  application should create Checkout sessions on a backend and never ship secret
  keys to the browser.
- Cart state is stored in memory only. Refreshing the page resets the cart.
- The Playwright coverage flow is intentionally Chromium-only because it relies
  on browser-executed Istanbul coverage collection.
- Generated artifacts under `dist/`, `coverage/`, `.nyc_output/`,
  `playwright-report/`, and `test-results/` should not be committed.

## Useful Files

- `angular.json` - Angular build, serve, lint, E2E, and coverage build config.
- `playwright.config.ts` - Default Playwright config.
- `playwright.coverage.config.ts` - Playwright config for instrumented coverage
  runs.
- `tailwind.config.js` - Tailwind content configuration.
- `eslint.config.js` - ESLint configuration.
- `package.json` - npm scripts and dependencies.
