"use client";

export default function DashboardError({ retry }) {
  return <section role="alert" className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center">
    <p className="text-xs font-bold uppercase tracking-widest text-red-700">Dashboard unavailable</p>
    <h1 className="mt-2 text-2xl font-bold text-slate-900">We couldn&apos;t load your order data.</h1>
    <p className="mt-2 text-sm text-slate-600">Your account is safe. Try again in a moment.</p>
    <button type="button" onClick={() => retry()} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">Try again</button>
  </section>;
}
