import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-6 shadow-sm">
      <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center text-3xl font-bold">
        🍽️
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dish or Page Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          We couldn’t find the dish or page you were looking for. It may have been retired from the menu or the link might be mistyped.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/menu"
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition"
        >
          Browse Our Menu
        </Link>
        <Link
          href="/"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-xl transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
