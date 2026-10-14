"use client";

import Link from "next/link";
import { useFavorites } from "../providers";

export default function FavoriteListClient({ dishIds, children }) {
  const { favoriteIds, favoritesStorageError } = useFavorites();
  const favoriteCount = favoriteIds.filter((id) => dishIds.includes(id)).length;

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600" aria-live="polite">
        {favoriteCount} {favoriteCount === 1 ? "saved dish" : "saved dishes"} · saved in this browser
      </p>
      {favoritesStorageError ? (
        <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {favoritesStorageError}
        </p>
      ) : null}
      {favoriteCount ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      ) : (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center sm:p-10">
          <p className="text-4xl text-rose-500" aria-hidden="true">♡</p>
          <h2 className="mt-3 text-xl font-bold text-slate-900">No saved dishes yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Tap the heart on a dish to keep it here. Favorites stay in this browser and do not sync between devices.
          </p>
          <Link href="/menu" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-amber-700 px-5 text-sm font-bold text-white hover:bg-amber-800">
            Browse the menu
          </Link>
        </section>
      )}
    </div>
  );
}
