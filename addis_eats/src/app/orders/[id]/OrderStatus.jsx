"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { etb, when } from "@/lib/format";
import MapPanel from "./MapPanel";
import { getOrderStatusLabel } from "@/lib/orderStatus";

export default function OrderStatus({ id, initial }) {
  const [streamStatus, setStreamStatus] = useState(null);
  const [connection, setConnection] = useState("connecting");
  const [polling, setPolling] = useState(false);
  const { data, error, isValidating } = useSWR(
    id ? `/api/orders/${encodeURIComponent(id)}` : null,
    fetcher,
    { fallbackData: initial ?? undefined, refreshInterval: polling ? 5000 : 0 },
  );

  const order = data ?? initial;

  useEffect(() => {
    if (!id || ["delivered", "cancelled"].includes(initial?.status)) {
      return undefined;
    }
    const source = new EventSource(`/api/orders/${encodeURIComponent(id)}/stream`);
    source.onopen = () => {
      setConnection("live");
      setPolling(false);
    };
    source.onmessage = (event) => {
      try {
        const next = JSON.parse(event.data)?.status;
        if (typeof next !== "string") return;
        setStreamStatus(next);
        if (["delivered", "cancelled"].includes(next)) {
          source.close();
          setConnection("complete");
          setPolling(false);
        }
      } catch {
        source.close();
        setConnection("reconnecting");
        setPolling(true);
      }
    };
    source.onerror = () => {
      source.close();
      setStreamStatus(null);
      setConnection("reconnecting");
      setPolling(true);
    };
    return () => source.close();
  }, [id, initial?.status]);

  if (!order) {
    return <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading order…</p>;
  }

  const currentOrder = { ...order, status: streamStatus ?? order.status };
  const connectionState = ["delivered", "cancelled"].includes(currentOrder.status) ? "complete" : connection;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-bold text-slate-500">{order.id}</p>
            <p className="mt-1 text-sm text-slate-600">Placed <time dateTime={order.createdAt}>{when.format(new Date(order.createdAt))}</time></p>
          </div>
          <span aria-live="polite" className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${currentOrder.status === "cancelled" ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}>
            {getOrderStatusLabel(currentOrder.status)}
          </span>
        </div>
        <div className="border-t border-slate-100 pt-4 text-sm text-slate-600">
          <p>{order.name} · {order.phone}</p>
          <p className="mt-1">{order.address}, {order.neighborhood}, Addis Ababa</p>
          <p className="mt-1 capitalize">Payment: {order.paymentMethod}</p>
          {order.items.length ? <ul className="mt-4 space-y-1">{order.items.map((item) => <li key={item.id}>{item.quantity} × {item.name} — {etb.format(item.lineTotal)}</li>)}</ul> : null}
          <p className="mt-3 font-bold text-slate-900">Total: {etb.format(order.total)}</p>
        </div>
        <div role="status" className="flex items-center gap-2 text-xs text-slate-500">
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${connectionState === "live" ? "animate-pulse bg-emerald-500" : connectionState === "complete" ? "bg-slate-400" : "bg-amber-500"}`} />
          {connectionState === "live" ? "Live updates connected · demo status advances every five seconds" : connectionState === "reconnecting" ? "Connection interrupted · checking every five seconds" : connectionState === "complete" ? "Tracking complete" : "Connecting to live updates…"}
          {polling && isValidating ? <span className="sr-only">Refreshing order</span> : null}
          {error && polling ? <span className="text-red-600"> · Refresh unavailable</span> : null}
        </div>
      </div>
      <MapPanel neighborhood={order.neighborhood} address={order.address} status={currentOrder.status} />
    </div>
  );
}
