"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import DishList from "./DishList";
import CategoryBar from "./CategoryBar";
import SearchBox from "./SearchBox";
import MenuSidebarCounter from "./MenuSidebarCounter";
import { fetcher } from "@/lib/fetcher";

const PAGE_SIZE = 4;

function makeKey(query, category, page) {
  const params = new URLSearchParams({ q: query, category, page: String(page), limit: String(PAGE_SIZE) });
  return `/api/dishes?${params.toString()}`;
}

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function MenuExplorer({ categories, initialPage, initialQuery, initialCategory }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(initialPage.page);
  const debouncedTerm = useDebouncedValue(term, 300);
  const effectiveTerm = debouncedTerm.trim();
  const usesInitialServerPage =
    initialQuery.trim() === "" &&
    effectiveTerm === "" &&
    category === "All" &&
    page === 1;
  const key = usesInitialServerPage ? null : makeKey(effectiveTerm, category, page);
  const initialKey = makeKey(initialQuery.trim(), initialCategory, initialPage.page);
  const [result, setResult] = useState({ key: initialKey, data: initialPage, error: null });

  useEffect(() => {
    if (!key || key === initialKey) return;

    const controller = new AbortController();
    fetcher(key, { signal: controller.signal })
      .then((data) => setResult({ key, data, error: null }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        setResult((current) => current.key === key ? { ...current, error } : current);
      });
    return () => controller.abort();
  }, [key, initialKey, initialPage]);

  const data = key === initialKey ? initialPage : result.data;
  const error = key === initialKey ? null : result.key === key ? result.error : null;
  const isValidating = Boolean(key) && key !== initialKey && result.key !== key;
  const isLoading = isValidating && !data;

  const visiblePage = usesInitialServerPage ? initialPage : data ?? initialPage;
  const url = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (effectiveTerm) params.set("q", effectiveTerm);
    else params.delete("q");
    if (category !== "All") params.set("category", category);
    else params.delete("category");
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [category, effectiveTerm, page, pathname, searchParams]);

  useEffect(() => {
    const currentParams = searchParams.toString();
    const current = currentParams ? `${pathname}?${currentParams}` : pathname;
    if (current !== url) window.history.replaceState(null, "", url);
  }, [pathname, searchParams, url]);

  function chooseCategory(nextCategory) {
    setCategory(nextCategory);
    setPage(1);
  }

  function changePage(nextPage) {
    setPage(Math.min(Math.max(1, nextPage), visiblePage.totalPages));
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <section aria-labelledby="menu-categories-heading" className="order-1 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-start-1 lg:row-start-1">
        <h2 id="menu-categories-heading" className="mb-3 text-sm font-bold text-slate-900">
          Categories
        </h2>
        <CategoryBar categories={categories} selected={category} onSelect={chooseCategory} />
      </section>

      <div className="order-2 min-w-0 space-y-5 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <SearchBox
          value={term}
          onChange={(nextTerm) => {
            setTerm(nextTerm);
            setPage(1);
          }}
        />

        <div aria-live="polite" className="space-y-4">
          <div className="flex min-h-5 items-center justify-between text-xs text-slate-500">
            <span>{visiblePage.total} {visiblePage.total === 1 ? "dish" : "dishes"}</span>
            <span>{isValidating ? "Updating results…" : ""}</span>
          </div>
          {error ? (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Could not load dishes: {error.message}
            </p>
          ) : isLoading && !data ? (
            <p role="status" className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading dishes…</p>
          ) : (
            <DishList dishes={visiblePage.items} />
          )}
        </div>

        {visiblePage.totalPages > 1 ? (
          <nav aria-label="Menu pages" className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => changePage(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-slate-600">Page {page} of {visiblePage.totalPages}</span>
            <button
              type="button"
              onClick={() => changePage(page + 1)}
              disabled={page >= visiblePage.totalPages}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        ) : null}
      </div>

      <aside aria-label="Cart summary" className="order-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:col-start-1 lg:row-start-2">
        <MenuSidebarCounter />
      </aside>
    </div>
  );
}
