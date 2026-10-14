import { notFound, redirect } from "next/navigation";
import { getSessionId } from "./session";
import { getUserProfile } from "./user";
import { isAdminEmail } from "./admin.js";

export async function getAuthenticatedUser() {
  const sessionId = await getSessionId();
  if (!sessionId) return null;
  return getUserProfile(sessionId);
}

export async function requireAuth(next = "/checkout") {
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireAdmin() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?next=%2Fadmin");
  if (!isAdminEmail(user.email)) notFound();
  return user;
}
