export const ORDER_STATUSES = [
  "placed",
  "preparation",
  "on the way",
  "delivered",
];

export const ORDER_STATUS_INTERVAL_MS = 5000;

export function getOrderStatusForAge(createdAt, now = Date.now()) {
  const createdAtMs = Date.parse(createdAt);
  if (!Number.isFinite(createdAtMs)) return ORDER_STATUSES[0];

  const elapsedMs = Math.max(0, now - createdAtMs);
  const index = Math.min(
    Math.floor(elapsedMs / ORDER_STATUS_INTERVAL_MS),
    ORDER_STATUSES.length - 1,
  );
  return ORDER_STATUSES[index];
}

export function formatOrderStatus(status) {
  return status.replace(/\b\w/g, (character) => character.toUpperCase());
}
