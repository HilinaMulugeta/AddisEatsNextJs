"use client";

import { useCart } from "../providers";

export default function AddToCartButton({ dish, available }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(dish)}
      disabled={!available}
      className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg shadow-sm transition"
    >
      {available ? "Add to cart" : "Unavailable"}
    </button>
  );
}
