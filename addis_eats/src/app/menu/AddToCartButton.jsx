"use client";

import { useCart } from "../providers";

export default function AddToCartButton({ dish, available }) {
  const { addItem, items } = useCart();
  const quantity = items.find((item) => item.id === dish.id)?.quantity ?? 0;

  return (
    <button
      type="button"
      onClick={() => addItem(dish)}
      disabled={!available}
      className="text-xs font-semibold bg-amber-700 hover:bg-amber-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg shadow-sm transition"
    >
      {!available
        ? "Unavailable"
        : quantity > 0
          ? `Add to cart · ${quantity}`
          : "Add to cart"}
    </button>
  );
}
