import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { Sparkles } from "lucide-react";
import AdminSignOut from "./admin-sign-out";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "SUPER_ADMIN") redirect("/demo");

  return (
    <div className="min-h-screen bg-dusk">
      <header className="border-b border-cream/10 bg-dusk/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-coral to-azure">
              <Sparkles className="h-3.5 w-3.5 text-dusk" />
            </div>
            <span className="font-display text-lg font-bold text-cream">Hotelynk</span>
            <span className="ml-1 rounded-full border border-cream/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-cream/50">
              Admin
            </span>
          </div>
          <AdminSignOut name={user.name} />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
