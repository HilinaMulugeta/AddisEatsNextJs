import Link from "next/link";
import { listOrdersForUser } from "@/lib/orders";
import { requireAuth } from "@/lib/auth";
import CancelOrderButton from "./CancelOrderButton";
import SignOutButton from "../SignOutButton";

export const metadata = {
  title: "Your orders",
  description: "Privately review and manage Ethiopian food orders placed from your Addis Eats account.",
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const user = await requireAuth("/orders");
  const orders = await listOrdersForUser(user.id);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your orders</h1>
          <SignOutButton />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Cancel is checked on the server against your session and the order owner. Hiding this
          button does not grant access to someone else&apos;s order.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3">
          <p className="text-sm text-slate-600">No orders for this session yet.</p>
          <Link href="/checkout" className="text-xs font-semibold text-amber-700 hover:underline">
            Go to checkout
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start justify-between gap-4"
            >
              <div className="space-y-1 text-xs text-slate-600">
                <p className="font-mono font-bold text-slate-900">{order.id}</p>
                <Link href={`/orders/${order.id}`} className="font-semibold text-amber-700 hover:underline">Track order status</Link>
                <p>
                  {order.name} · {order.phone}
                </p>
                <p>{order.address}</p>
                <p>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</p>
                <p>Total: {order.total} ETB · <span className="capitalize">{order.paymentMethod}</span></p>
                <p
                  className={
                    order.status === "cancelled" ? "text-slate-400 font-semibold" : "text-emerald-700 font-semibold"
                  }
                >
                  {order.status}
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
