import { getCategories, getDishPage } from "@/app/menu/dishes";
import { jsonError } from "@/lib/http";

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const query = params.get("q") ?? "";
    const category = params.get("category") ?? "All";
    const page = Number(params.get("page") ?? 1);
    const limit = Math.min(20, Math.max(1, Math.floor(Number(params.get("limit") ?? 4) || 4)));
    const categories = await getCategories();

    if (!categories.includes(category)) {
      return jsonError("Unknown dish category", 400);
    }

    return Response.json(await getDishPage({ query, category, page, limit }));
  } catch {
    return jsonError("Could not load dishes", 500);
  }
}
