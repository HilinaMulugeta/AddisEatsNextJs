"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "./actions";
import HeaderCartBadge from "./HeaderCartBadge";
import { useFavorites } from "./providers";

const authPaths = new Set(["/login", "/signup"]);

export default function MainNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(null);
  const triggerRef = useRef(null);
  const previousPathRef = useRef(null);
  const lastSessionCheckRef = useRef(null);
  const sessionRequestIdRef = useRef(0);
  const pathname = usePathname();
  const { favoriteIds } = useFavorites();

  useEffect(() => {
    const previousPath = previousPathRef.current;
    previousPathRef.current = pathname;
    const shouldCheckSession =
      lastSessionCheckRef.current === null ||
      authPaths.has(pathname) ||
      authPaths.has(previousPath);
    if (!shouldCheckSession) return;
    lastSessionCheckRef.current = pathname;

    const requestId = ++sessionRequestIdRef.current;
    fetch("/api/session", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Session lookup failed"))))
      .then(({ authenticated: isSignedIn }) => {
        if (requestId === sessionRequestIdRef.current) setAuthenticated(Boolean(isSignedIn));
      })
      .catch(() => {
        if (requestId === sessionRequestIdRef.current) setAuthenticated(false);
      });
  }, [pathname]);

  function closeOnEscape(event) {
    if (event.key !== "Escape" || !isOpen) return;
    event.preventDefault();
    setIsOpen(false);
    triggerRef.current?.focus();
  }
  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/cart", label: "Cart" },
    { href: "/favorites", label: `Favorites${favoriteIds.length ? ` (${favoriteIds.length})` : ""}` },
    ...(authenticated
      ? [
          { href: "/orders", label: "Orders" },
          { href: "/dashboard", label: "Dashboard" },
          { href: "/profile", label: "Profile" },
        ]
      : authenticated === false
        ? [
            { href: "/signup?next=%2Fcheckout", label: "Sign up", emphasized: true },
            { href: "/login?next=%2Fcheckout", label: "Sign in" },
          ]
        : []),
    { href: "/checkout", label: "Checkout", primary: true },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="main-navigation-links"
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 sm:hidden"
      >
        <span aria-hidden="true" className="flex w-5 flex-col gap-1">
          <span className={`h-0.5 w-full bg-current transition-transform ${isOpen ? "translate-y-1.5 rotate-45" : ""}`} />
          <span className={`h-0.5 w-full bg-current transition-opacity ${isOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-full bg-current transition-transform ${isOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
        </span>
      </button>
      <nav
        id="main-navigation-links"
        aria-label="Main navigation"
        onKeyDown={closeOnEscape}
        className={`${isOpen ? "grid" : "hidden"} absolute left-0 right-0 top-full z-50 grid-cols-1 gap-1.5 rounded-2xl border border-slate-200 bg-white p-3 text-center text-sm font-medium shadow-xl sm:static sm:z-auto sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-end sm:gap-2 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:text-sm sm:shadow-none lg:flex-nowrap lg:gap-4`}
      >
        {links.map(({ href, label, emphasized, primary }) => (
          <Link
            key={label}
            href={href}
            prefetch={false}
            onClick={() => setIsOpen(false)}
            className={`flex min-h-11 items-center justify-center rounded-lg px-3 transition-colors ${
              primary
                ? "col-span-full bg-amber-700 font-semibold text-white shadow-sm hover:bg-amber-800 sm:col-auto"
                : emphasized
                  ? "border border-amber-600 font-semibold text-amber-700 hover:bg-amber-50"
                  : "text-slate-700 hover:bg-slate-50 hover:text-amber-600 sm:px-2"
            }`}
          >
            {label === "Cart" ? (
              <>
                Cart <span className="ml-1"><HeaderCartBadge /></span>
              </>
            ) : (
              label
            )}
          </Link>
        ))}
        {authenticated ? (
          <form action={signOut} className="col-span-full sm:col-auto">
            <button
              type="submit"
              onClick={() => setIsOpen(false)}
              className="flex min-h-11 w-full items-center justify-center rounded-lg px-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-amber-700 sm:w-auto sm:px-2"
            >
              Sign out
            </button>
          </form>
        ) : null}
      </nav>
    </>
  );
}
