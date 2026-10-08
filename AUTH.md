# Day 45 authentication and authorization

## Identity and session

Customers can create an account using a name, a valid email address, and a password of 8 to 128
characters. Email addresses are normalized to lowercase and are unique without regard to case.
Passwords are stored as salted scrypt hashes and are never saved or logged in plaintext. Sign-in
checks the submitted password against its stored hash and uses the same error for unknown emails
and incorrect passwords.

Accounts and profiles are stored in the same local SQLite database as orders. There is no email
verification, password reset, or multi-factor authentication in this learning project.

Successful sign-in creates a seven-day, HMAC-SHA256-signed session token containing the user ID
and expiration time. The cookie is `httpOnly`, `SameSite=Lax`, scoped to `/`, and marked `Secure`
in production. `getSessionId()` verifies the signature and expiry; invalid, expired, or tampered
values are treated as unauthenticated. Sign-out is a Server Action that deletes the cookie; there
is no state-changing GET logout route.

## Access checks

| Surface | Access rule |
| --- | --- |
| Menu and dish pages | Public |
| Checkout, profile, order list, order status | Signed-in customer with a valid session and user profile |
| `GET /api/orders` | Signed-in customer; query is filtered to that user |
| `POST /api/orders` | Signed-in customer; payload is validated and `userId`/email come from the session, not the request |
| `GET /api/orders/[id]` | Signed-in owner only; non-owned and missing orders both return 404 |
| Place/cancel Server Actions | Each action verifies the signed session and profile; cancellation only mutates an order owned by that user |

Middleware checks for a cookie to redirect signed-out page requests early. This is only a
navigation convenience: every protected page, API handler, and mutating Server Action also
validates the signed session on the server. Client-side button visibility is never an access
control.

Account and order data persist in a local SQLite database. Order list and detail reads are scoped
by `userId` in `src/lib/orders.js`; the detail helper returns no result for another user's order.
Cancellation uses the same owner-scoped lookup before changing status.

## Redirect safety

Login and sign-up `next` parameters are passed through `getSafeRedirectPath()`. It accepts local
paths only and rejects protocol-relative paths, backslashes, and any URL that resolves to another
origin. Invalid values fall back to `/checkout`.

## Security checks

`npm test` checks account creation, case-insensitive unique email addresses, password hashing and
verification, safe redirects, owner-scoped order lookup, signed-out cancellation, and cross-owner
cancellation in `tests/security.test.mjs`.

The redirect unit test covers both `https://example.org` and `//example.org`, which resolve to the
safe `/checkout` fallback. The login and sign-up forms receive only sanitized redirect paths.

The app intentionally has no kitchen workflow or kitchen role. If one is added, give it a
separate server-verified role and enforce that role in both its page and every associated Server
Action; a hidden link or client-side role flag is not sufficient.
