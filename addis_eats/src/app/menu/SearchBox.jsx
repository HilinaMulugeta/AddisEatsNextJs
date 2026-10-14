"use client";

export default function SearchBox({ value, onChange }) {
  return (
    <label className="block">
      <span className="sr-only">Search dishes</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search dishes, ingredients, or categories..."
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
      />
    </label>
  );
}
