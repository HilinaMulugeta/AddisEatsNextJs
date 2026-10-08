import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSafeRedirectPath } from "@/lib/redirects";
import SignUpForm from "./SignUpForm";

export const metadata = {
  title: "Create an account",
  description: "Create an Addis Eats account to order and track Ethiopian food delivery.",
  robots: { index: false, follow: false },
};

export default async function SignUpPage({ searchParams }) {
  const user = await getAuthenticatedUser();
  const params = await searchParams;
  const destination = getSafeRedirectPath(params?.next);

  if (user) redirect(destination);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign up with your email and a password you choose.
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <SignUpForm next={destination} />
      </div>
      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(destination)}`}
          className="font-bold text-amber-700 hover:text-amber-800"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
