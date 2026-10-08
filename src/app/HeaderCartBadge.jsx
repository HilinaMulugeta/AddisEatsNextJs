"use client";

import { useCart } from "./providers";

export default function HeaderCartBadge() {
  const { count } = useCart();

  return (
    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
      {count}
    </span>
  );
}
