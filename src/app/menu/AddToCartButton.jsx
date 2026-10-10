"use client";

import { useState } from "react";
import { useCart } from "../providers";

export default function AddToCartButton({ dish, available }) {
  const { addItem, items, storageError } = useCart();
  const [announcement, setAnnouncement] = useState("");
  const quantity = items.find((item) => item.id === dish.id)?.quantity ?? 0;

  function handleAdd() {
    const saved = addItem(dish);
    setAnnouncement(
      saved
        ? `Added ${dish.name}. ${quantity + 1} in your cart.`
        : `Could not add ${dish.name} to your cart.`,
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {quantity > 0 ? (
        <span className="text-[11px] font-semibold text-emerald-700">
          In cart: {quantity}
        </span>
      ) : null}
      <button
        type="button"
        onClick={handleAdd}
        disabled={!available}
        className="min-h-11 whitespace-nowrap rounded-lg bg-amber-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {available ? (quantity > 0 ? "Add another" : "Add to cart") : "Unavailable"}
      </button>
      {storageError ? (
        <span role="alert" className="max-w-36 text-right text-[10px] text-red-700">
          {storageError}
        </span>
      ) : null}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
