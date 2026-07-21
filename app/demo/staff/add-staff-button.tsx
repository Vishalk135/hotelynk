"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";

export default function AddStaffButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const role = form.get("role") as string;

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to add staff member.");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 self-start rounded-full border border-dusk/15 bg-white/60 px-5 py-2.5 font-body text-sm font-medium text-dusk transition hover:border-dusk/30"
      >
        <Plus className="h-4 w-4" />
        Add staff member
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-dusk-deep/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-t-3xl bg-cream p-6 shadow-lift sm:rounded-3xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-dusk">Add a staff member</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-dusk/50 transition hover:bg-dusk/5 hover:text-dusk"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="font-body text-xs font-medium text-dusk/60">Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Anjali Naik"
                  className="mt-1 w-full rounded-xl border border-dusk/15 bg-white px-3 py-2.5 font-body text-sm text-dusk placeholder:text-dusk/30 focus:border-coral"
                />
              </div>
              <div>
                <label className="font-body text-xs font-medium text-dusk/60">Role</label>
                <input
                  name="role"
                  required
                  placeholder="e.g. Front desk, Housekeeping, Chef"
                  className="mt-1 w-full rounded-xl border border-dusk/15 bg-white px-3 py-2.5 font-body text-sm text-dusk placeholder:text-dusk/30 focus:border-coral"
                />
              </div>
              {error && <p className="font-body text-sm text-coral">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-dusk py-3 font-body text-sm font-semibold text-cream shadow-soft transition hover:bg-dusk/85 disabled:opacity-70"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Adding…" : "Add staff member"}
              </button>
            </form>
          </div>
        </div>
      )}
      <p className="mt-2 font-body text-xs text-dusk/40">
        New staff start marked "Off" with no shifts — edit their schedule in Firebase Console for now.
      </p>
    </>
  );
}