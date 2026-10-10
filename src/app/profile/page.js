import AccountGate from "../AccountGate";
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "Your profile",
  description: "View your Addis Eats account.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <AccountGate next="/profile">
      <ProfileClient />
    </AccountGate>
  );
}
