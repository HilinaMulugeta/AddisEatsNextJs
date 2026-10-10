"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../providers";
import Image from "next/image";
import { DELIVERY_FEE_ETB } from "@/lib/constants";

export default function CartClient() {
  const router = useRouter();
  const { items, updateQuantity, subtotal, storageError, clearCartStorage } = useCart();
  const delivery = DELIVERY_FEE_ETB;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl space-y-4">
        {storageError ? (
          <p role="alert" className="text-sm text-red-700">
            {storageError}{" "}
            <button type="button" onClick={clearCartStorage} className="font-semibold underline">
              Clear saved cart
            </button>
          </p>
        ) : (
          <p className="text-slate-500 text-sm">Your order cart is empty.</p>
        )}
        <Link
          href="/menu"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {storageError ? (
        <p role="alert" className="lg:col-span-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {storageError}{" "}
          <button type="button" onClick={clearCartStorage} className="font-semibold underline">
            Clear saved cart
          </button>
        </p>
      ) : null}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
          >
            <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto sm:flex-1 sm:gap-4">
              <Image
                src={item.image}
                alt={item.imageAlt}
                width={item.imageWidth}
                height={item.imageHeight}
                sizes="64px"
                quality={65}
                style={{ width: 64, height: 64 }}
                className="shrink-0 rounded-xl border border-slate-100 object-cover"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-sm">
                  {item.name}
                </h3>
                <p className="text-xs font-semibold text-amber-700">
                  {item.price} ETB
                </p>
              </div>
            </div>

            <div className="ml-auto flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">
              <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, -1)}
                  aria-label={`Remove one ${item.name}`}
                  className="min-h-11 min-w-10 text-sm hover:bg-slate-200 transition"
                >
                  -
                </button>
                <span aria-label={`${item.quantity} in cart`} className="min-w-8 px-1 text-center text-xs font-semibold">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, 1)}
                  aria-label={`Add one ${item.name}`}
                  className="min-h-11 min-w-10 text-sm hover:bg-slate-200 transition"
                >
                  +
                </button>
              </div>
              <span className="w-16 shrink-0 text-right text-xs font-extrabold text-slate-800">
                {item.price * item.quantity} ETB
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 h-fit">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
          Order Summary
        </h3>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">{subtotal} ETB</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee (Addis Zone 1)</span>
            <span className="font-semibold text-slate-900">{delivery} ETB</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-sm font-bold text-slate-900">
            <span>Total</span>
            <span className="text-amber-700">{total} ETB</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/checkout")}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs shadow transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
