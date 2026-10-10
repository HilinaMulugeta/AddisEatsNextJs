"use client";

import { useState } from "react";
import { useLocalOrders } from "./useLocalOrders";

export default function CancelOrderButton({ orderId }) {
  const [error, setError] = useState(null);
  const { orders, saveOrderStatus } = useLocalOrders();

  const cancelOrder = () => {
    setError(null);
    const order = orders.find((entry) => entry.id === orderId);
    if (!order || order.status !== "placed") {
      setError("This order can no longer be cancelled.");
      return;
    }
    if (!saveOrderStatus(orderId, "cancelled")) {
      setError("This order could not be updated in browser storage.");
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={cancelOrder}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
      >
        Cancel order
      </button>
      {error ? <p role="alert" className="text-[11px] text-red-600">{error}</p> : null}
    </div>
  );
}
