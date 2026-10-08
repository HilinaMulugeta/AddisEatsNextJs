import MenuSidebarCounter from "./MenuSidebarCounter";

export default function MenuLayout({ children }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      <aside className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm sticky top-24">
        <MenuSidebarCounter />
      </aside>
      <section className="lg:col-span-3">{children}</section>
    </div>
  );
}
