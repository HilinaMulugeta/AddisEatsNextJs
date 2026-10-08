import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "./lib/constants";

const protectedPaths = ["/profile", "/orders", "/checkout"];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/orders/:path*", "/checkout/:path*"],
};
