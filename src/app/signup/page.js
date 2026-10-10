import Link from "next/link";
import SignUpForm from "./SignUpForm";
import { getSafeRedirectPath } from "@/lib/localAuth";

export const metadata = {
  title: "Create an account",
  description: "Create an Addis Eats account.",
  robots: { index: false, follow: false },
};

export default async function SignUpPage({ searchParams }) {
  const params = await searchParams;
  const next = getSafeRedirectPath(params?.next);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">Create an account, then sign in to place an order.</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <SignUpForm next={next} />
      </div>
      <div className="text-center">
        <Link href="/" className="text-xs font-semibold text-amber-700 hover:underline">Back to home</Link>
      </div>
    </div>
  );
}
