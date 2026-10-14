import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getOrdersPageForUser, listOrdersForUser } from "@/lib/orders";
import { etb, when } from "@/lib/format";
import CancelOrderButton from "./CancelOrderButton";
import OrderExportButton from "./[id]/OrderExportButton";
import { getOrderStatusLabel } from "@/lib/orderStatus";

export const metadata = {
  title: "Your orders",
  description: "Privately review and manage Ethiopian food orders placed from your Addis Eats account.",
  robots: { index: false, follow: false },
};

function SortHeading({ label, field, sort, dir }) {
  const active = sort === field;
  const nextDir = active && dir === "asc" ? "desc" : "asc";
  const href = `/orders?sort=${field}&dir=${nextDir}&page=1`;
  return <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : undefined} className="px-4 py-3 text-left font-bold">
    <Link href={href} className="inline-flex min-h-11 items-center gap-1 hover:text-amber-800">{label}<span aria-hidden="true">{active ? (dir === "asc" ? "↑" : "↓") : "↕"}</span></Link>
  </th>;
}

export default async function OrdersPage({ searchParams }) {
  const user = await requireAuth("/orders");
  const params = await searchParams;
  const rawSort = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const sort = ["date", "total", "status"].includes(rawSort) ? rawSort : "date";
  const rawDir = Array.isArray(params.dir) ? params.dir[0] : params.dir;
  const dir = rawDir === "asc" ? "asc" : "desc";
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const requestedPage = /^\d+$/.test(rawPage ?? "") ? Number(rawPage) : 1;
  const result = await getOrdersPageForUser(user.id, { page: requestedPage, sort, dir });
  const exportOrders = (await listOrdersForUser(user.id)).map((order) => ({
    id: order.id,
    createdAt: order.createdAt,
    status: order.status,
    items: order.items,
    total: order.total,
  }));
  const pageHref = (page) => `/orders?page=${page}&sort=${sort}&dir=${dir}`;

  return <div className="space-y-7">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Your account</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Your orders</h1><p className="mt-2 text-sm text-slate-600">{result.total} {result.total === 1 ? "order" : "orders"} · sorted by {sort} ({dir === "asc" ? "ascending" : "descending"})</p></div>
      <OrderExportButton orders={exportOrders} />
      <Link href="/dashboard" className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white">Dashboard</Link>
    </header>

    {result.total === 0 ? <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center sm:p-10">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-800">Nothing on the table yet</p><h2 className="mt-2 text-2xl font-bold text-slate-900">Your first order starts with a favorite.</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">Choose a dish from the menu and your order details and delivery status will appear here.</p><Link href="/menu" className="mt-5 inline-flex rounded-xl bg-amber-700 px-5 py-3 text-sm font-bold text-white hover:bg-amber-800">Browse the menu</Link>
    </section> : <>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[850px] text-left text-xs">
          <caption className="sr-only">Your orders, 10 per page. Activate column headings to sort.</caption>
          <thead className="bg-slate-50 text-slate-600"><tr><th scope="col" className="px-4 py-3 font-bold">Order</th><SortHeading label="Date" field="date" sort={sort} dir={dir} /><SortHeading label="Total" field="total" sort={sort} dir={dir} /><SortHeading label="Status" field="status" sort={sort} dir={dir} /><th scope="col" className="px-4 py-3 text-right font-bold">Manage</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{result.rows.map((order) => <tr key={order.id} className="align-top hover:bg-amber-50/30">
            <th scope="row" className="px-4 py-4 text-left font-normal"><Link href={`/orders/${order.id}`} className="inline-flex min-h-11 items-center font-mono font-bold text-amber-800 hover:underline">{order.id.slice(0, 13)}</Link><p className="mt-1 max-w-[280px] text-slate-500">{order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</p></th>
            <td className="whitespace-nowrap px-4 py-4 tabular-nums text-slate-600">{when.format(new Date(order.createdAt))}</td>
            <td className="whitespace-nowrap px-4 py-4 text-right tabular-nums font-bold text-slate-900">{etb.format(order.total)}</td>
            <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 font-semibold ${order.status === "cancelled" ? "bg-slate-100 text-slate-600" : order.status === "delivered" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{getOrderStatusLabel(order.status)}</span></td>
            <td className="px-4 py-4 text-right">{order.status === "placed" ? <CancelOrderButton orderId={order.id} /> : <Link href={`/orders/${order.id}`} className="inline-flex min-h-11 items-center font-semibold text-amber-800 hover:underline">Track order</Link>}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <nav aria-label="Order pages" className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">Page {result.page} of {result.pages} · 10 orders per page</p>
        <div className="flex gap-2">{result.page > 1 ? <Link rel="prev" href={pageHref(result.page - 1)} className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">Previous</Link> : null}{result.page < result.pages ? <Link rel="next" href={pageHref(result.page + 1)} className="min-h-11 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Next</Link> : null}</div>
      </nav>
    </>}
  </div>;
}
