"use client";

import { useFavorites } from "../providers";

export default function FavoriteCard({ dishId, children }) {
  const { favoriteIds } = useFavorites();
  return favoriteIds.includes(dishId) ? children : null;
}
