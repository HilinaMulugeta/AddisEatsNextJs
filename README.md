# Addis Eats demo

Addis Eats is a Next.js assignment project for browsing Ethiopian dishes, creating a browser-stored
account, and tracking orders.

## Run locally

1. Run `npm install`.
2. Optionally copy `.env.example` to `.env.local` and set `SITE_URL` to the public HTTPS origin
   used for production metadata.
3. Run `npm run dev`, then open `http://localhost:3000`.

`npm run lint`, `npm test`, and `npm run build` validate the project.

## Project walkthrough

- **Public menu:** server-rendered initial dishes, debounced search, category filtering,
  pagination, and SWR revalidation.
- **Accounts:** sign-up stores account details and salted password hashes in browser
  `localStorage`; sign-in sessions live in `sessionStorage`.
- **Order data:** cart and order history use browser `localStorage`; checkout drafts use
  `sessionStorage`. Data stays on the current device and can be cleared by the visitor.
- **Order tracking:** status advances locally every five seconds while an order page is open.
  Orders are not submitted to a restaurant.
- **SEO:** route-specific metadata and canonicals, generated Open Graph images, dish
  structured data, sitemap, and robots rules remain in place.
- **Images and fonts:** local Geist font and responsive `next/image` variants retain the prior
  Day 43 optimization work.

## Day 45 references

- [AUTH.md](./AUTH.md) — browser-based account flow and security limitations.
- [DATA.md](./DATA.md) — menu/order data sources, persistence, and demo limits.
- [PERF.md](./PERF.md) — production measurements and performance budget; records the LCP,
  JavaScript, and Lighthouse targets still missed in the simulated mobile audit.

This frontend project has no server authentication, backend order processing, payment processor, or
live delivery integration. Add a backend and managed database before accepting real orders.
