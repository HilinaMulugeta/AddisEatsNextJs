import { neon } from "@neondatabase/serverless";

let sqlClient;
let schemaReady;

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error(
      "Database is not configured. Add DATABASE_URL for local development and the Vercel deployment environments.",
    );
  }
  sqlClient ??= neon(connectionString);
  return sqlClient;
}

export async function ensureDatabase() {
  if (!schemaReady) {
    const sql = getDatabase();
    schemaReady = sql.transaction([
      sql`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
      sql`CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        neighborhood TEXT NOT NULL DEFAULT 'Other',
        payment_method TEXT NOT NULL,
        items_json TEXT NOT NULL DEFAULT '[]',
        subtotal INTEGER NOT NULL DEFAULT 0,
        delivery_fee INTEGER NOT NULL DEFAULT 150,
        total INTEGER NOT NULL DEFAULT 0,
        idempotency_key TEXT,
        status TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
      sql`CREATE INDEX IF NOT EXISTS orders_user_created ON orders (user_id, created_at DESC)`,
      sql`CREATE UNIQUE INDEX IF NOT EXISTS orders_user_idempotency ON orders (user_id, idempotency_key)`,
    ]).catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }
  await schemaReady;
}
