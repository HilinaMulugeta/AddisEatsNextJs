# Data handling and ownership

## Data sources and decisions

| Data | Source | Lifetime / behavior |
| --- | --- | --- |
| Menu and categories | Ten curated records in `src/app/menu/dishes.js` | Static in-process catalog, rendered on the server and exposed through the read-only dishes API |
| Customer profile | Managed Postgres via `@neondatabase/serverless` | Shared across deployments; email is unique and passwords are salted scrypt hashes |
| Orders | Managed Postgres via `src/lib/orders.js` | Durable and shared across serverless instances; reads and updates are scoped to the authenticated user |
| Favorites | Browser local storage, stored as dish IDs | Persists in the current browser; does not require sign-in or sync across devices |
| Delivery/payment choices | Validated order form payload | Submitted for each order; the app does not claim to save payment credentials or delivery preferences |

The menu is public and does not require a session. `/api/dishes` validates category and bounds
the requested page size; `getDishPage()` filters the in-memory catalog by search text/category
and returns the requested page plus total counts. The menu page renders the first page on the
server and hydrates the search/pagination client with that result. Search changes are debounced
by 300 ms. Filter and page changes fetch the dishes API, and an obsolete request is cancelled when
the selection changes.

Checkout and `POST /api/orders` share the Zod `orderSchema` and validate cart item IDs and
quantities separately. The server resolves current prices and availability from the menu; it
does not trust client prices or customer identity. Orders store their line items, verified
subtotal, delivery fee, and total. Empty carts and unavailable dishes are rejected. Cart items
persist in browser local storage and are cleared after a successful order. Favorite IDs remain in
browser local storage until removed or site data is cleared.

Order history calls `listOrdersForUser(user.id)`; detail pages and APIs call
`getOrderForUser(id, user.id)`; cancellation checks the owner before updating status. The tracking
page starts with the server-rendered record, then reads status updates from an authenticated SSE
route. The stream rechecks ownership in its database reads and closes on delivery, cancellation,
or client disconnect. If the stream fails, the page falls back to five-second owner-scoped polling.

The tracking map uses approximate neighborhood centers and a demo courier marker; the project has
no address geocoder or live courier coordinates. The entered delivery address is repeated in text
beside the map. Map tiles come from OpenStreetMap and retain required attribution; the public tile
server is suitable for coursework, not unbounded production traffic. The order history CSV is
generated for the authenticated customer and escapes commas, quotes, and embedded line breaks.

Amounts are stored as whole ETB birr integers. `src/lib/format.js` creates reusable `Intl`
formatters for ETB, Addis Ababa date/time, date-only labels, and relative times; display code uses
these instead of creating formatters per row or relying on the machine's time zone.

## Server database versus browser storage

`DATABASE_URL` connects server code to managed Postgres (Neon). Accounts, password hashes, and orders are sent only from server code; this database is shared between customers, functions, and deployments that use the same connection string. Browser `localStorage` only keeps the current device's cart and favorites. It is not used for accounts, checkout totals, or orders because customers can edit it and it cannot act as a trusted shared database.

The previous `.data/orders.sqlite` file is local-only and is no longer used by the application. To copy its accounts and orders into a new Postgres database, set `DATABASE_URL` to a development database and run `node --env-file=.env.local migrate-sqlite-to-postgres.mjs`. The script is repeatable and reports only row counts. Keep a backup of the SQLite file and verify migrated data before switching production traffic. Orphan orders without a matching account are skipped.

The schema is created on first database access. Configure separate Neon branches/databases for local development, Preview, and Production. Keep database credentials out of client code and `NEXT_PUBLIC_*`. Back up customer contact/address data. The demo does not collect or store card numbers; checkout offers Telebirr and cash.
# Admin access and demo order status

The customer dashboard at `/dashboard` is scoped to the signed-in customer's orders. The separate
`/admin` dashboard requires a signed-in email listed in the server-only `ADMIN_EMAILS` setting in
`.env.local`; an unlisted customer cannot load admin order data. Keep this allowlist and all
credentials out of committed files.

For the Day 49 walkthrough, an order's displayed status advances from placed to prepared after
five seconds, to on the way after ten seconds, and to delivered after fifteen seconds. This is a
time-based simulation for the demo; it does not update a real kitchen workflow or courier location.
Set `ADDIS_EATS_DEMO_AUTO_ADVANCE=false` to disable the simulated progression.

