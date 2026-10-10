import Link from "next/link";
import OrderStatus from "./OrderStatus";
import AccountGate from "../../AccountGate";

export const metadata = {
  title: "Order status",
  description: "Track your Addis Eats order.",
  robots: { index: false, follow: false },
};

export default async function OrderStatusPage({ params }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Order status</h1>
      </div>
      <AccountGate next={`/orders/${id}`}>
        <OrderStatus id={id} />
      </AccountGate>
      <Link href="/orders" className="inline-block text-xs font-semibold text-amber-700 hover:underline">
        ← Back to your orders
      </Link>
    </div>
  );
}
