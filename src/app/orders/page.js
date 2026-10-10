import OrdersClient from "./OrdersClient";
import AccountGate from "../AccountGate";

export const metadata = {
  title: "Your orders",
  description: "Review your Addis Eats orders.",
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <AccountGate next="/orders">
      <OrdersClient />
    </AccountGate>
  );
}
