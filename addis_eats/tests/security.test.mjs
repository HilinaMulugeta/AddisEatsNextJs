import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { getSafeRedirectPath } from "../src/lib/redirects.js";
import { ensureDatabase, getDatabase } from "../src/lib/database.js";
import { createUser, getUserProfile, signUpSchema, verifyUserCredentials } from "../src/lib/user.js";
import { cancelOwnedOrder, createOrder, getOrderForUser } from "../src/lib/orders.js";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (testDatabaseUrl) process.env.DATABASE_URL = testDatabaseUrl;

test("safe login redirects remain on this site", () => {
  assert.equal(getSafeRedirectPath("/orders?tab=recent"), "/orders?tab=recent");
  assert.equal(getSafeRedirectPath("https://example.org"), "/checkout");
  assert.equal(getSafeRedirectPath("//example.org"), "/checkout");
  assert.equal(getSafeRedirectPath("/\\example.org"), "/checkout");
});

test("users can register and sign in with unique emails and hashed passwords", {
  skip: !testDatabaseUrl && "Set TEST_DATABASE_URL to a disposable Postgres database for integration tests.",
}, async (t) => {
  await ensureDatabase();
  const sql = getDatabase();
  const input = signUpSchema.parse({
    name: "Test Customer",
    email: ` Customer-${randomUUID()}@Example.test `,
    password: "my chosen password",
  });
  const user = await createUser(input);
  t.after(async () => {
    await sql`DELETE FROM users WHERE id = ${user.id}`;
  });
  const duplicate = await createUser({ ...input, email: input.email.toUpperCase() });
  const valid = await verifyUserCredentials(input.email, input.password);
  const invalid = await verifyUserCredentials(input.email, "incorrect");
  const profile = await getUserProfile(user.id);

  assert.equal(user.email, input.email);
  assert.equal(duplicate, null);
  assert.equal(valid.id, user.id);
  assert.equal(invalid, null);
  assert.deepEqual(profile, user);
});

test("orders persist and remain owner-scoped", {
  skip: !testDatabaseUrl && "Set TEST_DATABASE_URL to a disposable Postgres database for integration tests.",
}, async (t) => {
  await ensureDatabase();
  const sql = getDatabase();
  const owner = await createUser({
    name: "Test Customer",
    email: `orders-${randomUUID()}@example.test`,
    password: "a test password",
  });
  t.after(async () => {
    await sql.transaction([
      sql`DELETE FROM orders WHERE user_id = ${owner.id}`,
      sql`DELETE FROM users WHERE id = ${owner.id}`,
    ]);
  });

  const created = await createOrder({
    userId: owner.id,
    name: owner.name,
    email: owner.email,
    phone: "0912345678",
    address: "Test address",
    paymentMethod: "cash",
    items: [{ id: "kitfo", name: "Kitfo", price: 1200, quantity: 2, lineTotal: 2400 }],
    subtotal: 2400,
    deliveryFee: 150,
    total: 2550,
  });
  const before = await getOrderForUser(created.id, owner.id);
  const foreign = await getOrderForUser(created.id, "other-user");
  const signedOut = await cancelOwnedOrder(created.id, null);
  const otherUser = await cancelOwnedOrder(created.id, "other-user");
  const cancelled = await cancelOwnedOrder(created.id, owner.id);

  assert.equal(before.items[0].lineTotal, 2400);
  assert.equal(before.total, 2550);
  assert.equal(foreign, null);
  assert.equal(signedOut.status, 401);
  assert.equal(otherUser.status, 404);
  assert.equal(cancelled.order.status, "cancelled");
});
