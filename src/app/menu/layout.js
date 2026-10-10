import MenuSidebarCounter from "./MenuSidebarCounter";

export default function MenuLayout({ children }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      <section className="order-1 lg:order-2 lg:col-span-3">{children}</section>
      <aside className="order-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:order-1 lg:col-span-1">
        <MenuSidebarCounter />
      </aside>
    </div>
  );
}
