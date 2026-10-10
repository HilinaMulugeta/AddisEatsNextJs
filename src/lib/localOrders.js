export const ORDER_STORAGE_KEY = "addis-eats-orders";
export const ORDER_CHANGED_EVENT = "addis-eats-orders-change";
const EMPTY_ORDERS = "[]";
const STORAGE_READ_ERROR = "__orders-storage-read-error__";

export function parseOrders(raw) {
  const orders = JSON.parse(raw);
  if (
    !Array.isArray(orders) ||
    orders.some(
      (order) =>
        typeof order.id !== "string" ||
        typeof order.name !== "string" ||
        typeof order.phone !== "string" ||
        typeof order.address !== "string" ||
        !Array.isArray(order.items) ||
        !Number.isFinite(order.total) ||
        typeof order.createdAt !== "string" ||
        typeof order.status !== "string",
    )
  ) {
    throw new Error("Saved orders have an invalid format.");
  }
  return orders;
}

export function getEmptyOrdersSnapshot() {
  return EMPTY_ORDERS;
}

export function getOrdersSnapshot() {
  try {
    return window.localStorage.getItem(ORDER_STORAGE_KEY) || EMPTY_ORDERS;
  } catch {
    return STORAGE_READ_ERROR;
  }
}

export function subscribeToOrders(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(ORDER_CHANGED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ORDER_CHANGED_EVENT, callback);
  };
}

export function writeOrders(orders) {
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event(ORDER_CHANGED_EVENT));
}

export function updateOrderStatuses(orders, getStatus) {
  let changed = false;
  const updated = orders.map((order) => {
    if (order.status === "cancelled") return order;
    const status = getStatus(order.createdAt);
    if (status === order.status) return order;
    changed = true;
    return { ...order, status };
  });
  return { orders: updated, changed };
}
