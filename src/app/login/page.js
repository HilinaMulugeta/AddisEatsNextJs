import { redirect } from "next/navigation";
import Link from "next/link";
import { getSafeRedirectPath } from "@/lib/redirects";
import { getAuthenticatedUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your Addis Eats account to check your orders and enjoy Ethiopian food delivery.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }) {
  const user = await getAuthenticatedUser();
  const params = await searchParams;
  const destination = getSafeRedirectPath(params?.next);

  if (user) redirect(destination);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to continue to checkout and keep your orders connected to your account.
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <LoginForm next={destination} />
      </div>
      <p className="text-center text-sm text-slate-600">
        New to Addis Eats?{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(destination)}`}
          className="font-bold text-amber-700 hover:text-amber-800"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
