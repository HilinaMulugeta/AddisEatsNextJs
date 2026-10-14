"use client";

import { useState } from "react";
import { etb, when } from "@/lib/format";
import { ordersToCsv } from "@/lib/ordersCsv";
import { getOrderStatusLabel } from "@/lib/orderStatus";

export default function OrderExportButton({ orders }) {
  const [downloaded, setDownloaded] = useState(false);

  function download() {
    const csv = ordersToCsv(orders.map((order) => ({
      orderId: order.id,
      placedAt: when.format(new Date(order.createdAt)),
      status: getOrderStatusLabel(order.status),
      items: order.items.map((item) => `${item.quantity} x ${item.name}`).join("; "),
      total: etb.format(order.total),
    })));
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "addis-eats-order-history.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }

  return <button type="button" onClick={download} disabled={!orders.length} className="min-h-11 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">{downloaded ? "Download again" : "Export order history CSV"}</button>;
}
