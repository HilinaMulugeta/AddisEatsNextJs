import { createOrder, listOrdersForUser } from "@/lib/orders";
import { cartItemsSchema, orderSchema } from "@/lib/orderSchema";
import { resolveOrderItems } from "@/lib/orderItems";
import { jsonError } from "@/lib/http";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return jsonError("Sign in required", 401);

  return Response.json(await listOrdersForUser(user.id));
}

export async function POST(request) {
  const customer = await getAuthenticatedUser();
  if (!customer) return jsonError("Sign in required", 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const result = orderSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { fieldErrors: result.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const parsedItems = cartItemsSchema.safeParse(body.items);
  if (!parsedItems.success) {
    return Response.json(
      { fieldErrors: { items: parsedItems.error.flatten().formErrors } },
      { status: 422 },
    );
  }
  const pricedItems = await resolveOrderItems(parsedItems.data);
  if (!pricedItems) return jsonError("A dish is unavailable", 422);

  const order = await createOrder({
    ...result.data,
    ...pricedItems,
    email: customer.email,
    userId: customer.id,
  });

  return Response.json(order, { status: 201 });
}
