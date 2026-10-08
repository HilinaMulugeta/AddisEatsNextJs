import { redirect } from "next/navigation";
import { getSessionId } from "./session";
import { getUserProfile } from "./user";

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
