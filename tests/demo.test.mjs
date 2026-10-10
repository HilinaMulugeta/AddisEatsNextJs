import assert from "node:assert/strict";
import test from "node:test";
import { cartItemsSchema, orderSchema } from "../src/lib/orderSchema.js";
import { signInSchema, signUpSchema } from "../src/lib/localAuth.js";
import { parseOrders, updateOrderStatuses } from "../src/lib/localOrders.js";
import { getOrderStatusForAge } from "../src/lib/orderStatus.js";

test("account and checkout forms validate their required fields", () => {
  assert.equal(
    signUpSchema.safeParse({
      name: "Test Customer",
      email: "Customer@example.test",
      password: "long-enough-password",
    }).success,
    true,
  );
  assert.equal(signUpSchema.safeParse({ name: "", email: "nope", password: "short" }).success, false);
  assert.equal(signInSchema.safeParse({ email: "customer@example.test", password: "password" }).success, true);
  const valid = {
    name: "Test Customer",
    email: "customer@example.test",
    phone: "0912345678",
    address: "Bole, Addis Ababa",
    paymentMethod: "cash",
  };
  assert.equal(orderSchema.safeParse(valid).success, true);
  assert.equal(orderSchema.safeParse({ ...valid, email: "not-an-email" }).success, false);
  assert.equal(orderSchema.safeParse({ ...valid, phone: "123" }).success, false);
  assert.deepEqual(cartItemsSchema.safeParse([{ id: "kitfo", quantity: 2 }]).success, true);
  assert.equal(cartItemsSchema.safeParse([]).success, false);
});

test("order status advances in five-second steps and stops at delivered", () => {
  const createdAt = "2026-10-10T06:00:00.000Z";
  const start = Date.parse(createdAt);
  assert.equal(getOrderStatusForAge(createdAt, start + 4999), "placed");
  assert.equal(getOrderStatusForAge(createdAt, start + 5000), "preparation");
  assert.equal(getOrderStatusForAge(createdAt, start + 10000), "on the way");
  assert.equal(getOrderStatusForAge(createdAt, start + 15000), "delivered");
  assert.equal(getOrderStatusForAge("invalid-date", start + 15000), "placed");
});

test("browser order data is validated and cancelled orders remain cancelled", () => {
  const orders = [
    { id: "ord_a", name: "A", phone: "0912345678", address: "Bole", items: [], total: 150, createdAt: "2026-10-10T06:00:00.000Z", status: "placed" },
    { id: "ord_b", name: "B", phone: "0912345678", address: "Bole", items: [], total: 150, createdAt: "2026-10-10T06:00:00.000Z", status: "cancelled" },
  ];
  assert.deepEqual(parseOrders(JSON.stringify(orders)), orders);
  assert.throws(() => parseOrders('{"unexpected":true}'), /invalid format/i);

  const result = updateOrderStatuses(orders, (createdAt) =>
    getOrderStatusForAge(createdAt, Date.parse("2026-10-10T06:00:15.000Z")),
  );
  assert.equal(result.changed, true);
  assert.equal(result.orders[0].status, "delivered");
  assert.equal(result.orders[1].status, "cancelled");
});
