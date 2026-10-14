export function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function ordersToCsv(rows) {
  const columns = ["Order ID", "Placed at (Addis Ababa)", "Status", "Items", "Total"];
  return [columns, ...rows.map((row) => [row.orderId, row.placedAt, row.status, row.items, row.total])]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
}
