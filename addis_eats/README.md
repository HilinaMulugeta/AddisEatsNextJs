# Addis Eats — Day 49 frontend capstone

Addis Eats is a responsive Ethiopian food ordering app built with Next.js. Customers can browse and search dishes, create an account, submit an order, and follow its demo delivery status. The app also includes private customer and admin dashboards, CSV order export, and a delivery route preview.

## Run locally

Requirements: Node.js 20.9 or newer and npm. The optional legacy SQLite importer requires Node.js 22.13 or newer.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Create a development Neon Postgres database and set `DATABASE_URL` in `.env.local`. The first account/order request creates the required tables and indexes.
4. Set `SESSION_SECRET` to a unique random value of at least 32 characters. Set `SITE_URL` to `http://localhost:3000` for local development; use the actual HTTPS origin in a deployed environment.
5. Set `ADMIN_EMAILS` to the comma-separated email addresses that should access `/admin`. Admins must first create accounts with those email addresses; this setting does not create accounts or set passwords.
6. Start the app with `npm run dev` and open `http://localhost:3000`.

Accounts and orders are stored in managed Postgres. Cart items and favorites use browser `localStorage` on the current device only. The old `.data/orders.sqlite` file is no longer used; see [DEPLOYMENT.md](./DEPLOYMENT.md) to migrate local demo records safely.

## Main features

- **Menu and discovery:** server-rendered first page, debounced search, category filters, pagination, responsive imagery, route metadata, sitemap, robots rules, and structured data. Later searches and filters use the dishes API; stale requests are cancelled.
- **Accounts:** sign-up and sign-in with salted scrypt password hashes and signed, expiring, HTTP-only session cookies.
- **Ordering:** server-validated cart items, prices, availability, customer identity, and totals. Checkout uses an idempotency key to prevent duplicate orders after retries.
- **Favorites:** save dishes from the menu or homepage and revisit them on `/favorites`. They stay in this browser only and do not require an account.
- **Customer pages:** profile, owner-scoped order history and details, CSV export, and dashboard summaries with accessible chart data tables.
- **Admin:** a separate `/admin` operations dashboard protected by a server-side email allowlist.
- **Tracking:** server-sent status updates with polling fallback. Demo orders advance every five seconds; the Leaflet route and courier position are estimates, not live GPS.
- **Mobile and accessibility:** responsive layouts with a vertically stacked mobile navigation, keyboard-visible focus, Escape-to-close navigation, touch-sized controls, and session-aware links with sign-out for signed-in users.

## Project checks

- `npm test` runs security, ownership, redirect, idempotency, order status, formatting, and CSV tests. Postgres integration tests run when `TEST_DATABASE_URL` points to a disposable test database; otherwise they are skipped.
- `npm run lint` checks source style and common errors.
- `npm run build` creates a production build.

The latest local production Lighthouse run of `/menu` scored 89 on mobile and 100 on desktop; Accessibility and SEO scored 100 in both profiles. Mobile scores varied between runs, and mobile LCP remains above the 2.5-second target. See [PERF.md](./PERF.md) for measurements and limits.

See [CAPSTONE_PLAN.md](./CAPSTONE_PLAN.md) for the final review status and remaining release checks. [AUTH.md](./AUTH.md), [DATA.md](./DATA.md), and [PERF.md](./PERF.md) document security, data, and performance. [DEPLOYMENT.md](./DEPLOYMENT.md) explains the persistence requirement before hosting.

## Deployment status

This project is intended for Vercel and now uses managed Postgres rather than a server-local SQLite file. Configure `DATABASE_URL` in the Vercel Preview and Production environments and redeploy the GitHub-connected project. See [DEPLOYMENT.md](./DEPLOYMENT.md) for setup and validation steps.

## Known scope limits

There is no email verification, password recovery, payment processor, live kitchen integration, geocoding, or courier GPS feed. See [FUTURE.md](./FUTURE.md) for work intentionally deferred beyond this capstone.
