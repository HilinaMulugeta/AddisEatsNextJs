"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { placeOrder } from "../actions";
import { useCart } from "../providers";
import CheckoutTotal from "./CheckoutTotal";
import { etb } from "@/lib/format";

const initialState = { fieldErrors: {}, id: null, error: null };

function FieldError({ messages }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-red-600 font-medium">{messages[0]}</p>;
}

export default function CheckoutForm({ customer, idempotencyKey }) {
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const [formValues, setFormValues] = useState({
    name: customer.name,
    phone: "",
    address: "",
    neighborhood: "Bole",
    paymentMethod: "telebirr",
  });
  const { items, clearCart, storageError } = useCart();

  useEffect(() => {
    if (state.id) clearCart();
  }, [state.id, clearCart]);

  if (state.id) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 space-y-3">
        <h2 className="text-lg font-extrabold text-emerald-900">Order placed</h2>
        <p className="text-sm text-emerald-800">
          Your order <span className="font-mono font-bold">{state.id}</span> is saved to your account.
        </p>
        <p className="text-sm text-emerald-800">Order total: {etb.format(state.total)}</p>
        <Link href="/orders" className="inline-flex min-h-11 items-center text-xs font-semibold text-amber-800 hover:underline">
          View my orders →
        </Link>
      </div>
    );
  }

  if (items.length === 0 || storageError) {
    return (
      <div className="space-y-3 text-center">
        <p role={storageError ? "alert" : undefined} className="text-sm text-slate-600">
          {storageError || "Your cart is empty. Add a dish from the menu before checking out."}
        </p>
        <Link href="/menu" className="inline-flex min-h-11 items-center text-xs font-semibold text-amber-700 hover:underline">
          Browse the menu →
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(items.map(({ id, quantity }) => ({ id, quantity })))}
      />
      {state.error ? (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700" htmlFor="neighborhood">Neighborhood</label>
        <select
          id="neighborhood"
          name="neighborhood"
          value={formValues.neighborhood}
          onChange={(event) => setFormValues((current) => ({ ...current, neighborhood: event.target.value }))}
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gullele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka", "Other"].map((area) => <option key={area} value={area}>{area}</option>)}
        </select>
        <FieldError messages={state.fieldErrors?.neighborhood} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700" htmlFor="name">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formValues.name}
          onChange={(event) =>
            setFormValues((current) => ({ ...current, name: event.target.value }))
          }
          placeholder="e.g. Almaz Bekele"
          autoComplete="name"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
        />
        <FieldError messages={state.fieldErrors?.name} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={customer.email}
          autoComplete="email"
          readOnly
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-100 text-slate-600"
        />
        <p className="text-[11px] text-slate-500">From your signed-in account.</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700" htmlFor="phone">
          Phone Number (TeleBirr / CBE)
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          name="phone"
          value={formValues.phone}
          onChange={(event) =>
            setFormValues((current) => ({ ...current, phone: event.target.value }))
          }
          placeholder="+251911234567 or 0911234567"
          autoComplete="tel"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
        />
        <FieldError messages={state.fieldErrors?.phone} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700" htmlFor="address">
          Delivery Address
        </label>
        <input
          id="address"
          type="text"
          name="address"
          value={formValues.address}
          onChange={(event) =>
            setFormValues((current) => ({ ...current, address: event.target.value }))
          }
          placeholder="Bole Sub-City, Near Edna Mall, Addis Ababa"
          autoComplete="street-address"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
        />
        <FieldError messages={state.fieldErrors?.address} />
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-xs font-bold text-slate-700">Payment Option</label>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <label className="flex min-h-11 items-center gap-2 p-3 border border-amber-500/50 bg-amber-50/50 rounded-xl cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="telebirr"
              checked={formValues.paymentMethod === "telebirr"}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  paymentMethod: event.target.value,
                }))
              }
              className="text-amber-600"
            />
            <span className="font-semibold text-slate-900">TeleBirr Mobile</span>
          </label>
          <label className="flex min-h-11 items-center gap-2 p-3 border border-slate-200 rounded-xl cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={formValues.paymentMethod === "cash"}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  paymentMethod: event.target.value,
                }))
              }
              className="text-amber-600"
            />
            <span className="font-semibold text-slate-900">Cash on Delivery</span>
          </label>
        </div>
        <FieldError messages={state.fieldErrors?.paymentMethod} />
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
        <CheckoutTotal />
        <button
          type="submit"
          disabled={pending}
          className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold px-6 py-3 rounded-xl text-xs shadow transition"
        >
          {pending ? "Placing order…" : "Confirm Order"}
        </button>
      </div>
    </form>
  );
}
