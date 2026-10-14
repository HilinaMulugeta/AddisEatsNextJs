export const ORDER_STATUS_FLOW = ["placed", "prepared", "on_the_way", "delivered"];
export const ORDER_STATUS_STEP_MS = 5_000;

const STATUS_LABELS = {
  placed: "Placed",
  prepared: "Prepared",
  on_the_way: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function getOrderStatusLabel(status) {
  return STATUS_LABELS[status] ?? "Order status";
}

export function getDemoOrderStatus(storedStatus, createdAt, now = Date.now()) {
  if (storedStatus === "cancelled" || storedStatus === "delivered") return storedStatus;
  if (process.env.ADDIS_EATS_DEMO_AUTO_ADVANCE === "false") return storedStatus;

  const startedAt = new Date(createdAt).getTime();
  if (!Number.isFinite(startedAt)) return storedStatus;

  const step = Math.floor(Math.max(0, now - startedAt) / ORDER_STATUS_STEP_MS);
  return ORDER_STATUS_FLOW[Math.min(step, ORDER_STATUS_FLOW.length - 1)];
}
