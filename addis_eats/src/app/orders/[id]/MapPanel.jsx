"use client";

import dynamic from "next/dynamic";

const MAP_HEIGHT = "h-[340px]";
const DeliveryMap = dynamic(() => import("./TrackingMap"), {
  ssr: false,
  loading: () => <div aria-label="Loading delivery map" className={`${MAP_HEIGHT} animate-pulse rounded-2xl bg-slate-200`} />,
});

export default function MapPanel({ neighborhood, address, status }) {
  return (
    <section className="space-y-3" aria-labelledby="delivery-map-heading">
      <div>
        <h2 id="delivery-map-heading" className="text-lg font-bold text-slate-900">Delivery map</h2>
        <p className="mt-1 text-sm text-slate-600">A route preview around {neighborhood}, Addis Ababa.</p>
      </div>
      <DeliveryMap neighborhood={neighborhood} status={status} />
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600" aria-label="Map marker legend">
        <li className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-emerald-700 ring-2 ring-emerald-100" />Courier estimate</li>
        <li className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-amber-700 ring-2 ring-amber-100" />Delivery area</li>
      </ul>
      <p className="text-sm leading-6 text-slate-600"><span className="font-semibold text-slate-900">Delivery address:</span> {address}, {neighborhood}, Addis Ababa. Courier position is a demo estimate; live GPS is not connected.</p>
    </section>
  );
}
