import { getDish } from "@/app/menu/dishes";
import { jsonError } from "@/lib/http";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const dish = await getDish(id);
    if (!dish) {
      return jsonError("Dish not found", 404);
    }
    return Response.json(dish);
  } catch {
    return jsonError("Could not load dish", 500);
  }
}
