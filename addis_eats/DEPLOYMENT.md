# Deployment and persistent storage

Accounts and orders now use managed PostgreSQL through Neon’s serverless driver. SQLite files on a
serverless function’s local filesystem are not shared or durable; browser `localStorage` is only
for the current customer’s cart and favorites and must not be trusted for accounts or orders.

## Connect Neon to Vercel

1. In the Vercel project that deploys this app, add Neon from the Vercel Marketplace and create a
   database in a region close to the Vercel Functions region.
2. Use a separate Neon branch/database for Preview and Production. Do not point Preview to
   Production data.
3. Configure the connection string as the server-only `DATABASE_URL` in both Vercel environments.
   Keep it out of `NEXT_PUBLIC_*` variables and source control.
4. For local development, set `DATABASE_URL` in `.env.local` to a development branch. Set
   `SESSION_SECRET`, `SITE_URL`, and `ADMIN_EMAILS` there as well.
5. Commit this code to the GitHub repository connected to Vercel and deploy. The app creates its
   tables and indexes on the first account/order database request.
6. Test Preview with a new account, checkout, order tracking, cancellation, and admin allowlist.
   Confirm the order remains after a new deployment before promoting to Production.

The app accepts `DATABASE_URL` and `POSTGRES_URL`; prefer `DATABASE_URL` for a consistent local
and Vercel setup. The Neon driver sends parameterized SQL over HTTP, which fits Vercel’s
serverless runtime. Database methods remain on the server.

## Migrate local records

If `.data/orders.sqlite` contains local demo accounts/orders worth keeping, back it up, point
`.env.local` at a **development** Neon database, and run:

```powershell
node --env-file=.env.local migrate-sqlite-to-postgres.mjs
```

The importer uses Node's built-in SQLite reader and requires Node.js 22.13 or newer. The importer
is repeatable, preserves password hashes and order IDs, maps matching emails to the
existing Postgres account, and skips orphan orders. It prints counts only. Verify the copied
records on the development branch before considering any production import. The old `.data/` file
is retained locally and is no longer read by the application.

## Environment checklist

| Variable | Local development | Vercel Preview | Vercel Production |
| --- | --- | --- | --- |
| `DATABASE_URL` | Development Neon branch | Separate test branch | Production Neon branch |
| `SESSION_SECRET` | Unique random secret | Unique preview secret | Different production secret (32+ characters) |
| `SITE_URL` | `http://localhost:3000` | Preview HTTPS URL | Production HTTPS domain |
| `ADMIN_EMAILS` | Test admin only | Test admin accounts | Authorized admin accounts |

Never commit `.env.local`, database URLs, session secrets, or admin credentials. After deployment,
check the public menu, sign-in, checkout, order status, signed-out behavior, and private admin
access. Keep the previous Vercel deployment available for rollback.
