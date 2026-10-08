export default function MenuLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
        <div className="h-4 w-96 bg-slate-200 rounded"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-44 w-full bg-slate-200"></div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-5 w-28 bg-slate-200 rounded"></div>
                <div className="h-5 w-16 bg-slate-200 rounded"></div>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded"></div>
              <div className="h-3 w-4/5 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
