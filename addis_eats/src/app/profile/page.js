import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/orders";
import { isAdminEmail } from "@/lib/admin";
import { getOrderStatusLabel } from "@/lib/orderStatus";
import { signOut } from "../actions";

export const metadata = {
  title: "Your customer profile",
  description: "Manage your private Addis Eats customer profile and delivery preferences.",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?next=%2Fprofile");

  const orders = await listOrdersForUser(user.id);
  const admin = isAdminEmail(user.email);
  const firstName = user.name.trim().split(/\s+/)[0] || "there";
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <section className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
      <header className="relative overflow-hidden rounded-[2rem] bg-[#173b30] px-6 py-8 text-white shadow-lg shadow-emerald-950/10 sm:px-10 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <div aria-hidden="true" className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-xl font-extrabold text-amber-300 sm:h-20 sm:w-20 sm:text-2xl">{initials || "AE"}</div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-100/10 px-3 py-1 text-[11px] font-semibold text-emerald-100">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Addis Eats account
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Good to see you, {firstName}</h1>
              <p className="mt-1 max-w-xl text-sm leading-6 text-emerald-50/75">Your account, order history, and delivery updates in one place.</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link href="/menu" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-4 text-sm font-bold text-emerald-950 transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">Browse menu</Link>
            {admin ? <Link href="/admin" className="inline-flex min-h-11 items-center rounded-xl border border-white/25 px-4 text-sm font-semibold text-white hover:bg-white/10">Operations</Link> : null}
            <form action={signOut}><button type="submit" className="min-h-11 rounded-xl border border-white/25 px-4 text-sm font-semibold text-white hover:bg-white/10">Sign out</button></form>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><p className="text-sm font-medium text-slate-500">Orders placed</p><p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{orders.length}</p><p className="mt-1 text-xs text-slate-500">Your order history</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><p className="text-sm font-medium text-slate-500">Total spent</p><p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{totalSpent.toLocaleString()} <span className="text-base font-bold text-amber-700">ETB</span></p><p className="mt-1 text-xs text-slate-500">Across your orders</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><p className="text-sm font-medium text-slate-500">Account type</p><p className="mt-3 text-xl font-extrabold text-slate-900">{admin ? "Admin" : "Customer"}</p><p className="mt-1 truncate text-xs text-slate-500" title={user.email}>{user.email}</p></article>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div><h2 className="font-bold text-slate-900">Recent orders</h2><p className="mt-1 text-xs text-slate-500">Your latest meals and delivery progress</p></div>
            <Link href="/orders" className="shrink-0 rounded-lg px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-amber-600">View all <span aria-hidden="true">→</span></Link>
          </div>
          {orders.length ? (
            <ul className="divide-y divide-slate-100">
              {orders.slice(0, 4).map((order) => (
                <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
                  <div className="min-w-0"><Link href={`/orders/${order.id}`} className="font-semibold text-slate-900 hover:text-amber-800">Order {order.id.slice(-8)}</Link><p className="mt-1 text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString("en-ET", { dateStyle: "medium" })} · {order.items.length} {order.items.length === 1 ? "item" : "items"}</p></div>
                  <div className="flex items-center gap-3"><span className="text-sm font-bold text-slate-800">{order.total.toLocaleString()} ETB</span><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800">{getOrderStatusLabel(order.status)}</span></div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-10 text-center"><span aria-hidden="true" className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-2xl">🍲</span><h3 className="mt-4 font-bold text-slate-900">Your first meal is waiting</h3><p className="mt-1 text-sm text-slate-500">Place an order and you’ll find updates here.</p><Link href="/menu" className="mt-4 inline-flex min-h-10 items-center rounded-xl bg-amber-700 px-4 text-sm font-bold text-white hover:bg-amber-800">Explore the menu</Link></div>
          )}
        </article>

        <aside className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-bold text-slate-900">Account details</h2><dl className="mt-4 space-y-4"><div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Name</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{user.name}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Email address</dt><dd className="mt-1 break-all text-sm font-semibold text-slate-800">{user.email}</dd></div></dl></article>
          <article className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6"><h2 className="font-bold text-slate-900">Need something delicious?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Find a favorite, add it to your cart, and follow its progress here.</p><div className="mt-4 flex flex-wrap gap-2"><Link href="/menu" className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-amber-900 shadow-sm ring-1 ring-amber-200 hover:bg-amber-100">Explore menu</Link><Link href="/orders" className="rounded-lg px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white/80">Track an order</Link></div></article>
        </aside>
      </div>
    </section>
  );
}
