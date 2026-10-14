import { randomUUID } from "node:crypto";
import Link from "next/link";
import CheckoutForm from "./CheckoutForm";
import { requireAuth } from "@/lib/auth";

export const metadata = {
  title: "Secure order checkout",
  description: "Enter delivery details and choose a payment method to complete your Addis Eats order.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const customer = await requireAuth("/checkout");
  const idempotencyKey = randomUUID();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">Your order will be saved to your signed-in account.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
        <CheckoutForm customer={customer} idempotencyKey={idempotencyKey} />
      </div>

      <div className="text-center">
        <Link href="/menu" className="text-xs font-semibold text-amber-700 hover:underline">
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
}
