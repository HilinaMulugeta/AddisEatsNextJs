import Link from "next/link";
import MainNavigation from "./MainNavigation";

function BrandMark({ className = "h-10 w-10" }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-[#173b30] text-amber-300 shadow-sm ${className}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none" className="h-[68%] w-[68%]">
        <path d="M14 8.5c-2.1 2.1-2.1 4.2 0 6.3M21 6c-2.1 2.5-2.1 5 0 7.5M28 8.5c-2.1 2.1-2.1 4.2 0 6.3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M8 19h24c-.9 7.3-5.1 11-12 11S8.9 26.3 8 19Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M12 34h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function SiteFrame({ children }) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:h-16 sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-0">
          <Link href="/" prefetch={false} aria-label="Addis Eats home" className="flex items-center gap-2.5">
            <BrandMark className="h-10 w-10 rounded-[0.9rem]" />
            <span className="shrink-0 whitespace-nowrap text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">Addis Eats</span>
          </Link>
          <MainNavigation />
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">{children}</main>
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><BrandMark className="h-8 w-8 rounded-lg" /><span className="font-semibold text-white">Addis Eats</span><span>— Bole Road, Addis Ababa</span></div>
          <p className="text-xs text-slate-400">© 2026 Addis Eats.</p>
        </div>
      </footer>
    </>
  );
}
