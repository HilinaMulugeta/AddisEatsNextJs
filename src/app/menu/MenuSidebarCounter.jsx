"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MenuSidebarCounter() {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  const categories = [
    { name: "All Dishes", href: "/menu" },
    { name: "Kitfo Specialty", href: "/menu/kitfo" },
    { name: "Doro Wot", href: "/menu/doro" },
    { name: "Special Tibs", href: "/menu/tibs" },
    { name: "Chechebsa", href: "/menu/chechebsa" },
    { name: "Dulet", href: "/menu/dulet" },
    { name: "Addis Burger", href: "/menu/burger" },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-900">Layout State Test</span>
          <span className="text-xs font-mono font-extrabold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        <p className="text-[11px] text-amber-800 leading-tight">
          Click [+] to increment. Navigating between menu items will NOT reset this count.
        </p>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-1.5 px-3 rounded-xl text-xs shadow-sm transition"
        >
          Increment Counter ({count})
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Menu Quick Nav</h3>
        <nav className="flex flex-col space-y-1">
          {categories.map((cat) => {
            const isActive = pathname === cat.href;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                prefetch={false}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                  isActive ? "bg-amber-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{cat.name}</span>
                {isActive && <span className="text-[10px]">●</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
