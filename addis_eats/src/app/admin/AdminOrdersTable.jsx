"use client";

import { useState } from "react";
import { etb, when } from "@/lib/format";
import { getOrderStatusLabel } from "@/lib/orderStatus";

export default function AdminOrdersTable({ orders }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!orders.length) {
    return <p className="py-10 text-center text-sm text-slate-500">No orders have been placed yet.</p>;
  }

  return (
    <div className="divide-y divide-slate-100">
      {orders.map((order) => {
        const expanded = expandedId === order.id;
        return (
          <article key={order.id} className="px-4 py-4 sm:px-6">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`order-details-${order.id}`}
              onClick={() => setExpandedId(expanded ? null : order.id)}
              className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 text-left sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,.8fr)_minmax(0,.8fr)_auto]"
            >
              <span className="min-w-0">
                <span className="block truncate font-semibold text-orange-800">{order.id}</span>
                <span className="mt-1 block truncate text-xs text-slate-500">{order.name} · {order.email}</span>
              </span>
              <span className="hidden text-sm text-slate-600 sm:block">{order.neighborhood}</span>
              <span className="hidden text-sm text-slate-600 sm:block">{when.format(new Date(order.createdAt))}</span>
              <span className={`hidden justify-self-start rounded-full px-3 py-1 text-xs font-bold sm:inline-flex order-status ${order.status}`}>{getOrderStatusLabel(order.status)}</span>
              <span className="text-right">
                <span className="block font-bold tabular-nums text-slate-900">{etb.format(order.total)}</span>
                <span className="mt-1 block text-xs font-semibold text-orange-700">{expanded ? "Hide details ↑" : "View details ↓"}</span>
              </span>
              <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold sm:hidden order-status ${order.status}`}>{getOrderStatusLabel(order.status)}</span>
            </button>
            {expanded && (
              <div id={`order-details-${order.id}`} className="mt-4 grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <Detail label="Customer" value={order.name} />
                <Detail label="Email" value={order.email} />
                <Detail label="Phone" value={order.phone} />
                <Detail label="Delivery area" value={order.neighborhood} />
                <Detail label="Delivery address" value={order.address} />
                <Detail label="Payment method" value={order.paymentMethod} />
                <Detail label="Order total" value={etb.format(order.total)} />
                <div className="sm:col-span-2 lg:col-span-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Items</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {(order.items ?? []).map((item, index) => (
                      <li key={`${item.id ?? item.name ?? "item"}-${index}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700">
                        {item.name ?? item.title ?? "Menu item"} × {item.quantity ?? item.qty ?? 1}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function Detail({ label, value }) {
  return <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 break-words font-medium text-slate-800">{value || "—"}</p></div>;
}
