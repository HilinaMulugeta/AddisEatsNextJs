"use client";

import { useState } from "react";
import CategoryBar from "./CategoryBar";

export default function FilterShell({ categories, children }) {
  const [selected, setSelected] = useState("All");

  return (
    <div className="space-y-6">
      <CategoryBar categories={categories} selected={selected} onSelect={setSelected} />
      <div className="menu-filter" data-selected={selected}>
        {children}
      </div>
    </div>
  );
}
