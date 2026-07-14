"use client";

import { UserCog } from "lucide-react";
import { staff, weekDays, scheduleGrid } from "../mock-data";

function statusClasses(status: string) {
  switch (status) {
    case "On duty":
      return "bg-moss/10 text-moss-dark";
    case "On leave":
      return "bg-coral/10 text-coral-dark";
    default:
      return "bg-dusk/8 text-dusk/50";
  }
}

export default function StaffPage() {
  return (
    <div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-dusk/60">CREW</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-dusk sm:text-3xl">
          Staff scheduling
        </h1>
      </div>

      {/* Roster table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-dusk/10 bg-white/70 shadow-soft">
        <div className="border-b border-dusk/10 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-dusk">Today's roster</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="font-mono text-[11px] uppercase tracking-wide text-dusk/40">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Shift</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dusk/5">
              {staff.map((s) => (
                <tr key={s.id} className="font-body text-sm text-dusk">
                  <td className="px-6 py-4 font-medium">{s.name}</td>
                  <td className="px-4 py-4 text-dusk/70">{s.role}</td>
                  <td className="px-4 py-4 font-mono text-xs text-dusk/60">{s.shift}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${statusClasses(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly schedule grid */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-dusk/10 bg-white/70 shadow-soft">
        <div className="flex items-center gap-2 border-b border-dusk/10 px-6 py-4">
          <UserCog className="h-4.5 w-4.5 text-dusk/50" />
          <h2 className="font-display text-lg font-bold text-dusk">This week</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="font-mono text-[11px] uppercase tracking-wide text-dusk/40">
                <th className="px-6 py-3 font-medium">Name</th>
                {weekDays.map((d) => (
                  <th key={d} className="px-2 py-3 text-center font-medium">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dusk/5">
              {Object.entries(scheduleGrid).map(([name, days]) => (
                <tr key={name} className="font-body text-sm text-dusk">
                  <td className="px-6 py-4 font-medium">{name}</td>
                  {days.map((working, i) => (
                    <td key={i} className="px-2 py-4 text-center">
                      <span
                        className={`mx-auto block h-2.5 w-2.5 rounded-full ${
                          working ? "bg-moss" : "bg-dusk/10"
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
