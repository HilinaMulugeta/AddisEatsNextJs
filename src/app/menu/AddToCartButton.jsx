"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../providers";

export default function AddToCartButton({ dish, available, showGoToCart = false }) {
  const { addItem, items, storageError } = useCart();
  const [announcement, setAnnouncement] = useState("");
  const quantity = items.find((item) => item.id === dish.id)?.quantity ?? 0;
  const hasCartLink = showGoToCart && quantity > 0;

  function handleAdd() {
    const saved = addItem(dish);
    setAnnouncement(
      saved
        ? `Added ${dish.name}. ${quantity + 1} in your cart.`
        : `Could not add ${dish.name} to your cart.`,
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${showGoToCart ? "items-stretch" : "items-end"}`}>
      {quantity > 0 ? (
        <span className={`text-[11px] font-semibold text-emerald-700 ${showGoToCart ? "text-left" : "text-right"}`}>
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
      {hasCartLink ? (
        <Link
          href="/cart"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-amber-700 px-4 text-xs font-semibold text-amber-800 transition hover:bg-amber-50"
        >
          Go to cart
        </Link>
      ) : null}
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
