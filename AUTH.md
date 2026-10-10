# Account flow

This assignment frontend includes a browser-only account flow. Sign-up stores a normalized email,
display name, random salt, and PBKDF2-SHA-256 password hash in `localStorage`. Passwords are not
stored as plain text. Sign-in verifies the password in the browser and puts the account ID in
`sessionStorage`; the session ends when the browser tab/session is closed or the user signs out.

Checkout, profile, and order history require a signed-in browser session. Sign-up returns the
customer to sign-in, and sign-in returns to the requested local page. Account and order data are
kept per browser and are not synced to the server or other devices.

This is not production authentication. Anyone with access to the browser can inspect or change
local data, and client-side route checks can be bypassed. Do not use a real password or sensitive
personal/payment details. A production account system requires server-side authentication,
protected storage, a backend, and a managed database.
