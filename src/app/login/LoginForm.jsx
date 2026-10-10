"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInLocalAccount } from "@/lib/localAuth";
import { useAccount } from "../useAccount";

export default function LoginForm({ next, registered = false }) {
  const router = useRouter();
  const account = useAccount();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (account && !account.error) router.replace(next);
  }, [account, next, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await signInLocalAccount({ email, password });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Sign-in could not access browser storage. Check your browser settings and try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-5">
      {registered ? (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Account created. Sign in to continue.
        </p>
      ) : null}
      {account?.error || error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {account?.error || error}
        </p>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="next" value={next} />
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-slate-700">Email address</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-bold text-slate-700">Password</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <button type="submit" disabled={pending} className="w-full rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-amber-700 disabled:cursor-wait disabled:bg-amber-300">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600">
        New to Addis Eats?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-bold text-amber-700 hover:text-amber-800">
          Create an account
        </Link>
      </p>
    </div>
  );
}
