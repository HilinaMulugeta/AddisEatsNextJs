import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getOrderDashboardSummary } from "@/lib/orders";
import { OrdersTrendChart, RevenueChart } from "./DashboardCharts";
import { etb } from "@/lib/format";

export const metadata = {
  title: "Order dashboard",
  description: "Review your Addis Eats order totals and recent activity.",
  robots: { index: false, follow: false },
};

function DataTable({ caption, headers, rows }) {
  return <div className="overflow-x-auto rounded-xl border border-slate-200">
    <table className="w-full min-w-[420px] text-left text-xs">
      <caption className="sr-only">{caption}</caption>
      <thead className="bg-slate-50 text-slate-600"><tr>{headers.map((header) => <th key={header} scope="col" className="px-4 py-3 font-bold">{header}</th>)}</tr></thead>
      <tbody className="divide-y divide-slate-100">{rows.length ? rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={`px-4 py-3 ${index > 0 ? "text-right tabular-nums" : ""}`}>{cell}</td>)}</tr>) : <tr><td className="px-4 py-5 text-slate-500" colSpan={headers.length}>No orders in this period yet.</td></tr>}</tbody>
    </table>
  </div>;
}

export default async function DashboardPage() {
  const user = await requireAuth("/dashboard");
  const summary = await getOrderDashboardSummary(user.id);
  const revenueRows = summary.byNeighborhood.map((row) => [row.area, etb(row.revenue)]);
  const trendRows = summary.byDay.map((row) => [row.date, `${row.orders} ${row.orders === 1 ? "order" : "orders"}`]);

  return <div className="space-y-8">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Your account</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Order dashboard</h1><p className="mt-2 text-sm text-slate-600">A clear view of your Addis Eats activity for the last {summary.days} days.</p></div>
      <Link href="/orders" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white">View all orders</Link>
    </header>

    {summary.orderCount === 0 ? <section className="rounded-3xl border border-amber-200 bg-amber-50 p-7 sm:p-9" aria-labelledby="welcome-heading">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-800">A fresh start</p><h2 id="welcome-heading" className="mt-2 text-2xl font-bold text-slate-900">Your first meal is one menu away.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Your order activity will appear here, including daily orders and delivery-area totals.</p><Link href="/menu" className="mt-5 inline-flex rounded-xl bg-amber-700 px-5 py-3 text-sm font-bold text-white hover:bg-amber-800">Explore the menu</Link>
    </section> : <>
      <section className="grid gap-4 sm:grid-cols-2" aria-label="Order summary">
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm font-medium text-slate-500">Total revenue</p><p className="mt-2 text-3xl font-extrabold tabular-nums text-slate-900">{etb(summary.revenue)}</p><p className="mt-1 text-xs text-slate-500">Across {summary.orderCount} completed or active {summary.orderCount === 1 ? "order" : "orders"}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm font-medium text-slate-500">Orders in the last {summary.days} days</p><p className="mt-2 text-3xl font-extrabold tabular-nums text-slate-900">{summary.byDay.reduce((sum, row) => sum + row.orders, 0)}</p><p className="mt-1 text-xs text-slate-500">Cancelled orders are excluded from totals.</p></div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div><h2 className="text-lg font-bold text-slate-900">Revenue by neighborhood</h2><p className="mt-1 text-xs text-slate-500">Revenue in ETB · all active orders</p></div><RevenueChart data={summary.byNeighborhood} /><DataTable caption="Revenue by neighborhood in Ethiopian birr" headers={["Neighborhood", "Revenue (ETB)"]} rows={revenueRows} /></article>
        <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div><h2 className="text-lg font-bold text-slate-900">Orders over time</h2><p className="mt-1 text-xs text-slate-500">Orders per day · last {summary.days} days</p></div><OrdersTrendChart data={summary.byDay} /><DataTable caption={`Daily order counts for the last ${summary.days} days`} headers={["Date", "Orders"]} rows={trendRows} /></article>
      </section>
    </>}
  </div>;
}
