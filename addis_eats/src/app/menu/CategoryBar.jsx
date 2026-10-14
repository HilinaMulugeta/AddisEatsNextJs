"use client";

export default function CategoryBar({ categories, selected, onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none lg:flex-col lg:items-stretch lg:overflow-visible lg:pb-0">
      {categories.map((category) => {
        const isActive = selected === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition lg:w-full lg:py-3 lg:text-left ${
              isActive
                ? "bg-amber-700 text-white shadow-sm"
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
