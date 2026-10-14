"use client";

import { useEffect } from "react";

export default function MenuError({ error, reset }) {
  useEffect(() => {
    console.error("Menu segment error captured:", error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto my-12 p-8 bg-red-50 border border-red-200 rounded-3xl text-center space-y-4">
      <div className="w-12 h-12 mx-auto bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl font-bold">
        ⚠️
      </div>
      <h2 className="text-xl font-bold text-red-900">Failed to Load Menu</h2>
      <p className="text-xs text-red-700 leading-relaxed">
        {error?.message || "An unexpected error occurred while fetching the Addis Eats menu items."}
      </p>
      <div className="pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
