import Link from "next/link";
import HeaderCartBadge from "./HeaderCartBadge";

export function SiteFrame({ children }) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" prefetch={false} className="flex items-center gap-2 text-xl font-bold text-amber-700 tracking-tight">
            <span className="text-2xl">🍲</span><span>Addis Eats</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" prefetch={false} className="hover:text-amber-600 transition-colors">Home</Link>
            <Link href="/menu" prefetch={false} className="hover:text-amber-600 transition-colors">Menu</Link>
            <Link href="/cart" prefetch={false} className="hover:text-amber-600 transition-colors flex items-center gap-1">Cart <HeaderCartBadge /></Link>
            <Link href="/orders" prefetch={false} className="hover:text-amber-600 transition-colors">Orders</Link>
            <Link href="/checkout" prefetch={false} className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all">Checkout</Link>
          </nav>
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
