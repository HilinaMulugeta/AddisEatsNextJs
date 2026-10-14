import { getOrderForUser } from "@/lib/orders";
import { getAuthenticatedUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export async function GET(_request, { params }) {
  const user = await getAuthenticatedUser();
  if (!user) return jsonError("Sign in required", 401);

  const { id } = await params;
  const order = await getOrderForUser(id, user.id);
  if (!order) {
    return jsonError("Order not found", 404);
  }

  return Response.json(order);
}
