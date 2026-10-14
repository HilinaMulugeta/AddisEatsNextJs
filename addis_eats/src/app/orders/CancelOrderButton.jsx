"use client";

import { useActionState } from "react";
import { cancelOrder } from "../actions";

const initialState = { error: null, id: null };

export default function CancelOrderButton({ orderId }) {
  const [state, formAction, pending] = useActionState(cancelOrder, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="orderId" value={orderId} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs font-semibold text-red-700 border border-red-200 hover:bg-red-50 disabled:opacity-50 px-3 py-1.5 rounded-lg"
      >
        {pending ? "Cancelling…" : "Cancel order"}
      </button>
      {state.error ? <p className="text-[11px] text-red-600">{state.error}</p> : null}
    </form>
  );
}
