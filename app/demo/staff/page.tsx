import { UserCog } from "lucide-react";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/session";

const STATUS_LABEL: Record<string, string> = {
  ON_DUTY: "On duty",
  OFF: "Off",
  ON_LEAVE: "On leave",
};

function statusClasses(status: string) {
  switch (status) {
    case "ON_DUTY":
      return "bg-moss/10 text-moss-dark";
    case "ON_LEAVE":
      return "bg-coral/10 text-coral-dark";
    default:
      return "bg-dusk/8 text-dusk/50";
  }
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default async function StaffPage() {
  const user = await getCurrentUser();
  const snap = await adminDb
    .collection("staff")
    .where("propertyId", "==", user!.propertyId!)
    .orderBy("name", "asc")
    .get();
  // Each staff doc stores `shifts` as a 7-element boolean array (Mon..Sun),
  // denormalized directly on the document — the idiomatic Firestore way,
  // versus a separate join table in a relational database.
  const staff = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

  return (
    <div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-dusk/60">CREW</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-dusk sm:text-3xl">Staff scheduling</h1>
      </div>

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
                  <td className="px-4 py-4 font-mono text-xs text-dusk/60">{s.shift ?? "—"}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${statusClasses(s.status)}`}>
                      {STATUS_LABEL[s.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                {WEEK_DAYS.map((d) => (
                  <th key={d} className="px-2 py-3 text-center font-medium">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dusk/5">
              {staff.map((s) => (
                <tr key={s.id} className="font-body text-sm text-dusk">
                  <td className="px-6 py-4 font-medium">{s.name}</td>
                  {WEEK_DAYS.map((_, i) => (
                    <td key={i} className="px-2 py-4 text-center">
                      <span className={`mx-auto block h-2.5 w-2.5 rounded-full ${s.shifts?.[i] ? "bg-moss" : "bg-dusk/10"}`} />
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
