"use client";

import {
  BedDouble,
  IndianRupee,
  RefreshCw,
  Users,
  CalendarCheck2,
  PackageSearch,
  UserCog,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { revenueTrend, activity, rooms, staff } from "./mock-data";

const occupied = rooms.filter((r) => r.status === "Checked in" || r.status === "Departing today").length;

const STATS = [
  {
    label: "Occupancy today",
    value: `${occupied}/${rooms.length}`,
    sub: "rooms occupied",
    icon: BedDouble,
    tint: "text-coral",
    bg: "bg-coral/10",
  },
  {
    label: "Revenue this week",
    value: "₹3,91,500",
    sub: "+12% vs last week",
    icon: IndianRupee,
    tint: "text-mustard-dark",
    bg: "bg-mustard/15",
  },
  {
    label: "Channels synced",
    value: "3/3",
    sub: "last synced 2 min ago",
    icon: RefreshCw,
    tint: "text-azure-dark",
    bg: "bg-azure/10",
  },
  {
    label: "Staff on duty",
    value: `${staff.filter((s) => s.status === "On duty").length}/${staff.length}`,
    sub: "today's roster",
    icon: Users,
    tint: "text-coral",
    bg: "bg-coral/10",
  },
];

const ACTIVITY_ICON = {
  booking: CalendarCheck2,
  sync: RefreshCw,
  stock: PackageSearch,
  staff: UserCog,
};

const ACTIVITY_TINT = {
  booking: "text-coral bg-coral/10",
  sync: "text-azure-dark bg-azure/10",
  stock: "text-mustard-dark bg-mustard/15",
  staff: "text-dusk bg-dusk/10",
};

export default function OverviewPage() {
  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-dusk/45">
            Saturday, 13 July
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-dusk sm:text-3xl">
            Good afternoon, Vishal
          </h1>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-dusk/10 bg-white/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-dusk/60">
          Demo data · not live
        </span>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-dusk/10 bg-white/70 p-5 shadow-soft"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.bg} ${s.tint}`}>
                <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              </div>
              <p className="mt-4 font-display text-2xl font-bold text-dusk">{s.value}</p>
              <p className="mt-0.5 font-body text-xs text-dusk/60">{s.label}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-dusk/40">
                {s.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart + activity */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-dusk/10 bg-white/70 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-dusk">Revenue, last 7 days</h2>
            <span className="font-mono text-xs text-dusk/40">in ₹</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E1592A" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#E1592A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,35,41,0.08)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "rgba(20,35,41,0.5)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "rgba(20,35,41,0.4)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                  width={36}
                />
                <Tooltip
                  contentStyle={{
                    background: "#142329",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "#F6EFE0",
                  }}
                  formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#E1592A"
                  strokeWidth={2.5}
                  fill="url(#revFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-dusk/10 bg-white/70 p-6 shadow-soft">
          <h2 className="font-display text-lg font-bold text-dusk">Recent activity</h2>
          <ul className="mt-4 space-y-4">
            {activity.map((a, i) => {
              const Icon = ACTIVITY_ICON[a.kind as keyof typeof ACTIVITY_ICON];
              const tint = ACTIVITY_TINT[a.kind as keyof typeof ACTIVITY_TINT];
              return (
                <li key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tint}`}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-body text-sm leading-snug text-dusk">{a.text}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-dusk/40">
                      {a.time}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
