"use client";

export default function CategoryBar({ categories, selected, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
      {categories.map((category) => {
        const isActive = selected === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            aria-pressed={isActive}
            className={`min-h-11 rounded-xl px-3 text-left text-xs font-semibold transition ${
              isActive
                ? "bg-amber-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
