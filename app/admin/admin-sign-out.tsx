"use client";

import { useRouter } from "next/navigation";
import { signOut as firebaseSignOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";
import { LogOut } from "lucide-react";

export default function AdminSignOut({ name }: { name: string }) {
  const router = useRouter();

  async function handleSignOut() {
    await firebaseSignOut(firebaseAuth).catch(() => {});
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 rounded-full border border-cream/15 px-3 py-1.5 font-body text-xs text-cream/70 transition hover:border-cream/30 hover:text-cream"
    >
      {name}
      <LogOut className="h-3.5 w-3.5" />
    </button>
  );
}
