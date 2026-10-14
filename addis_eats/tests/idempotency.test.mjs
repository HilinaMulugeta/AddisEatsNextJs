import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { ensureDatabase, getDatabase } from "../src/lib/database.js";
import { createOrder } from "../src/lib/orders.js";
import { createUser } from "../src/lib/user.js";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (testDatabaseUrl) process.env.DATABASE_URL = testDatabaseUrl;

test("retrying checkout with the same key returns one order", {
  skip: !testDatabaseUrl && "Set TEST_DATABASE_URL to a disposable Postgres database for integration tests.",
}, async (t) => {
  await ensureDatabase();
  const sql = getDatabase();
  const user = await createUser({
    name: "Test Customer",
    email: `idempotency-${randomUUID()}@example.test`,
    password: "a test password",
  });
  const idempotencyKey = randomUUID();
  t.after(async () => {
    await sql.transaction([
      sql`DELETE FROM orders WHERE user_id = ${user.id}`,
      sql`DELETE FROM users WHERE id = ${user.id}`,
    ]);
  });
  const order = {
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: "0912345678",
    address: "Test address",
    paymentMethod: "cash",
    items: [],
    subtotal: 0,
    total: 150,
    idempotencyKey,
  };

  const first = await createOrder(order);
  const retry = await createOrder({ ...order, name: "Changed retry payload" });
  const countRows = await sql`SELECT COUNT(*) AS count FROM orders WHERE user_id = ${user.id}`;

  assert.equal(retry.id, first.id);
  assert.equal(Number(countRows[0].count), 1);
});
