import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getAuthenticatedUser();
  return Response.json(
    { authenticated: Boolean(user) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
