import assert from "node:assert/strict";
import Database from "better-sqlite3";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { getSafeRedirectPath } from "../src/lib/redirects.js";

const ordersModule = new URL("../src/lib/orders.js", import.meta.url).href;
const usersModule = new URL("../src/lib/user.js", import.meta.url).href;

test("safe login redirects remain on this site", () => {
  assert.equal(getSafeRedirectPath("/orders?tab=recent"), "/orders?tab=recent");
  assert.equal(getSafeRedirectPath("https://example.org"), "/checkout");
  assert.equal(getSafeRedirectPath("//example.org"), "/checkout");
  assert.equal(getSafeRedirectPath("/\\example.org"), "/checkout");
});

test("users can register and sign in with unique emails and hashed passwords", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "addis-eats-users-"));
  const databasePath = join(directory, "users.sqlite");
  const env = { ...process.env, ADDIS_EATS_DB_PATH: databasePath };
  t.after(() => rmSync(directory, { recursive: true, force: true }));

  const created = JSON.parse(
    execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { createUser, signUpSchema } from ${JSON.stringify(usersModule)};
         const input = signUpSchema.parse({
           name: "Test Customer",
           email: "  Customer@Example.test ",
           password: "my chosen password"
         });
         const user = await createUser(input);
         const duplicate = await createUser({ ...input, email: "customer@example.test" });
         console.log(JSON.stringify({ user, duplicate }));`,
      ],
      { env, encoding: "utf8" },
    ),
  );

  assert.equal(created.user.email, "customer@example.test");
  assert.equal(created.duplicate, null);
  assert.equal("passwordHash" in created.user, false);

  const checked = JSON.parse(
    execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { getUserProfile, verifyUserCredentials } from ${JSON.stringify(usersModule)};
         const valid = await verifyUserCredentials("CUSTOMER@example.test", "my chosen password");
         const invalid = await verifyUserCredentials("customer@example.test", "incorrect");
         console.log(JSON.stringify({
           valid,
           invalid,
           profile: getUserProfile(${JSON.stringify(created.user.id)})
         }));`,
      ],
      { env, encoding: "utf8" },
    ),
  );
  assert.equal(checked.valid.id, created.user.id);
  assert.equal(checked.invalid, null);
  assert.deepEqual(checked.profile, created.user);
});

test("orders persist across processes and remain owner-scoped", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "addis-eats-orders-"));
  const databasePath = join(directory, "orders.sqlite");
  const env = { ...process.env, ADDIS_EATS_DB_PATH: databasePath };
  t.after(() => rmSync(directory, { recursive: true, force: true }));

  const legacyDatabase = new Database(databasePath);
  legacyDatabase.exec(`
    CREATE TABLE orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  legacyDatabase.close();

  const created = JSON.parse(
    execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { createOrder } from ${JSON.stringify(ordersModule)};
         const order = await createOrder({
           userId: "owner",
           name: "Test Customer",
           email: "owner@example.test",
           phone: "0912345678",
           address: "Test address",
           paymentMethod: "cash",
           items: [{ id: "kitfo", name: "Kitfo", price: 1200, quantity: 2, lineTotal: 2400 }],
           subtotal: 2400,
           deliveryFee: 150,
           total: 2550
         });
         console.log(JSON.stringify(order));`,
      ],
      { env, encoding: "utf8" },
    ),
  );

  const checked = JSON.parse(
    execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { cancelOwnedOrder, getOrderForUser } from ${JSON.stringify(ordersModule)};
         const before = await getOrderForUser(${JSON.stringify(created.id)}, "owner");
         const foreign = await getOrderForUser(${JSON.stringify(created.id)}, "other-user");
         const signedOut = await cancelOwnedOrder(${JSON.stringify(created.id)}, null);
         const otherUser = await cancelOwnedOrder(${JSON.stringify(created.id)}, "other-user");
         const unchanged = await getOrderForUser(${JSON.stringify(created.id)}, "owner");
         const cancelled = await cancelOwnedOrder(${JSON.stringify(created.id)}, "owner");
         console.log(JSON.stringify({ before, foreign, signedOut, otherUser, unchanged, cancelled }));`,
      ],
      { env, encoding: "utf8" },
    ),
  );

  assert.equal(checked.before.items[0].lineTotal, 2400);
  assert.equal(checked.before.total, 2550);
  assert.equal(checked.foreign, null);
  assert.equal(checked.signedOut.status, 401);
  assert.equal(checked.otherUser.status, 404);
  assert.equal(checked.unchanged.status, "placed");
  assert.equal(checked.cancelled.order.status, "cancelled");
});
