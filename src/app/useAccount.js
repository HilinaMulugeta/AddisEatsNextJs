"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getLocalAccountSnapshot,
  getServerAccountSnapshot,
  subscribeToLocalAccount,
} from "@/lib/localAuth";

export function useAccount() {
  const snapshot = useSyncExternalStore(
    subscribeToLocalAccount,
    getLocalAccountSnapshot,
    getServerAccountSnapshot,
  );
  return useMemo(() => JSON.parse(snapshot), [snapshot]);
}
