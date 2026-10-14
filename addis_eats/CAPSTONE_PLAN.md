# Day 49 capstone review

## Must — core flow, security, and handoff

- [x] Browse, search, filter, and paginate the dish menu.
- [x] Register/sign in, place an order, view owner-scoped orders, and follow demo status.
- [x] Separate customer and allowlisted admin dashboards.
- [x] Validate prices and identity on the server; protect order ownership and admin reads.
- [x] Prevent duplicate order writes on a retried checkout.
- [x] Save and revisit favorites using browser storage without requiring an account.
- [x] Show sign-in/sign-up links only to signed-out visitors and a sign-out action to signed-in users; keep admin navigation role-restricted.
- [x] Automated checks cover redirects, registration/password hashing, ownership, signed-out cancellation, idempotency, status progression, admin allowlisting, formatting, and CSV escaping.
- [x] Document setup, authentication, data handling, deployment limits, and current local performance measurements.
- [ ] Repeat customer/admin flows in a browser after the final build, including a new account and empty states.
- [x] Run Lighthouse on a local production build of `/menu` and record the result in [PERF.md](./PERF.md).
- [ ] Complete a keyboard-only and real-phone review, and run Lighthouse against the actual deployed preview URL.
- [ ] Run a secret scan before committing these Day 49 updates; keep `.env.local` and `.data/` out of Git.
- [x] Replace the local SQLite runtime with a managed Postgres adapter; document local data migration.
- [ ] Configure separate Neon database URLs for Vercel Preview and Production, redeploy, and verify persistence.

## Should — quality and release readiness

- [x] Provide loading, error, empty, and recovery states on key routes.
- [x] Keep map attribution visible and label courier location as an estimate.
- [x] Provide CSV export for the signed-in user's order history.
- [x] Record current local Lighthouse results and check target budgets in [PERF.md](./PERF.md).
- [ ] Recheck metadata, sitemap, and robots output for the chosen production origin.
- [ ] Confirm clean-clone installation and production build in the release environment.

## Could — deferred

Optional improvements are listed in [FUTURE.md](./FUTURE.md).

## Local verification

Run `npm test`, `npm run lint`, and `npm run build`. Automated tests do not replace the remaining browser, phone, deployed-preview, deployment, or secret-review checks. Apply these updates to the GitHub repository connected to Vercel, configure its database environment, then redeploy and verify persistence.

Latest local verification before the Postgres migration: all 10 existing tests passed and the production build passed. Rerun checks after the database migration. Postgres integration tests require `TEST_DATABASE_URL`. Vercel environment configuration and deployed persistence checks remain release steps.
