"use client";

import { etb, day } from "@/lib/format";

export function RevenueChart({ data }) {
  const max = Math.max(1, ...data.map((row) => row.revenue));
  const width = 560;
  const rowHeight = 42;
  const height = Math.max(140, data.length * rowHeight + 28);
  return (
    <div className="h-[260px] w-full overflow-x-auto" role="img" aria-label={`Revenue by neighborhood, in Ethiopian birr: ${data.map((row) => `${row.area}, ${etb.format(row.revenue)}`).join("; ") || "no orders yet"}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full min-w-[440px] w-full" aria-hidden="true">
        <line x1="150" y1="8" x2="150" y2={height - 12} stroke="#cbd5e1" />
        {data.map((row, index) => {
          const y = 18 + index * rowHeight;
          const barWidth = (row.revenue / max) * 290;
          return <g key={row.area}>
            <text x="140" y={y + 16} textAnchor="end" fontSize="12" fill="#334155">{row.area.slice(0, 18)}</text>
            <rect x="151" y={y} width={barWidth} height="23" rx="5" fill="#b45309" />
            <text x={160 + barWidth} y={y + 16} fontSize="11" fontWeight="700" fill="#1e293b">{etb.format(row.revenue)}</text>
          </g>;
        })}
        {data.length === 0 ? <text x="280" y="76" textAnchor="middle" fontSize="13" fill="#64748b">Place an order to see area revenue</text> : null}
      </svg>
    </div>
  );
}

export function OrdersTrendChart({ data }) {
  const width = 560;
  const height = 240;
  const max = Math.max(1, ...data.map((row) => row.orders));
  const points = data.map((row, index) => ({
    ...row,
    x: 42 + index * ((width - 64) / Math.max(1, data.length - 1)),
    y: height - 38 - (row.orders / max) * (height - 76),
  }));
  return (
    <div className="h-[260px] w-full overflow-x-auto" role="img" aria-label={`Orders per day for the last ${data.length} days, in orders: ${data.map((row) => `${row.date}, ${row.orders}`).join("; ")}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full min-w-[440px] w-full" aria-hidden="true">
        <line x1="42" y1="18" x2="42" y2={height - 38} stroke="#94a3b8" />
        <line x1="42" y1={height - 38} x2={width - 12} y2={height - 38} stroke="#94a3b8" />
        <text x="6" y="26" fontSize="11" fill="#475569">Orders</text>
        <text x="42" y={height - 12} fontSize="11" fill="#475569">{data[0] ? day.format(new Date(`${data[0].date}T12:00:00Z`)) : ""}</text>
        <text x={width - 55} y={height - 12} fontSize="11" fill="#475569">{data.at(-1) ? day.format(new Date(`${data.at(-1).date}T12:00:00Z`)) : ""}</text>
        <polyline points={points.map(({ x, y }) => `${x},${y}`).join(" ")} fill="none" stroke="#173b30" strokeWidth="3" strokeLinejoin="round" />
        {points.filter((_, index) => index === points.length - 1 || index % 5 === 0).map((point) => <g key={point.date}>
          <circle cx={point.x} cy={point.y} r="4" fill="#b45309" />
          <text x={point.x} y={point.y - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e293b">{point.orders}</text>
        </g>)}
        {points.length === 0 ? <text x="280" y="110" textAnchor="middle" fontSize="13" fill="#64748b">No orders in this range</text> : null}
      </svg>
    </div>
  );
}
