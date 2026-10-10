"use client";

export default function CategoryBar({ categories, selected, onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((category) => {
        const isActive = selected === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`min-h-11 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              isActive
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
