"use client";

import { useActionState } from "react";
import { signUp } from "../actions";

const initialState = { fieldErrors: {}, error: null };

function FieldError({ errors }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs text-red-700">{errors[0]}</p>;
}

export default function SignUpForm({ next }) {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      {state.error ? (
        <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-xs font-bold text-slate-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <FieldError errors={state.fieldErrors?.name} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-bold text-slate-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-xs font-bold text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={128}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <p className="text-xs text-slate-500">Use at least 8 characters.</p>
        <FieldError errors={state.fieldErrors?.password} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-amber-700 disabled:cursor-wait disabled:bg-amber-300"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
