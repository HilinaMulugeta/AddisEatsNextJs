import { randomUUID } from "node:crypto";
import database from "./database.js";
import { getOrderStatusForAge, ORDER_STATUSES } from "./orderStatus.js";

function refreshOrderStatus(row) {
  if (!row || row.status === "cancelled") return row;

  const currentIndex = ORDER_STATUSES.indexOf(row.status);
  if (currentIndex < 0) return row;

  const nextStatus = getOrderStatusForAge(row.created_at);
  if (ORDER_STATUSES.indexOf(nextStatus) <= currentIndex) return row;

  const result = database
    .prepare("UPDATE orders SET status = ? WHERE id = ? AND user_id = ? AND status = ?")
    .run(nextStatus, row.id, row.user_id, row.status);
  if (result.changes !== 1) {
    return database
      .prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?")
      .get(row.id, row.user_id);
  }
  row.status = nextStatus;
  return row;
}

function toOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    paymentMethod: row.payment_method,
    items: JSON.parse(row.items_json),
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    total: row.total,
    status: row.status,
    createdAt: row.created_at,
  };
}

function createId() {
  return `ord_${randomUUID()}`;
}

export async function createOrder(data) {
  const order = {
    id: createId(),
    userId: data.userId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    paymentMethod: data.paymentMethod,
    items: data.items ?? [],
    subtotal: data.subtotal ?? 0,
    deliveryFee: data.deliveryFee ?? 150,
    total: data.total ?? 0,
    status: "placed",
    createdAt: new Date().toISOString(),
  };
  database
    .prepare(`
      INSERT INTO orders
        (id, user_id, name, email, phone, address, payment_method, items_json,
         subtotal, delivery_fee, total, status, created_at)
      VALUES
        (@id, @userId, @name, @email, @phone, @address, @paymentMethod, @items,
         @subtotal, @deliveryFee, @total, @status, @createdAt)
    `)
    .run({ ...order, items: JSON.stringify(order.items) });
  return order;
}

export async function getOrderForUser(id, userId) {
  const row = database
    .prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?")
    .get(id, userId);
  return toOrder(refreshOrderStatus(row));
}

export async function listOrdersForUser(userId) {
  const rows = database
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId);
  return rows.map((row) => toOrder(refreshOrderStatus(row)));
}

export async function cancelOwnedOrder(id, sessionId) {
  if (!sessionId) {
    return { ok: false, status: 401, error: "Sign in required" };
  }
  const order = await getOrderForUser(id, sessionId);
  if (!order) {
    return { ok: false, status: 404, error: "Order not found" };
  }
  if (order.status !== "placed") {
    return {
      ok: false,
      status: 409,
      error: "This order can no longer be cancelled after preparation has started.",
    };
  }
  const result = database
    .prepare("UPDATE orders SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status = 'placed'")
    .run(id, sessionId);
  if (result.changes !== 1) {
    return {
      ok: false,
      status: 409,
      error: "This order can no longer be cancelled after preparation has started.",
    };
  }
  const updated = await getOrderForUser(id, sessionId);
  return { ok: true, order: updated };
}
