import { signOut } from "./actions";

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-xs font-semibold text-slate-500 underline-offset-4 hover:text-amber-700 hover:underline"
      >
        Sign out
      </button>
    </form>
  );
}
