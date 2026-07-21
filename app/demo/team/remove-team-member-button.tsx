"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function RemoveTeamMemberButton({ uid, name }: { uid: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    try {
      const res = await fetch(`/api/team/${uid}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Failed to remove this account.");
        return;
      }
      router.refresh();
    } finally {
      setRemoving(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleRemove}
          disabled={removing}
          className="flex h-7 items-center gap-1 rounded-full bg-coral px-2.5 font-mono text-[10px] uppercase tracking-wide text-cream transition hover:bg-coral-dark disabled:opacity-70"
        >
          {removing ? <Loader2 className="h-3 w-3 animate-spin" /> : `Remove ${name}?`}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={removing}
          className="flex h-7 items-center rounded-full border border-dusk/15 px-2.5 font-mono text-[10px] uppercase tracking-wide text-dusk/60 transition hover:border-dusk/30"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={`Remove ${name}`}
      className="flex h-7 w-7 items-center justify-center rounded-full text-dusk/30 transition hover:bg-coral/10 hover:text-coral"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}