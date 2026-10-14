import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrderForUser } from "@/lib/orders";
import { getAuthenticatedUser } from "@/lib/auth";
import OrderStatus from "./OrderStatus";

export const metadata = {
  title: "Private order status",
  description: "Privately check the latest delivery status for your Addis Eats order.",
  robots: { index: false, follow: false },
};

export default async function OrderStatusPage({ params }) {
  const { id } = await params;
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/orders/${id}`)}`);

  const order = await getOrderForUser(id, user.id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Order status</h1>
        <p className="mt-1 text-xs text-slate-500">Rendered with your order, then checked for updates every five seconds.</p>
      </div>
      <OrderStatus id={id} initial={order} />
      <Link href="/orders" className="inline-block text-xs font-semibold text-amber-700 hover:underline">← Back to your orders</Link>
    </div>
  );
}
