import { ImageResponse } from "next/og";
import { getDish } from "../dishes";
import { etb } from "@/lib/format";

export const alt = "Ethiopian menu item from Addis Eats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function DishOpenGraphImage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return new Response("Dish not found", { status: 404 });
  }

  const description =
    dish.description.length > 110
      ? `${dish.description.slice(0, 107).trimEnd()}...`
      : dish.description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px",
          color: "#1c1917",
          background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 58%, #fed7aa 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#92400e" }}>
          ADDIS EATS · ETHIOPIAN KITCHEN
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: dish.name.length > 22 ? 62 : 78, fontWeight: 800 }}>
            {dish.name}
          </div>
          <div style={{ display: "flex", fontSize: 28, lineHeight: 1.3, color: "#57534e" }}>
            {description}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#b45309" }}>
            {etb.format(dish.price)}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#78716c" }}>
            Freshly prepared in Addis Ababa
          </div>
        </div>
      </div>
    ),
    size,
  );
}
