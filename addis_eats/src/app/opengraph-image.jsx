import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Kitfo, the Addis Eats home page hero dish";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const heroImage = await readFile(
    join(process.cwd(), "public", "images", "dishes", "Kitfo.jpg"),
  );
  const heroImageSrc = `data:image/jpeg;base64,${heroImage.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#13251f",
          color: "#fff",
        }}
      >
        <img
          src={heroImageSrc}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 48%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, rgba(10, 28, 22, 0.88) 0%, rgba(10, 28, 22, 0.62) 48%, rgba(10, 28, 22, 0.08) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "64px 72px",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#fde68a" }}>
            ADDIS EATS
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 690 }}>
            <div style={{ display: "flex", fontSize: 66, fontWeight: 800, lineHeight: 1.08 }}>
              Taste the soul
            </div>
            <div style={{ display: "flex", fontSize: 66, fontWeight: 500, fontStyle: "italic", color: "#fcd34d", lineHeight: 1.08 }}>
              of Addis Ababa.
            </div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 27, color: "#e2e8f0" }}>
              Ethiopian favorites made fresh in Addis Ababa
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#fde68a" }}>
            Doro Wot · Kitfo · Tibs
          </div>
        </div>
      </div>
    ),
    size,
  );
}
