import Link from "next/link";
import { redirect } from "next/navigation";
import SignOutButton from "../SignOutButton";
import { getAuthenticatedUser } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/orders";
import { formatOrderStatus } from "@/lib/orderStatus";

export const metadata = {
  title: "Your customer profile",
  description: "Manage your private Addis Eats customer profile and delivery preferences.",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/login?next=%2Fprofile");
  }
  const orders = await listOrdersForUser(user.id);

  return (
    <main className="container">
      <nav className="nav">
        <div className="brand">Addis Eats</div>
        <div className="nav-links">
          <Link href="/" className="link-btn">Home</Link>
          <Link href="/orders" className="secondary-btn">Orders</Link>
          <Link href="/checkout" className="secondary-btn">Checkout</Link>
          <Link href="/profile" className="secondary-btn">Profile</Link>
        </div>
      </nav>

      <section className="page-shell profile-shell">
        <div className="profile-header">
          <div className="profile-identify">
            <div className="avatar">{user.name.slice(0, 2).toUpperCase()}</div>
            <div>
              <span className="status-tag">● Logged in</span>
              <h1>Welcome, {user.name}</h1>
            </div>
          </div>
          <div className="profile-actions">
            <SignOutButton />
          </div>
        </div>

        <p className="profile-intro">Your account and recent orders are loaded from your signed-in session.</p>

        <div className="profile-grid">
          <article className="detail-panel">
            <h2>Account details</h2>
            <div className="info-list">
              <div className="info-item"><strong>Email:</strong> {user.email}</div>
              <div className="info-item"><strong>Status:</strong> Authenticated</div>
              <div className="info-item"><strong>Role:</strong> Customer</div>
            </div>
          </article>

          <article className="detail-panel">
            <h2>Delivery preferences</h2>
            <p className="text-sm text-slate-500">
              Saved delivery preferences are not part of this demo. Choose delivery and payment
              details at checkout for each order.
            </p>
          </article>
        </div>

        <article className="detail-panel orders-panel">
          <div className="panel-header">
            <h2>Recent orders</h2>
            <Link href="/orders" className="link-btn small-link">View all</Link>
          </div>

          {orders.length ? (
            <div className="order-list">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="order-item">
                  <div>
                    <strong>{order.id}</strong>
                    <div className="order-meta">
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                      <span>{order.paymentMethod}</span>
                    </div>
                  </div>
                  <span className={`order-status ${order.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    {formatOrderStatus(order.status)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No orders have been placed for this account.</p>
          )}
        </article>
      </section>
    </main>
  );
}
