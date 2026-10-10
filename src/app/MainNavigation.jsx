"use client";

import { useState } from "react";
import Link from "next/link";
import HeaderCartBadge from "./HeaderCartBadge";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
  { href: "/signup?next=%2Fcheckout", label: "Sign up", emphasized: true },
  { href: "/checkout", label: "Checkout", primary: true },
];

export default function MainNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
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
        className={`${isOpen ? "grid" : "hidden"} order-3 w-full grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-center text-xs font-medium sm:order-none sm:flex sm:w-auto sm:items-center sm:gap-4 sm:border-0 sm:pt-0 sm:text-sm`}
      >
        {links.map(({ href, label, emphasized, primary }) => (
          <Link
            key={label}
            href={href}
            prefetch={false}
            onClick={() => setIsOpen(false)}
            className={`flex min-h-11 items-center justify-center rounded-lg px-3 transition-colors ${
              primary
                ? "bg-amber-600 font-semibold text-white shadow-sm hover:bg-amber-700"
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
      </nav>
    </>
  );
}
