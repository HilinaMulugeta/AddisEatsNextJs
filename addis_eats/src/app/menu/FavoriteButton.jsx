"use client";

import { useFavorites } from "../providers";

export default function FavoriteButton({ dishId, dishName }) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.includes(dishId);

  return (
    <button
      type="button"
      aria-label={`${isFavorite ? "Remove" : "Add"} ${dishName} ${isFavorite ? "from" : "to"} favorites`}
      aria-pressed={isFavorite}
      onClick={() => toggleFavorite(dishId)}
      className="absolute left-3 top-3 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/95 text-2xl leading-none text-rose-600 shadow-md transition hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
    >
      <span aria-hidden="true">{isFavorite ? "♥" : "♡"}</span>
    </button>
  );
}
