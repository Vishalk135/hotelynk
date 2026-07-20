import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { adminDb } from "@/lib/firebase-admin";
import Sidebar from "./sidebar";
import AssistantWidget from "./assistant-widget";

export default async function DemoLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Platform super-admins manage clients from /admin, not a property
  // dashboard — they have no propertyId to scope data by.
  if (user.role === "SUPER_ADMIN") redirect("/admin");

  let propertyName = "Hotelynk";
  if (user.propertyId) {
    const propDoc = await adminDb.collection("properties").doc(user.propertyId).get();
    propertyName = propDoc.data()?.name ?? propertyName;
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream lg:flex-row">
      <Sidebar user={user} propertyName={propertyName} />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">{children}</div>
      </div>
      <AssistantWidget />
    </div>
  );
}
