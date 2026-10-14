import assert from "node:assert/strict";
import test from "node:test";
import { isAdminEmail } from "../src/lib/admin.js";
import { getDemoOrderStatus, getOrderStatusLabel, ORDER_STATUS_STEP_MS } from "../src/lib/orderStatus.js";

test("demo order status advances every five seconds and stops at delivery", () => {
  const createdAt = "2026-10-13T12:00:00.000Z";
  const start = Date.parse(createdAt);
  assert.equal(ORDER_STATUS_STEP_MS, 5000);
  assert.equal(getDemoOrderStatus("placed", createdAt, start + 4999), "placed");
  assert.equal(getDemoOrderStatus("placed", createdAt, start + 5000), "prepared");
  assert.equal(getDemoOrderStatus("placed", createdAt, start + 10000), "on_the_way");
  assert.equal(getDemoOrderStatus("placed", createdAt, start + 15000), "delivered");
  assert.equal(getDemoOrderStatus("cancelled", createdAt, start + 30000), "cancelled");
  assert.equal(getOrderStatusLabel("on_the_way"), "On the way");
});

test("admin access uses a case-insensitive allowlist and denies unlisted accounts", () => {
  assert.equal(isAdminEmail(" Admin@Example.com ", "admin@example.com, owner@example.com"), true);
  assert.equal(isAdminEmail("customer@example.com", "admin@example.com"), false);
  assert.equal(isAdminEmail("admin@example.com", ""), false);
  assert.equal(isAdminEmail(null, "admin@example.com"), false);
});
