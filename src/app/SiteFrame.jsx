import Link from "next/link";
import MainNavigation from "./MainNavigation";

export function SiteFrame({ children }) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:h-16 sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-0">
          <Link href="/" prefetch={false} className="flex items-center gap-2 text-lg font-bold tracking-tight text-amber-700 sm:text-xl">
            <span className="text-2xl">🍲</span><span>Addis Eats</span>
          </Link>
          <MainNavigation />
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">{children}</main>
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><span className="text-lg">🍲</span><span className="font-semibold text-white">Addis Eats</span><span>— Bole Road, Addis Ababa</span></div>
          <p className="text-xs text-slate-400">© 2026 Addis Eats.</p>
        </div>
      </footer>
    </>
  );
}
