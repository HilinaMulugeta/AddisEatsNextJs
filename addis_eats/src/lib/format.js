export const etb = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});

export const when = new Intl.DateTimeFormat("en-ET", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Addis_Ababa",
});

export const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const relativeUnits = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
  ["second", 1],
];

export function relativeTime(value, now = Date.now()) {
  const seconds = (new Date(value).getTime() - now) / 1_000;
  if (!Number.isFinite(seconds)) return "Date unavailable";
  const [unit, size] = relativeUnits.find(([, unitSize]) => Math.abs(seconds) >= unitSize) ?? relativeUnits.at(-1);
  return relative.format(Math.round(seconds / size), unit);
}

export const day = new Intl.DateTimeFormat("en-ET", {
  dateStyle: "medium",
  timeZone: "Africa/Addis_Ababa",
});
