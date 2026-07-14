"use client";

import { useState } from "react";
import { Plus, X, User } from "lucide-react";
import { rooms as initialRooms } from "../mock-data";

function statusClasses(status: string) {
  switch (status) {
    case "Checked in":
      return "bg-azure/10 text-azure-dark";
    case "Arriving today":
      return "bg-mustard/15 text-mustard-dark";
    case "Departing today":
      return "bg-coral/10 text-coral-dark";
    case "Housekeeping":
      return "bg-dusk/10 text-dusk/60";
    default:
      return "bg-dusk/5 text-dusk/40";
  }
}

const FILTERS = ["All", "Arriving today", "Departing today", "Vacant"];

export default function BookingsPage() {
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const visibleRooms = initialRooms.filter((r) => {
    if (filter === "All") return true;
    if (filter === "Vacant") return r.status === "Vacant";
    return r.status === filter;
  });

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const guest = form.get("guest") as string;
    setModalOpen(false);
    setConfirmed(guest || "Guest");
    setTimeout(() => setConfirmed(null), 3500);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-coral">STAY</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-dusk sm:text-3xl">
            Bookings & inventory
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-full bg-coral px-5 py-2.5 font-body text-sm font-semibold text-cream shadow-soft transition hover:bg-coral-dark hover:shadow-card"
        >
          <Plus className="h-4 w-4" />
          New booking
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 font-body text-sm transition ${
              filter === f
                ? "border-dusk bg-dusk text-cream"
                : "border-dusk/15 bg-white/60 text-dusk/70 hover:border-dusk/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Room grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleRooms.map((room) => (
          <div
            key={room.id}
            className="rounded-2xl border border-dusk/10 bg-white/70 p-5 shadow-soft transition hover:shadow-card"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-display text-base font-bold text-dusk">{room.name}</h3>
              <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${statusClasses(room.status)}`}>
                {room.status}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-dusk/70">
              <User className="h-3.5 w-3.5" />
              <span className="font-body text-sm">{room.guest ?? "No guest"}</span>
            </div>
            {room.nights && (
              <p className="mt-1 font-mono text-[11px] text-dusk/40">{room.nights}</p>
            )}
            <p className="mt-4 font-display text-lg font-bold text-dusk">
              ₹{room.price.toLocaleString("en-IN")}
              <span className="font-body text-xs font-normal text-dusk/40"> / night</span>
            </p>
          </div>
        ))}
      </div>

      {/* New booking modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-dusk-deep/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl bg-cream p-6 shadow-lift sm:rounded-3xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-dusk">New booking</h2>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-dusk/50 transition hover:bg-dusk/5 hover:text-dusk"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div>
                <label className="font-body text-xs font-medium text-dusk/60">Room</label>
                <select
                  name="room"
                  className="mt-1 w-full rounded-xl border border-dusk/15 bg-white px-3 py-2.5 font-body text-sm text-dusk focus:border-coral"
                >
                  {initialRooms
                    .filter((r) => r.status === "Vacant")
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="font-body text-xs font-medium text-dusk/60">Guest name</label>
                <input
                  name="guest"
                  required
                  placeholder="e.g. Priya Kamat"
                  className="mt-1 w-full rounded-xl border border-dusk/15 bg-white px-3 py-2.5 font-body text-sm text-dusk placeholder:text-dusk/30 focus:border-coral"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs font-medium text-dusk/60">Check-in</label>
                  <input
                    type="date"
                    name="checkin"
                    className="mt-1 w-full rounded-xl border border-dusk/15 bg-white px-3 py-2.5 font-body text-sm text-dusk focus:border-coral"
                  />
                </div>
                <div>
                  <label className="font-body text-xs font-medium text-dusk/60">Check-out</label>
                  <input
                    type="date"
                    name="checkout"
                    className="mt-1 w-full rounded-xl border border-dusk/15 bg-white px-3 py-2.5 font-body text-sm text-dusk focus:border-coral"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-coral py-3 font-body text-sm font-semibold text-cream shadow-soft transition hover:bg-coral-dark"
              >
                Create booking
              </button>
              <p className="text-center font-mono text-[10px] uppercase tracking-wide text-dusk/35">
                Demo only — nothing is saved
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation toast */}
      {confirmed && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-dusk px-5 py-3 font-body text-sm text-cream shadow-lift">
          Booking created for {confirmed}
        </div>
      )}
    </div>
  );
}
