import { randomUUID } from "node:crypto";
import { ensureDatabase, getDatabase } from "./database.js";
import { getDemoOrderStatus } from "./orderStatus.js";

function toOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    neighborhood: row.neighborhood ?? "Other",
    paymentMethod: row.payment_method,
    items: typeof row.items_json === "string" ? JSON.parse(row.items_json) : row.items_json,
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    status: getDemoOrderStatus(row.status, row.created_at),
    createdAt: row.created_at,
  };
}

function createId() {
  return `ord_${randomUUID()}`;
}

export async function createOrder(data) {
  await ensureDatabase();
  const sql = getDatabase();
  const order = {
    id: createId(),
    userId: data.userId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    neighborhood: data.neighborhood ?? "Other",
    paymentMethod: data.paymentMethod,
    items: data.items ?? [],
    subtotal: data.subtotal ?? 0,
    deliveryFee: data.deliveryFee ?? 150,
    total: data.total ?? 0,
    idempotencyKey: data.idempotencyKey ?? null,
    status: "placed",
    createdAt: new Date().toISOString(),
  };
  const inserted = await sql`
    INSERT INTO orders
      (id, user_id, name, email, phone, address, neighborhood, payment_method, items_json,
       subtotal, delivery_fee, total, idempotency_key, status, created_at)
    VALUES
      (${order.id}, ${order.userId}, ${order.name}, ${order.email}, ${order.phone}, ${order.address},
       ${order.neighborhood}, ${order.paymentMethod}, ${JSON.stringify(order.items)}, ${order.subtotal},
       ${order.deliveryFee}, ${order.total}, ${order.idempotencyKey}, ${order.status}, ${order.createdAt})
    ON CONFLICT (user_id, idempotency_key) DO NOTHING
    RETURNING *
  `;
  if (inserted.length) return toOrder(inserted[0]);
  if (!order.idempotencyKey) return order;
  const existing = await sql`SELECT * FROM orders WHERE user_id = ${order.userId} AND idempotency_key = ${order.idempotencyKey} LIMIT 1`;
  return toOrder(existing[0]);
}

export async function getOrderForUser(id, userId) {
  await ensureDatabase();
  const sql = getDatabase();
  const rows = await sql`SELECT * FROM orders WHERE id = ${id} AND user_id = ${userId} LIMIT 1`;
  return toOrder(rows[0]);
}

export async function listOrdersForUser(userId) {
  await ensureDatabase();
  const sql = getDatabase();
  const rows = await sql`SELECT * FROM orders WHERE user_id = ${userId} ORDER BY created_at DESC`;
  return rows.map(toOrder);
}

const STATUS_SORT = `CASE
  WHEN status = 'cancelled' THEN 4
  WHEN status = 'delivered' OR created_at <= NOW() - INTERVAL '15 seconds' THEN 3
  WHEN status = 'on_the_way' OR created_at <= NOW() - INTERVAL '10 seconds' THEN 2
  WHEN status = 'prepared' OR created_at <= NOW() - INTERVAL '5 seconds' THEN 1
  ELSE 0
END`;

export async function getOrdersPageForUser(userId, { page = 1, sort = "date", dir = "desc", take = 10 } = {}) {
  await ensureDatabase();
  const sql = getDatabase();
  const safePage = Math.max(1, Math.floor(Number(page) || 1));
  const safeTake = Math.min(50, Math.max(1, Math.floor(Number(take) || 10)));
  const sortExpression = sort === "total" ? "total" : sort === "status"
    ? (process.env.ADDIS_EATS_DEMO_AUTO_ADVANCE === "false" ? "status" : STATUS_SORT)
    : "created_at";
  const direction = dir === "asc" ? "ASC" : "DESC";
  const [countRows, rows] = await Promise.all([
    sql`SELECT COUNT(*) AS count FROM orders WHERE user_id = ${userId}`,
    sql`SELECT * FROM orders WHERE user_id = ${userId}
      ORDER BY ${sql.unsafe(sortExpression)} ${sql.unsafe(direction)}, id DESC
      LIMIT ${safeTake} OFFSET ${(safePage - 1) * safeTake}`,
  ]);
  const total = Number(countRows[0]?.count ?? 0);
  const pages = Math.max(1, Math.ceil(total / safeTake));
  const currentPage = Math.min(safePage, pages);
  if (currentPage !== safePage) {
    const lastPageRows = await sql`SELECT * FROM orders WHERE user_id = ${userId}
      ORDER BY ${sql.unsafe(sortExpression)} ${sql.unsafe(direction)}, id DESC
      LIMIT ${safeTake} OFFSET ${(currentPage - 1) * safeTake}`;
    return { rows: lastPageRows.map(toOrder), total, page: currentPage, pages, sort, dir: direction.toLowerCase() };
  }
  return { rows: rows.map(toOrder), total, page: currentPage, pages, sort, dir: direction.toLowerCase() };
}

export async function getOrderDashboardSummary(userId, { days = 30 } = {}) {
  await ensureDatabase();
  const sql = getDatabase();
  const safeDays = Math.min(90, Math.max(7, Math.floor(Number(days) || 30)));
  const orders = await sql`SELECT total, neighborhood, created_at FROM orders
    WHERE user_id = ${userId} AND status != 'cancelled' ORDER BY created_at ASC`;
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - safeDays + 1);
  cutoff.setUTCHours(0, 0, 0, 0);
  const daily = new Map();
  for (let offset = 0; offset < safeDays; offset += 1) {
    const date = new Date(cutoff);
    date.setUTCDate(cutoff.getUTCDate() + offset);
    daily.set(date.toISOString().slice(0, 10), 0);
  }
  const neighborhoods = new Map();
  let revenue = 0;
  for (const order of orders) {
    const amount = Number(order.total);
    revenue += amount;
    const day = new Date(order.created_at).toISOString().slice(0, 10);
    if (daily.has(day)) daily.set(day, daily.get(day) + 1);
    const area = order.neighborhood || "Other";
    neighborhoods.set(area, (neighborhoods.get(area) ?? 0) + amount);
  }
  return {
    revenue,
    orderCount: orders.length,
    byNeighborhood: [...neighborhoods].map(([area, amount]) => ({ area, revenue: amount }))
      .sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    byDay: [...daily].map(([date, count]) => ({ date, orders: count })),
    days: safeDays,
  };
}

export async function getAdminOrderSummary() {
  await ensureDatabase();
  const sql = getDatabase();
  const rows = await sql`SELECT status, created_at, total FROM orders`;
  const summary = {
    total: rows.length,
    revenue: 0,
    byStatus: Object.fromEntries(["placed", "prepared", "on_the_way", "delivered", "cancelled"].map((status) => [status, 0])),
  };
  for (const row of rows) {
    const status = getDemoOrderStatus(row.status, row.created_at);
    summary.byStatus[status] = (summary.byStatus[status] ?? 0) + 1;
    if (status !== "cancelled") summary.revenue += Number(row.total);
  }
  return summary;
}

export async function listRecentOrdersForAdmin(take = 50) {
  await ensureDatabase();
  const sql = getDatabase();
  const safeTake = Math.min(100, Math.max(1, Math.floor(Number(take) || 50)));
  const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT ${safeTake}`;
  return rows.map(toOrder);
}

export async function cancelOwnedOrder(id, sessionId) {
  if (!sessionId) return { ok: false, status: 401, error: "Sign in required" };
  const order = await getOrderForUser(id, sessionId);
  if (!order) return { ok: false, status: 404, error: "Order not found" };
  if (order.status !== "placed") {
    return { ok: false, status: 409, error: "This order can no longer be cancelled." };
  }

  const sql = getDatabase();
  const updatedRows = await sql`UPDATE orders SET status = 'cancelled'
    WHERE id = ${id} AND user_id = ${sessionId} AND status = 'placed' RETURNING *`;
  if (!updatedRows.length) return { ok: false, status: 409, error: "This order can no longer be cancelled." };
  return { ok: true, order: toOrder(updatedRows[0]) };
}
