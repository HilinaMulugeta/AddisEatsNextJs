"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useCart } from "../providers";
import CheckoutTotal from "./CheckoutTotal";
import { dishes } from "../menu/dishes";
import { orderSchema, cartItemsSchema } from "@/lib/orderSchema";
import { DELIVERY_FEE_ETB } from "@/lib/constants";
import { parseOrders, writeOrders } from "@/lib/localOrders";
import { useAccount } from "../useAccount";

const DRAFT_KEY = "addis-eats-checkout-draft";
const DRAFT_CHANGED_EVENT = "addis-eats-checkout-draft-change";
const STORAGE_READ_ERROR = "__storage-read-error__";
const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  address: "",
  paymentMethod: "telebirr",
};

function subscribeToDraft(callback) {
  window.addEventListener(DRAFT_CHANGED_EVENT, callback);
  return () => window.removeEventListener(DRAFT_CHANGED_EVENT, callback);
}

function getDraftSnapshot(key) {
  try {
    return window.sessionStorage.getItem(key) || "";
  } catch {
    return STORAGE_READ_ERROR;
  }
}

function getServerDraftSnapshot() {
  return "";
}

function FieldError({ messages }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] font-medium text-red-600">{messages[0]}</p>;
}

export default function CheckoutForm() {
  const account = useAccount();
  const draftKey = `${DRAFT_KEY}:${account?.id || "signed-out"}`;
  const draftSnapshot = useSyncExternalStore(
    subscribeToDraft,
    () => getDraftSnapshot(draftKey),
    getServerDraftSnapshot,
  );
  const draftState = useMemo(() => {
    if (draftSnapshot === STORAGE_READ_ERROR) {
      return {
        values: EMPTY_FORM,
        notice: "Checkout details could not be restored from this tab.",
      };
    }
    try {
      return {
        values: draftSnapshot
          ? { ...EMPTY_FORM, ...JSON.parse(draftSnapshot) }
          : EMPTY_FORM,
        notice: null,
      };
    } catch {
      return {
        values: EMPTY_FORM,
        notice: "The saved checkout draft has an invalid format.",
      };
    }
  }, [draftSnapshot]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [storageNotice, setStorageNotice] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);
  const { items, clearCart, storageError } = useCart();
  const formValues = useMemo(
    () =>
      draftSnapshot
        ? draftState.values
        : {
            ...EMPTY_FORM,
            name: account?.name || "",
            email: account?.email || "",
          },
    [account, draftSnapshot, draftState.values],
  );

  const updateField = (event) => {
    const { name, value } = event.target;
    try {
      window.sessionStorage.setItem(
        draftKey,
        JSON.stringify({ ...formValues, [name]: value }),
      );
      window.dispatchEvent(new Event(DRAFT_CHANGED_EVENT));
      setStorageNotice(null);
    } catch {
      setStorageNotice(
        "Checkout details cannot be saved in this tab, but you can still place the order.",
      );
    }
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    const parsed = orderSchema.safeParse(formValues);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    const parsedItems = cartItemsSchema.safeParse(
      items.map(({ id, quantity }) => ({ id, quantity })),
    );
    if (!parsedItems.success) {
      setError(
        "Your cart is empty or invalid. Add a dish from the menu before checking out.",
      );
      return;
    }

    const orderItems = parsedItems.data.map(({ id, quantity }) => {
      const dish = dishes.find((entry) => entry.id === id);
      if (!dish || !dish.availableToday) return null;
      return {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        quantity,
        lineTotal: dish.price * quantity,
      };
    });
    if (orderItems.some((item) => !item)) {
      setError(
        "A dish in your cart is unavailable. Review your cart and try again.",
      );
      return;
    }

    const orderSubtotal = orderItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0,
    );
    const order = {
      id: `ord_${crypto.randomUUID()}`,
      userId: account.id,
      ...parsed.data,
      items: orderItems,
      subtotal: orderSubtotal,
      deliveryFee: DELIVERY_FEE_ETB,
      total: orderSubtotal + DELIVERY_FEE_ETB,
      status: "placed",
      createdAt: new Date().toISOString(),
    };

    try {
      const savedOrders = parseOrders(
        window.localStorage.getItem("addis-eats-orders") || "[]",
      );
      writeOrders([order, ...savedOrders]);
      setPlacedOrder(order);
    } catch {
      setError(
        "Your order could not be saved in this browser. Check browser storage and try again.",
      );
      return;
    }

    if (!clearCart()) {
      setStorageNotice(
        "Your order was placed, but the saved cart could not be cleared.",
      );
    }
    try {
      window.sessionStorage.removeItem(draftKey);
      window.dispatchEvent(new Event(DRAFT_CHANGED_EVENT));
    } catch {
      setStorageNotice(
        "The saved checkout draft could not be removed from this tab.",
      );
    }
  };

  if (placedOrder) {
    return (
      <div className="space-y-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
        <h2 className="text-lg font-extrabold text-emerald-900">
          Order placed
        </h2>
        <p className="text-sm text-emerald-800">
          Order <span className="font-mono font-bold">{placedOrder.id}</span>{" "}
          has been added to your order history.
        </p>
        <p className="text-sm text-emerald-800">
          Order total: {placedOrder.total} ETB
        </p>
        <Link
          href={`/orders/${placedOrder.id}`}
          className="inline-block text-xs font-semibold text-amber-800 hover:underline"
        >
          Track this order →
        </Link>
      </div>
    );
  }

  if (items.length === 0 || storageError) {
    return (
      <div className="space-y-3 text-center">
        <p
          role={storageError ? "alert" : undefined}
          className="text-sm text-slate-600"
        >
          {storageError ||
            "Your cart is empty. Add a dish from the menu before checking out."}
        </p>
        <Link
          href="/menu"
          className="inline-block text-xs font-semibold text-amber-700 hover:underline"
        >
          Browse the menu →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {storageNotice || draftState.notice ? (
        <p role="status" className="text-xs text-amber-800">
          {storageNotice || draftState.notice}
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700" htmlFor="name">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          value={formValues.name}
          onChange={updateField}
          placeholder="e.g. Almaz Bekele"
          autoComplete="name"
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <FieldError messages={fieldErrors.name} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={updateField}
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <FieldError messages={fieldErrors.email} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700" htmlFor="phone">
          Phone Number (TeleBirr)
        </label>
        <input
          id="phone"
          name="phone"
          value={formValues.phone}
          onChange={updateField}
          placeholder="+251911234567 or 0911234567"
          autoComplete="tel"
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <FieldError messages={fieldErrors.phone} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700" htmlFor="address">
          Delivery Address
        </label>
        <input
          id="address"
          name="address"
          value={formValues.address}
          onChange={updateField}
          placeholder="Bole Sub-City, Near Edna Mall, Addis Ababa"
          autoComplete="street-address"
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <FieldError messages={fieldErrors.address} />
      </div>

      <fieldset className="space-y-2 pt-2">
        <legend className="text-xs font-bold text-slate-700">
          Payment option
        </legend>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            ["telebirr", "TeleBirr Mobile"],
            ["cash", "Cash on Delivery"],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={value}
                checked={formValues.paymentMethod === value}
                onChange={updateField}
                className="text-amber-600"
              />
              <span className="font-semibold text-slate-900">{label}</span>
            </label>
          ))}
        </div>
        <FieldError messages={fieldErrors.paymentMethod} />
      </fieldset>

      <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <CheckoutTotal />
        <button
          type="submit"
          className="rounded-xl bg-amber-600 px-6 py-3 text-xs font-bold text-white shadow transition hover:bg-amber-700"
        >
          Place order
        </button>
      </div>
    </form>
  );
}
