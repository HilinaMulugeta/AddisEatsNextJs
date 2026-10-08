# Addis Eats — Day 45 capstone

Addis Eats is a Next.js learning project for browsing Ethiopian dishes, signing in to place an
order, and tracking the signed-in customer's orders. Day 45 completes the authentication,
authorization, data-flow, performance-budget, metadata, and documentation exercises.

## Run locally

1. Run `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `SESSION_SECRET` to a unique random value with at least 32 characters. Set `SITE_URL` to
   the public HTTPS origin used for production metadata.
4. Run `npm run dev`, then open `http://localhost:3000`.

`npm run lint` and `npm run build` validate the project. Do not put secrets in `NEXT_PUBLIC_*`
variables or commit `.env.local`.

## Project walkthrough

- **Public menu:** server-rendered initial dishes, debounced search, category filtering,
  pagination, and SWR revalidation.
- **Accounts and private pages:** customers sign up with their name, email, and chosen password.
  Passwords are stored as salted scrypt hashes; sign-in creates a signed, expiring `httpOnly`
  session. Checkout, profile, orders, and order status validate it on the server.
- **Order ownership:** checkout/API writes derive the customer identity from the session.
  History, detail queries, status polling, and cancellation are owner-scoped.
- **Demo data:** menu/profile remain seeded, while order records persist in local SQLite across
  restarts. Multi-instance deployments need a shared managed database.
- **Checkout integrity:** the cart persists in the browser; checkout requires dishes, validates
  availability, and calculates prices/totals from the server catalog.
- **SEO:** route-specific metadata and canonicals, generated Open Graph images, dish
  structured data, sitemap, and robots rules remain in place.
- **Images and fonts:** local Geist font and responsive `next/image` variants retain the prior
  Day 43 optimization work.

## Day 45 references

- [AUTH.md](./AUTH.md) — session design, access matrix, safe redirects, and security checks.
- [DATA.md](./DATA.md) — menu/order data sources, revalidation, ownership, and demo limits.
- [PERF.md](./PERF.md) — production measurements and performance budget; records the LCP,
  JavaScript, and Lighthouse targets still missed in the simulated mobile audit.

This learning project has no email verification, password reset, payment processor, kitchen
workflow, or managed cloud database. Replace the local SQLite store with a shared managed database
and add account recovery and verification before production deployment.
