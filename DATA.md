# Day 45 data fetching and ownership

## Data sources and decisions

| Data | Source | Lifetime / behavior |
| --- | --- | --- |
| Menu and categories | Ten curated records in `src/app/menu/dishes.js` | Static in-process catalog, rendered on the server and exposed through the read-only dishes API |
| Customer profile | User registration stored in the shared SQLite database | Persists across restarts; email is unique and passwords are salted scrypt hashes |
| Orders | SQLite database in `.data/orders.sqlite`, accessed through `src/lib/orders.js` | Persists across restarts and local processes sharing the project directory; every read/update is user-scoped |
| Delivery/payment choices | Validated order form payload | Submitted for each order; the app does not claim to save payment credentials or delivery preferences |

The menu is public and does not require a session. `/api/dishes` validates category and bounds
the requested page size; `getDishPage()` filters the in-memory catalog by search text/category
and returns the requested page plus total counts. The menu page renders the first page on the
server and hydrates the search/pagination client with that result. Search changes are debounced
by 300 ms; SWR revalidates the API response.

Checkout and `POST /api/orders` share the Zod `orderSchema` and validate cart item IDs and
quantities separately. The server resolves current prices and availability from the menu; it
does not trust client prices or customer identity. Orders store their line items, verified
subtotal, delivery fee, and total. Empty carts and unavailable dishes are rejected. Cart items
persist in browser local storage and are cleared after a successful order.

Order history calls `listOrdersForUser(user.id)`; detail pages and APIs call
`getOrderForUser(id, user.id)`; cancellation checks the owner before updating status.
Order-status UI starts with the server-rendered record and polls its owner-scoped endpoint every
five seconds.

## Demo limitations

The SQLite database is suitable for this single-instance learning app. It is created on first
order access under `.data/` (ignored by Git) or at the optional `ADDIS_EATS_DB_PATH`. A serverless
or multi-instance deployment must use a shared managed database instead; local filesystems may
be ephemeral and are not shared between instances. Back up the database and protect its
customer contact/address data. The demo does not collect or store card numbers; checkout offers
Telebirr and cash.
