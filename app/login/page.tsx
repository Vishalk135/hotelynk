"use client";

import { useState, FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@hotelynk.in");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Sign in with Firebase's client SDK.
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await credential.user.getIdToken();

      // 2. Exchange the ID token for a secure HttpOnly session cookie,
      //    so Server Components and middleware can verify who's signed in.
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error("Could not establish a session.");

      router.push("/demo");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dusk px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-coral to-azure">
            <Sparkles className="h-4 w-4 text-dusk" />
          </div>
          <span className="font-display text-xl font-bold text-cream">Hotelynk</span>
        </div>

        <div className="mt-8 rounded-3xl border border-cream/10 bg-dusk-light p-8 shadow-card">
          <h1 className="font-display text-xl font-bold text-cream">Sign in</h1>
          <p className="mt-1 font-body text-sm text-cream/50">
            Owner and staff dashboard access.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="font-body text-xs font-medium text-cream/60">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-cream/15 bg-dusk px-3 py-2.5 font-body text-sm text-cream focus:border-coral"
              />
            </div>
            <div>
              <label className="font-body text-xs font-medium text-cream/60">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-cream/15 bg-dusk px-3 py-2.5 font-body text-sm text-cream focus:border-coral"
              />
            </div>

            {error && <p className="font-body text-sm text-coral">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-coral py-3 font-body text-sm font-semibold text-cream shadow-soft transition hover:bg-coral-dark disabled:opacity-70"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-cream/10 bg-dusk px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-wide text-cream/40">Demo login</p>
            <p className="mt-1 font-body text-xs text-cream/60">
              owner@hotelynk.in / hotelynk123 (after running the seed script)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
