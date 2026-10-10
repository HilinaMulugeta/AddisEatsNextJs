"use client";

import { useEffect } from "react";
import Link from "next/link";
import CancelOrderButton from "./CancelOrderButton";
import { useLocalOrders } from "./useLocalOrders";
import { formatOrderStatus } from "@/lib/orderStatus";

export default function OrdersClient() {
  const { orders, storageError, refreshStatuses } = useLocalOrders();

  useEffect(() => {
    refreshStatuses();
    const timer = window.setInterval(refreshStatuses, 5000);
    return () => window.clearInterval(timer);
  }, [refreshStatuses]);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Your orders</h1>
      </div>

      {storageError ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {storageError}
        </p>
      ) : null}

      {orders.length === 0 ? (
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-600">You haven’t placed any orders yet.</p>
          <Link href="/menu" className="text-xs font-semibold text-amber-700 hover:underline">
            Browse the menu
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="space-y-1 text-xs text-slate-600">
                <p className="font-mono font-bold text-slate-900">{order.id}</p>
                <Link href={`/orders/${order.id}`} className="font-semibold text-amber-700 hover:underline">
                  Track order status
                </Link>
                <p>{order.name} · {order.phone}</p>
                <p>{order.address}</p>
                <p>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</p>
                <p>Total: {order.total} ETB · <span className="capitalize">{order.paymentMethod}</span></p>
                <p className={order.status === "cancelled" ? "font-semibold text-slate-400" : "font-semibold text-emerald-700"}>
                  {formatOrderStatus(order.status)}
                </p>
              </div>
              {order.status === "placed" ? <CancelOrderButton orderId={order.id} /> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
