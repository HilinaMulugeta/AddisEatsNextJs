export default function OrdersLoading() {
  return <div aria-label="Loading orders" className="animate-pulse space-y-5">
    <div className="h-20 rounded-2xl bg-slate-200" />
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-12 rounded-lg bg-slate-100" />)}</div>
  </div>;
}
