"use client";

import { useCart } from "../providers";
import { DELIVERY_FEE_ETB } from "@/lib/constants";

export default function CheckoutTotal() {
  const { subtotal } = useCart();
  const total = subtotal + DELIVERY_FEE_ETB;

  return (
    <div>
      <span className="text-xs text-slate-500">Estimated total:</span>
      <p className="text-lg font-black text-amber-700">{total} ETB</p>
    </div>
  );
}
