"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

const initialState = { error: null };

export default function LoginForm({ next }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      {state.error ? (
        <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-bold text-slate-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-xs font-bold text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-amber-700 disabled:cursor-wait disabled:bg-amber-300"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
