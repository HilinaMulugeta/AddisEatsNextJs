import CartClient from "./CartClient";

export const metadata = {
  title: "Your cart",
  description: "Review your Ethiopian dishes and delivery total before placing an Addis Eats order.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Order Cart</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your delicious selections before completing delivery details.
        </p>
      </div>
      <CartClient />
    </div>
  );
}
