import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { etb } from "@/lib/format";
import { getAdminOrderSummary, listRecentOrdersForAdmin } from "@/lib/orders";
import AdminOrdersTable from "./AdminOrdersTable";
import AdminCharts from "./AdminCharts";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin dashboard",
  description: "Private Addis Eats order operations dashboard.",
  robots: { index: false, follow: false },
};

const activeStatuses = new Set(["placed", "prepared", "on_the_way"]);

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const [summary, orders] = await Promise.all([
    getAdminOrderSummary(),
    listRecentOrdersForAdmin(30),
  ]);
  const activeCount = [...activeStatuses].reduce((total, status) => total + summary.byStatus[status], 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900">Addis Eats <span className="ml-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">Admin</span></Link>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="/dashboard" className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50">Customer dashboard</Link>
            <Link href="/profile" className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50">Profile</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">Order operations</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Admin dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Signed in as {admin.email}</p>
          </div>
          <p className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600">Latest {orders.length} orders</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Order overview">
          <SummaryCard label="All orders" value={summary.total} detail="Across customer accounts" accent="orange" />
          <SummaryCard label="In progress" value={activeCount} detail="Placed, prepared, or on the way" accent="blue" />
          <SummaryCard label="Delivered" value={summary.byStatus.delivered} detail="Completed demo deliveries" accent="green" />
          <SummaryCard label="Order value" value={etb.format(summary.revenue)} detail="Excludes cancelled orders" accent="violet" />
        </section>

        <AdminCharts summary={summary} orders={orders} />

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" aria-labelledby="recent-orders-heading">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 px-4 py-5 sm:px-6">
            <div><h2 id="recent-orders-heading" className="text-lg font-bold text-slate-900">Recent orders</h2><p className="mt-1 text-sm text-slate-500">Select an order to see its delivery and item details here.</p></div>
            <span className="text-xs font-medium text-slate-500">Newest first · maximum 30</span>
          </div>
          {orders.length > 0 && <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,.8fr)_minmax(0,.8fr)_auto] gap-4 bg-slate-50 px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 sm:grid"><span>Order and customer</span><span>Delivery area</span><span>Placed</span><span>Status</span><span className="text-right">Total</span></div>}
          <AdminOrdersTable orders={orders} />
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ label, value, detail, accent }) {
  const tones = {
    orange: "bg-orange-50 text-orange-800",
    blue: "bg-blue-50 text-blue-800",
    green: "bg-emerald-50 text-emerald-800",
    violet: "bg-violet-50 text-violet-800",
  };
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${tones[accent]}`}>{label}</span><p className="mt-4 text-3xl font-extrabold tabular-nums text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article>;
}

