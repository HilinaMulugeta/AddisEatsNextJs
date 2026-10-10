"use client";

import Link from "next/link";
import { useCart } from "../providers";

export default function MenuSidebarCounter() {
  const { count, subtotal } = useCart();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Your cart</h2>
        <p className="mt-1 text-xs text-slate-500" aria-live="polite">
          {count} {count === 1 ? "item" : "items"} added
        </p>
      </div>
      <p className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600">
        <span>Subtotal</span>
        <span className="font-bold text-slate-900">{subtotal} ETB</span>
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/cart"
          prefetch={false}
          className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-3 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          View cart
        </Link>
        <Link
          href="/checkout"
          prefetch={false}
          className="flex min-h-11 items-center justify-center rounded-xl bg-amber-600 px-3 text-center text-xs font-semibold text-white hover:bg-amber-700"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
