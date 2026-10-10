"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "./useAccount";

export default function AccountGate({ children, next }) {
  const account = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (account === null) {
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [account, next, router]);

  if (account?.error) {
    return <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{account.error}</p>;
  }
  if (!account) {
    return <p role="status" className="text-sm text-slate-500">Checking your account…</p>;
  }
  return children;
}
