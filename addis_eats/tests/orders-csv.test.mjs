import test from "node:test";
import assert from "node:assert/strict";
const { csvCell, ordersToCsv } = await import("../src/lib/ordersCsv.js");

test("CSV escapes commas, quotes, and embedded newlines", () => {
  assert.equal(csvCell("Bole, Kitfo"), '"Bole, Kitfo"');
  assert.equal(csvCell('Chef said "try it"'), '"Chef said ""try it"""');
  assert.equal(csvCell("Line one\nLine two"), '"Line one\nLine two"');
});

test("order history export keeps awkward values in one CSV row", () => {
  const csv = ordersToCsv([{ orderId: "ord_1", placedAt: "13 Oct 2026, 18:40", status: "placed", items: '1 x Bole, Kitfo; 2 x "Chef\'s special"', total: "ETB 1,200" }]);
  assert.equal(csv.split("\r\n").length, 2);
  assert.match(csv, /"13 Oct 2026, 18:40"/);
  assert.match(csv, /"1 x Bole, Kitfo; 2 x ""Chef's special"""/);
  assert.match(csv, /"ETB 1,200"/);
});
