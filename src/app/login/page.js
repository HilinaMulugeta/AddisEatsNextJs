import Link from "next/link";
import LoginForm from "./LoginForm";
import { getSafeRedirectPath } from "@/lib/localAuth";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your Addis Eats account.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const next = getSafeRedirectPath(params?.next);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to continue to your orders and checkout.</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <LoginForm next={next} registered={params?.registered === "1"} />
      </div>
      <div className="text-center">
        <Link href="/" className="text-xs font-semibold text-amber-700 hover:underline">Back to home</Link>
      </div>
    </div>
  );
}
