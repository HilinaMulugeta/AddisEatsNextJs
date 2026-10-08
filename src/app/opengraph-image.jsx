import { ImageResponse } from "next/og";

export const alt = "Addis Eats Ethiopian food delivery in Addis Ababa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "#fffaf0",
          background: "linear-gradient(135deg, #78350f 0%, #b45309 55%, #431407 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#fde68a" }}>
          ADDIS EATS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>
            A taste of Addis, delivered.
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#ffedd5" }}>
            Ethiopian favorites made fresh in Addis Ababa
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#fde68a" }}>
          Doro Wot · Kitfo · Tibs
        </div>
      </div>
    ),
    size,
  );
}
