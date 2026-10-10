"use client";

import Link from "next/link";
import { useAccount } from "../useAccount";
import { useLocalOrders } from "../orders/useLocalOrders";

export default function ProfileClient() {
  const account = useAccount();
  const { orders } = useLocalOrders();

  if (!account || account.error) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Your profile</h1>
        <p className="mt-1 text-sm text-slate-600">Welcome back, {account.name}.</p>
      </div>
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Account details</h2>
        <p className="text-sm text-slate-600">{account.name}</p>
        <p className="text-sm text-slate-600">{account.email}</p>
      </section>
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent orders</h2>
          <Link href="/orders" className="text-xs font-semibold text-amber-700 hover:underline">View all</Link>
        </div>
        {orders.length ? (
          <ul className="space-y-2 text-sm text-slate-600">
            {orders.slice(0, 3).map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3">
                <Link href={`/orders/${order.id}`} className="font-mono text-xs text-amber-700 hover:underline">
                  {order.id}
                </Link>
                <span className="capitalize">{order.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">You haven’t placed any orders yet.</p>
        )}
      </section>
    </div>
  );
}
