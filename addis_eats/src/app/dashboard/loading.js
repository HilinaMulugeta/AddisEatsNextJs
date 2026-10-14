export default function DashboardLoading() {
  return <div aria-label="Loading dashboard" className="animate-pulse space-y-6">
    <div className="h-20 rounded-2xl bg-slate-200" />
    <div className="grid gap-4 sm:grid-cols-2"><div className="h-28 rounded-2xl bg-slate-200" /><div className="h-28 rounded-2xl bg-slate-200" /></div>
    <div className="grid gap-6 lg:grid-cols-2"><div className="h-[430px] rounded-2xl bg-slate-200" /><div className="h-[430px] rounded-2xl bg-slate-200" /></div>
  </div>;
}
