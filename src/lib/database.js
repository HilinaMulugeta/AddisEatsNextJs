import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const databasePath = resolve(
  process.env.ADDIS_EATS_DB_PATH || join(process.cwd(), ".data", "orders.sqlite"),
);
mkdirSync(dirname(databasePath), { recursive: true });

const database = new Database(databasePath);
database.pragma("journal_mode = WAL");
database.pragma("busy_timeout = 5000");
database.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    items_json TEXT NOT NULL DEFAULT '[]',
    subtotal INTEGER NOT NULL DEFAULT 0,
    delivery_fee INTEGER NOT NULL DEFAULT 150,
    total INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS orders_user_created
    ON orders (user_id, created_at DESC);
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

database.transaction(() => {
  const existingColumns = new Set(
    database.prepare("PRAGMA table_info(orders)").all().map((column) => column.name),
  );
  for (const [name, definition] of [
    ["items_json", "TEXT NOT NULL DEFAULT '[]'"],
    ["subtotal", "INTEGER NOT NULL DEFAULT 0"],
    ["delivery_fee", "INTEGER NOT NULL DEFAULT 150"],
    ["total", "INTEGER NOT NULL DEFAULT 0"],
  ]) {
    if (!existingColumns.has(name)) {
      database.exec(`ALTER TABLE orders ADD COLUMN ${name} ${definition}`);
    }
  }
}).immediate();

export default database;
