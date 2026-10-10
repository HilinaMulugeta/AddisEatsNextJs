"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ORDER_STATUSES, formatOrderStatus } from "@/lib/orderStatus";

export default function OrderStatus({ id, initial }) {
  const { data, error, isValidating } = useSWR(
    id ? `/api/orders/${encodeURIComponent(id)}` : null,
    fetcher,
    {
      fallbackData: initial ?? undefined,
      refreshInterval: (latestOrder) =>
        latestOrder?.status === "delivered" || latestOrder?.status === "cancelled"
          ? 0
          : 5000,
    },
  );

  const order = data ?? initial;

  if (!order) {
    return <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading order…</p>;
  }

  if (error) {
    return (
      <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not refresh this order: {error.message}
      </p>
    );
  }

  const isCancelled = order.status === "cancelled";
  const currentStatusIndex = ORDER_STATUSES.indexOf(order.status);

  return (
    <section aria-live="polite" className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold text-slate-500">{order.id}</p>
          <p className="mt-1 text-sm text-slate-600">
            Placed{" "}
            <time dateTime={order.createdAt}>
              {new Date(order.createdAt).toLocaleString()}
            </time>
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
            isCancelled ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {formatOrderStatus(order.status)}
        </span>
      </div>
      {isCancelled ? (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          This order was cancelled.
        </p>
      ) : (
        <ol
          aria-label="Order progress"
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {ORDER_STATUSES.map((status, index) => {
            const isComplete = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;

            return (
              <li
                key={status}
                aria-current={isCurrent ? "step" : undefined}
                className={`rounded-xl border p-3 text-center text-xs font-semibold ${
                  isCurrent
                    ? "border-amber-300 bg-amber-50 text-amber-900"
                    : isComplete
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                <span aria-hidden="true" className="mb-1 block text-base">
                  {isComplete ? "✓" : "○"}
                </span>
                {formatOrderStatus(status)}
              </li>
            );
          })}
        </ol>
      )}
      <div className="border-t border-slate-100 pt-4 text-sm text-slate-600">
        <p>
          {order.name} · {order.phone}
        </p>
        <p className="mt-1">{order.address}</p>
        <p className="mt-1 capitalize">Payment: {order.paymentMethod}</p>
        {order.items.length ? (
          <ul className="mt-4 space-y-1">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.quantity} × {item.name} — {item.lineTotal} ETB
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-3 font-bold text-slate-900">Total: {order.total} ETB</p>
      </div>
      <p className="text-xs text-slate-400">
        {isValidating ? "Checking for updates…" : isCancelled || order.status === "delivered"
          ? `Status: ${formatOrderStatus(order.status)}.`
          : "Status updates automatically every five seconds."}
      </p>
    </section>
  );
}
