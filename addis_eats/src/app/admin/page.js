import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { etb, when } from "@/lib/format";
import { getAdminOrderSummary, listRecentOrdersForAdmin } from "@/lib/orders";
import { getOrderStatusLabel } from "@/lib/orderStatus";

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
    <div className="container">
      <nav className="nav">
        <Link href="/" className="brand">Addis Eats</Link>
        <div className="nav-links">
          <span className="status-tag">Restricted operations · Admin</span>
          <Link href="/dashboard" className="secondary-btn">Customer dashboard</Link>
          <Link href="/profile" className="secondary-btn">Profile</Link>
        </div>
      </nav>

      <section className="page-shell">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Operations</p>
            <h1 className="text-3xl font-bold">Admin dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Signed in as {admin.email}</p>
          </div>
          <p className="text-sm text-slate-500">Showing the 30 most recent orders</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="All orders" value={summary.total} detail="Across customer accounts" />
          <SummaryCard label="In progress" value={activeCount} detail="Placed, prepared, or on the way" />
          <SummaryCard label="Delivered" value={summary.byStatus.delivered} detail="Completed demo deliveries" />
          <SummaryCard label="Order value" value={etb.format(summary.revenue)} detail="Excludes cancelled orders" />
        </div>

        <section className="detail-panel mt-8 overflow-hidden">
          <div className="panel-header">
            <div>
              <h2>Recent orders</h2>
              <p className="text-sm text-slate-500">Customer and delivery details for order operations.</p>
            </div>
          </div>
          {orders.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="px-3 py-3">Order</th><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Delivery area</th><th className="px-3 py-3">Placed</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Total</th></tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-3 py-4"><Link href={`/orders/${order.id}`} className="font-semibold text-orange-700 hover:underline">{order.id}</Link></td>
                      <td className="px-3 py-4"><div className="font-medium">{order.name}</div><div className="text-xs text-slate-500">{order.email} · {order.phone}</div></td>
                      <td className="px-3 py-4">{order.neighborhood}</td>
                      <td className="px-3 py-4">{when.format(new Date(order.createdAt))}</td>
                      <td className="px-3 py-4"><StatusBadge status={order.status} /></td>
                      <td className="px-3 py-4 text-right font-semibold">{etb.format(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="py-8 text-center text-sm text-slate-500">No orders have been placed yet.</p>}
        </section>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, detail }) {
  return <article className="detail-panel"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article>;
}

function StatusBadge({ status }) {
  return <span className={`order-status ${status}`}>{getOrderStatusLabel(status)}</span>;
}
