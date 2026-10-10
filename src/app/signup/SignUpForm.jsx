"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerLocalAccount } from "@/lib/localAuth";

export default function SignUpForm({ next }) {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setFieldErrors({});
    try {
      const result = await registerLocalAccount(values);
      if (!result.ok) {
        setFieldErrors(result.fieldErrors || {});
        return;
      }
      router.replace(`/login?next=${encodeURIComponent(next)}&registered=1`);
    } catch {
      setError("Your account could not be saved in this browser. Check browser storage and try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-5">
      {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="next" value={next} />
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-bold text-slate-700">Full name</label>
          <input id="name" name="name" autoComplete="name" required maxLength={80} value={values.name} onChange={update} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          {fieldErrors.name?.[0] ? <p className="text-xs text-red-600">{fieldErrors.name[0]}</p> : null}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-slate-700">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={update} placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          {fieldErrors.email?.[0] ? <p className="text-xs text-red-600">{fieldErrors.email[0]}</p> : null}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-bold text-slate-700">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={values.password} onChange={update} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          {fieldErrors.password?.[0] ? <p className="text-xs text-red-600">{fieldErrors.password[0]}</p> : null}
          <p className="text-[11px] text-slate-500">Use at least 8 characters.</p>
        </div>
        <button type="submit" disabled={pending} className="w-full rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-amber-700 disabled:cursor-wait disabled:bg-amber-300">
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-bold text-amber-700 hover:text-amber-800">
          Sign in
        </Link>
      </p>
    </div>
  );
}
