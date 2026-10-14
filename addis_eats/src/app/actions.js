"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/constants";
import { cancelOwnedOrder, createOrder } from "@/lib/orders";
import { cartItemsSchema, orderSchema } from "@/lib/orderSchema";
import { resolveOrderItems } from "@/lib/orderItems";
import { getSafeRedirectPath } from "@/lib/redirects";
import {
  createSessionToken,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  createUser,
  signInSchema,
  signUpSchema,
  verifyUserCredentials,
} from "@/lib/user";

const emptyPlace = { fieldErrors: {}, id: null, error: null };

async function setSession(userId) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function signIn(_prevState, formData) {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Email or password is incorrect." };
  }

  const user = await verifyUserCredentials(parsed.data.email, parsed.data.password);
  if (!user) return { error: "Email or password is incorrect." };

  await setSession(user.id);

  revalidatePath("/orders");
  redirect(getSafeRedirectPath(String(formData.get("next") ?? "")));
}

export async function signUp(_prevState, formData) {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: null,
    };
  }

  const user = await createUser(parsed.data);
  if (!user) {
    return {
      fieldErrors: { email: ["An account with this email already exists."] },
      error: null,
    };
  }

  await setSession(user.id);
  revalidatePath("/orders");
  redirect(getSafeRedirectPath(String(formData.get("next") ?? "")));
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  revalidatePath("/orders");
  redirect("/login");
}

export async function placeOrder(_prevState, formData) {
  const idempotencyKey = String(formData.get("idempotencyKey") ?? "");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
    return { ...emptyPlace, error: "Your checkout has expired. Refresh the page and try again." };
  }

  const parsed = orderSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    neighborhood: formData.get("neighborhood"),
    paymentMethod: formData.get("paymentMethod"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      id: null,
      error: null,
    };
  }

  let submittedItems;
  try {
    submittedItems = JSON.parse(String(formData.get("items") ?? ""));
  } catch {
    return {
      ...emptyPlace,
      error: "Your cart is empty or invalid. Add a dish from the menu before checking out.",
    };
  }

  const parsedItems = cartItemsSchema.safeParse(submittedItems);
  if (!parsedItems.success) {
    return {
      ...emptyPlace,
      error: "Your cart is empty or invalid. Add a dish from the menu before checking out.",
    };
  }
  const pricedItems = await resolveOrderItems(parsedItems.data);
  if (!pricedItems) {
    return {
      ...emptyPlace,
      error: "A dish in your cart is unavailable. Review your cart and try again.",
    };
  }

  const customer = await getAuthenticatedUser();
  if (!customer) {
    return { ...emptyPlace, error: "Your session expired. Sign in again to place an order." };
  }

  const order = await createOrder({
    ...parsed.data,
    ...pricedItems,
    email: customer.email,
    userId: customer.id,
    idempotencyKey,
  });
  revalidatePath("/orders");
  revalidatePath(`/orders/${order.id}`);
  revalidatePath("/checkout");
  return { fieldErrors: {}, id: order.id, total: order.total, error: null };
}

export async function cancelOrder(_prevState, formData) {
  const orderId = String(formData.get("orderId") ?? "");
  const user = await getAuthenticatedUser();
  if (!user) {
    return { error: "Your session expired. Sign in again to cancel this order." };
  }
  const result = await cancelOwnedOrder(orderId, user.id);

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/orders");
  return { error: null, id: result.order.id };
}
