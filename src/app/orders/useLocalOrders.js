"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import {
  getEmptyOrdersSnapshot,
  getOrdersSnapshot,
  parseOrders,
  subscribeToOrders,
  updateOrderStatuses,
  writeOrders,
} from "@/lib/localOrders";
import { getOrderStatusForAge } from "@/lib/orderStatus";
import { useAccount } from "../useAccount";

export function useLocalOrders() {
  const account = useAccount();
  const snapshot = useSyncExternalStore(
    subscribeToOrders,
    getOrdersSnapshot,
    getEmptyOrdersSnapshot,
  );
  const [writeError, setWriteError] = useState(null);
  const parsedState = useMemo(() => {
    try {
      return { orders: parseOrders(snapshot), error: null };
    } catch {
      return {
        orders: [],
        error: "Saved orders could not be loaded. Clear this browser's saved order data to continue.",
      };
    }
  }, [snapshot]);

  const saveOrders = useCallback((orders) => {
    try {
      writeOrders(orders);
      setWriteError(null);
      return true;
    } catch {
      setWriteError("Order changes could not be saved in this browser.");
      return false;
    }
  }, []);

  const refreshStatuses = useCallback(() => {
    if (parsedState.error) return;
    try {
      const result = updateOrderStatuses(parsedState.orders, getOrderStatusForAge);
      if (result.changed) writeOrders(result.orders);
    } catch {
      setWriteError("Order status could not be updated in this browser.");
    }
  }, [parsedState]);

  const saveOrderStatus = useCallback((orderId, status) => {
    if (parsedState.error || !account?.id) return false;
    const order = parsedState.orders.find(
      (entry) => entry.id === orderId && entry.userId === account.id,
    );
    if (!order) return false;
    const nextOrders = parsedState.orders.map((entry) =>
      entry.id === orderId && entry.userId === account.id
        ? { ...entry, status }
        : entry,
    );
    return saveOrders(nextOrders);
  }, [account, parsedState, saveOrders]);

  return {
    orders: account?.id
      ? parsedState.orders.filter((order) => order.userId === account.id)
      : [],
    storageError: writeError || parsedState.error,
    saveOrders,
    saveOrderStatus,
    refreshStatuses,
  };
}
