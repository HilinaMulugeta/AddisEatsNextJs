import CheckoutForm from "./CheckoutForm";
import AccountGate from "../AccountGate";

export const metadata = {
  title: "Checkout",
  description: "Enter delivery details and complete your Addis Eats order.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Checkout</h1>
        <p className="mt-1 text-xs text-slate-500">Review your details and complete your order.</p>
      </div>
      <AccountGate next="/checkout">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <CheckoutForm />
        </div>
      </AccountGate>
    </div>
  );
}
