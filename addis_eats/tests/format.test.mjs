import assert from "node:assert/strict";
import test from "node:test";
import { day, etb, relative, relativeTime, when } from "../src/lib/format.js";

test("shared currency and date formatters use Ethiopian locale and Addis time", () => {
  assert.match(etb.format(14200), /14,200/);
  assert.equal(etb.resolvedOptions().currency, "ETB");
  assert.equal(when.resolvedOptions().timeZone, "Africa/Addis_Ababa");
  assert.equal(day.resolvedOptions().timeZone, "Africa/Addis_Ababa");
});

test("relative order times use the single shared relative formatter", () => {
  const now = Date.parse("2026-10-13T12:00:00Z");
  assert.equal(relativeTime("2026-10-13T11:48:00Z", now), relative.format(-12, "minute"));
  assert.equal(relativeTime("not a date", now), "Date unavailable");
});
