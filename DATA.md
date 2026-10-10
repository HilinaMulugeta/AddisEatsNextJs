# Data and persistence

| Data | Source | Lifetime and behavior |
| --- | --- | --- |
| Menu and categories | Curated records in `src/app/menu/dishes.js` | Static catalog rendered by Next.js |
| Accounts | Browser `localStorage` | Stored per browser; contains salted password hashes, not plain passwords |
| Signed-in session | Browser `sessionStorage` | Account ID for the current browser tab/session |
| Cart and orders | Browser `localStorage` | Per-browser data; order history is filtered by account ID |
| Checkout draft | Browser `sessionStorage` | Scoped to the signed-in account and tab session |

Sign-up and sign-in run in the browser. The checkout form calculates totals from the bundled menu
catalog and saves orders locally; the server does not receive or verify orders. Status progresses
from placed to preparation, on the way, and delivered at five-second intervals while order pages
are open.

Browser storage is user-controlled, can be cleared or modified, and is not an appropriate source of
truth for real accounts, orders, or payment. Production ordering requires a backend, server-side
authentication and validation, a managed database, and a payment provider.
