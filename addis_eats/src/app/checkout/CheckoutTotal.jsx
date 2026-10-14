"use client";

import { useCart } from "../providers";
import { DELIVERY_FEE_ETB } from "@/lib/constants";
import { etb } from "@/lib/format";

export default function CheckoutTotal() {
  const { subtotal } = useCart();
  const total = subtotal + DELIVERY_FEE_ETB;

  return (
    <div>
      <span className="text-xs text-slate-500">Estimated total (server verifies prices):</span>
      <p className="text-lg font-black text-amber-700">{etb.format(total)}</p>
    </div>
  );
}
