import { etb } from "@/lib/format";

const statusLabels = {
  placed: "Placed",
  prepared: "Preparing",
  on_the_way: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const statusColors = {
  placed: "bg-sky-500",
  prepared: "bg-amber-500",
  on_the_way: "bg-violet-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-slate-300",
};

export default function AdminCharts({ summary, orders }) {
  const statuses = Object.entries(statusLabels).map(([key, label]) => ({
    key,
    label,
    count: Number(summary.byStatus[key] ?? 0),
  }));
  const maxStatus = Math.max(1, ...statuses.map((row) => row.count));

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Addis_Ababa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayKey = formatter.format(new Date());
  const activity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = formatter.format(date);
    return {
      key,
      label: key === todayKey ? "Today" : new Intl.DateTimeFormat("en", { timeZone: "Africa/Addis_Ababa", weekday: "short" }).format(date),
      count: orders.filter((order) => formatter.format(new Date(order.createdAt)) === key).length,
    };
  });
  const maxActivity = Math.max(1, ...activity.map((item) => item.count));

  const areas = new Map();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    const area = order.neighborhood || "Other";
    areas.set(area, (areas.get(area) ?? 0) + Number(order.total || 0));
  }
  const revenueAreas = [...areas].map(([area, revenue]) => ({ area, revenue }))
    .sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const maxAreaRevenue = Math.max(1, ...revenueAreas.map((item) => item.revenue));

  return (
    <section className="grid gap-5 lg:grid-cols-2" aria-label="Order charts">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="font-bold text-slate-900">Orders by status</h2><p className="mt-1 text-xs text-slate-500">All orders in the database</p></div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{summary.total} total</span>
        </div>
        <div className="mt-6 space-y-4">
          {statuses.map((item) => (
            <div key={item.key}>
              <div className="mb-1.5 flex justify-between gap-3 text-sm"><span className="font-medium text-slate-700">{item.label}</span><span className="tabular-nums font-semibold text-slate-900">{item.count}</span></div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${item.label} orders`} aria-valuemin={0} aria-valuemax={maxStatus} aria-valuenow={item.count}>
                <div className={`h-full rounded-full ${statusColors[item.key]}`} style={{ width: `${(item.count / maxStatus) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="font-bold text-slate-900">Daily order activity</h2><p className="mt-1 text-xs text-slate-500">Last 7 days · from latest 30 orders</p></div>
          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-800">Recent</span>
        </div>
        <div className="mt-6 flex h-40 items-end justify-between gap-2 border-b border-slate-200 px-1" role="img" aria-label="Bar chart showing daily order activity for the last seven days">
          {activity.map((item) => (
            <div key={item.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <span className="text-xs font-semibold tabular-nums text-slate-600">{item.count || ""}</span>
              <div className="flex h-[72%] w-full items-end justify-center">
                <div className="w-full max-w-7 rounded-t-md bg-orange-500 transition-[height]" style={{ height: `${item.count ? Math.max(10, (item.count / maxActivity) * 100) : 3}%` }} title={`${item.count} orders`} />
              </div>
              <span className="text-[11px] text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">Counts use the most recent 30 orders shown below.</p>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="font-bold text-slate-900">Revenue by delivery area</h2><p className="mt-1 text-xs text-slate-500">Non-cancelled orders · latest 30 orders</p></div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">Top areas</span>
        </div>
        {revenueAreas.length ? (
          <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {revenueAreas.map((item) => (
              <div key={item.area}>
                <div className="mb-1.5 flex justify-between gap-3 text-sm"><span className="truncate font-medium text-slate-700">{item.area}</span><span className="shrink-0 font-semibold tabular-nums text-slate-900">{etb.format(item.revenue)}</span></div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${(item.revenue / maxAreaRevenue) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        ) : <p className="mt-5 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">Area revenue will appear after orders are placed.</p>}
      </article>
    </section>
  );
}

