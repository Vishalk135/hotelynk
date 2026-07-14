import { rooms, channels, menu, staff, revenueTrend } from "./mock-data";

function lower(s: string) {
  return s.toLowerCase();
}

export function getAssistantReply(raw: string): string {
  const q = lower(raw);

  // Occupancy
  if (q.includes("occup") || (q.includes("room") && (q.includes("free") || q.includes("vacant") || q.includes("empty")))) {
    const occupied = rooms.filter((r) => r.status === "Checked in" || r.status === "Departing today");
    const vacant = rooms.filter((r) => r.status === "Vacant");
    return `${occupied.length} of ${rooms.length} rooms are occupied right now. Vacant: ${
      vacant.length ? vacant.map((r) => r.name).join(", ") : "none"
    }.`;
  }

  // Arriving / departing
  if (q.includes("arriv")) {
    const arriving = rooms.filter((r) => r.status === "Arriving today");
    return arriving.length
      ? `Arriving today: ${arriving.map((r) => `${r.name} (${r.guest})`).join(", ")}.`
      : "No one is arriving today.";
  }
  if (q.includes("depart") || q.includes("check out") || q.includes("checkout")) {
    const departing = rooms.filter((r) => r.status === "Departing today");
    return departing.length
      ? `Departing today: ${departing.map((r) => `${r.name} (${r.guest})`).join(", ")}.`
      : "No one is departing today.";
  }

  // Revenue
  if (q.includes("revenue") || q.includes("sales") || q.includes("earn") || q.includes("income")) {
    const total = revenueTrend.reduce((s, d) => s + d.revenue, 0);
    const best = [...revenueTrend].sort((a, b) => b.revenue - a.revenue)[0];
    return `This week's revenue is ₹${total.toLocaleString("en-IN")}. Best day so far: ${best.day} at ₹${best.revenue.toLocaleString("en-IN")}.`;
  }

  // Stock / inventory
  if (q.includes("stock") || q.includes("inventory") || q.includes("running low") || q.includes("low on")) {
    const low = menu.filter((m) => m.stock / m.maxStock <= 0.25);
    return low.length
      ? `Running low: ${low.map((m) => `${m.name} (${m.stock} left)`).join(", ")}. Might be worth reordering.`
      : "Nothing is critically low right now — stock levels look healthy.";
  }

  // Staff / duty
  if (q.includes("staff") || q.includes("duty") || q.includes("roster") || q.includes("shift") || q.includes("working")) {
    const onDuty = staff.filter((s) => s.status === "On duty");
    const onLeave = staff.filter((s) => s.status === "On leave");
    return `${onDuty.length} of ${staff.length} staff are on duty: ${onDuty.map((s) => s.name).join(", ")}.${
      onLeave.length ? ` On leave: ${onLeave.map((s) => s.name).join(", ")}.` : ""
    }`;
  }

  // Sync / channels
  if (q.includes("sync") || q.includes("channel") || q.includes("airbnb") || q.includes("booking.com") || q.includes("makemytrip")) {
    const allGood = channels.every((c) => c.status === "Connected");
    return `${allGood ? "All channels are connected and in sync." : "Some channels need attention."} ${channels
      .map((c) => `${c.name}: ${c.status}, last synced ${c.lastSync}`)
      .join(" · ")}`;
  }

  // Rates
  if (q.includes("rate") || q.includes("price") || q.includes("pricing")) {
    return "Base rates: Standard Room ₹3,200 · Garden Villa ₹5,400 · Sea View Villa ₹8,200 — synced across Airbnb, Booking.com and MakeMyTrip.";
  }

  // Greeting
  if (q.includes("hello") || q.includes("hi") || q.trim() === "") {
    return "Hi! Ask me about today's occupancy, revenue, stock levels, staff on duty, or channel sync status.";
  }

  return "I can help with occupancy, arrivals/departures, revenue, stock levels, staff on duty, or channel sync — try asking about one of those.";
}
