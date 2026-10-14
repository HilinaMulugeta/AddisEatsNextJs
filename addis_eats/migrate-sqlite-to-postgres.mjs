import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { ensureDatabase, getDatabase } from "./src/lib/database.js";

const sqlitePath = resolve(process.env.ADDIS_EATS_SQLITE_PATH ?? ".data/orders.sqlite");
if (!existsSync(sqlitePath)) {
  throw new Error(`SQLite file not found at ${sqlitePath}. Set ADDIS_EATS_SQLITE_PATH to its location.`);
}

const legacy = new DatabaseSync(sqlitePath, { readOnly: true });
const sql = getDatabase();
await ensureDatabase();

const tableNames = new Set(legacy.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((row) => row.name));
const hasUsers = tableNames.has("users");
const hasOrders = tableNames.has("orders");
const sourceUsers = hasUsers
  ? legacy.prepare("SELECT id, name, email, password_hash, created_at FROM users").all()
  : [];
const orderColumns = hasOrders
  ? new Set(legacy.prepare("PRAGMA table_info(orders)").all().map((column) => column.name))
  : new Set();
const sourceOrders = hasOrders ? legacy.prepare("SELECT * FROM orders ORDER BY created_at ASC").all() : [];
const userIds = new Map();
let migratedUsers = 0;
let migratedOrders = 0;
let skippedOrders = 0;

for (const user of sourceUsers) {
  const email = user.email.trim().toLowerCase();
  const existing = await sql`SELECT id FROM users WHERE lower(email) = ${email} LIMIT 1`;
  let targetId = existing[0]?.id;
  if (!targetId) {
    const inserted = await sql`INSERT INTO users (id, name, email, password_hash, created_at)
      VALUES (${user.id}, ${user.name}, ${email}, ${user.password_hash}, ${user.created_at})
      ON CONFLICT (email) DO NOTHING RETURNING id`;
    targetId = inserted[0]?.id;
    if (targetId) migratedUsers += 1;
    else {
      const conflict = await sql`SELECT id FROM users WHERE lower(email) = ${email} LIMIT 1`;
      targetId = conflict[0]?.id;
    }
  }
  if (targetId) userIds.set(user.id, targetId);
}

function legacyValue(row, name, fallback) {
  return orderColumns.has(name) && row[name] !== null && row[name] !== undefined ? row[name] : fallback;
}

for (const row of sourceOrders) {
  const userId = userIds.get(row.user_id);
  if (!userId) {
    skippedOrders += 1;
    continue;
  }
  const existingId = await sql`SELECT id FROM orders WHERE id = ${row.id} LIMIT 1`;
  if (existingId.length) continue;

  const idempotencyKey = legacyValue(row, "idempotency_key", null);
  if (idempotencyKey) {
    const duplicate = await sql`SELECT id FROM orders WHERE user_id = ${userId} AND idempotency_key = ${idempotencyKey} LIMIT 1`;
    if (duplicate.length) continue;
  }

  await sql`INSERT INTO orders
    (id, user_id, name, email, phone, address, neighborhood, payment_method, items_json,
     subtotal, delivery_fee, total, idempotency_key, status, created_at)
    VALUES (
      ${row.id}, ${userId}, ${row.name}, ${row.email}, ${row.phone}, ${row.address},
      ${legacyValue(row, "neighborhood", "Other")}, ${row.payment_method},
      ${legacyValue(row, "items_json", "[]")}, ${legacyValue(row, "subtotal", 0)},
      ${legacyValue(row, "delivery_fee", 150)}, ${legacyValue(row, "total", 0)},
      ${idempotencyKey}, ${row.status}, ${row.created_at}
    ) ON CONFLICT (id) DO NOTHING`;
  migratedOrders += 1;
}

legacy.close();
console.log(`Migration finished. Accounts copied: ${migratedUsers}; orders copied: ${migratedOrders}; orphan orders skipped: ${skippedOrders}.`);
