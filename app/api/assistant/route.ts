import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.propertyId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const propertyId = user.propertyId;

  const { question } = await req.json().catch(() => ({ question: "" }));
  const q = (question || "").toLowerCase();

  if (q.includes("occup") || q.includes("vacant") || q.includes("free room")) {
    const roomsSnap = await adminDb.collection("rooms").where("propertyId", "==", propertyId).get();
    const rooms = roomsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
    const occupied = rooms.filter((r) => r.status === "CHECKED_IN" || r.status === "DEPARTING");
    const vacant = rooms.filter((r) => r.status === "VACANT");
    return NextResponse.json({
      reply: `${occupied.length} of ${rooms.length} rooms are occupied right now. Vacant: ${
        vacant.length ? vacant.map((r) => r.name).join(", ") : "none"
      }.`,
    });
  }

  if (q.includes("arriv")) {
    const snap = await adminDb.collection("rooms").where("propertyId", "==", propertyId).where("status", "==", "ARRIVING").get();
    const names = snap.docs.map((d) => d.data().name);
    return NextResponse.json({ reply: names.length ? `Arriving: ${names.join(", ")}.` : "No one is marked as arriving right now." });
  }
  if (q.includes("depart")) {
    const snap = await adminDb.collection("rooms").where("propertyId", "==", propertyId).where("status", "==", "DEPARTING").get();
    const names = snap.docs.map((d) => d.data().name);
    return NextResponse.json({ reply: names.length ? `Departing: ${names.join(", ")}.` : "No one is marked as departing right now." });
  }

  if (q.includes("revenue") || q.includes("sales") || q.includes("earn")) {
    if (user.role !== "OWNER" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ reply: "Revenue details are only visible to the property owner." });
    }
    const weekAgo = new Date();
    weekAgo.setHours(0, 0, 0, 0);
    weekAgo.setDate(weekAgo.getDate() - 6);
    const snap = await adminDb
      .collection("orders")
      .where("propertyId", "==", propertyId)
      .where("createdAt", ">=", Timestamp.fromDate(weekAgo))
      .get();
    const orders = snap.docs.map((d) => d.data() as any);
    const total = orders.reduce((s, o) => s + o.total, 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => (o.createdAt as Timestamp).toDate() >= todayStart);
    const todayTotal = todayOrders.reduce((s, o) => s + o.total, 0);

    return NextResponse.json({
      reply: `This week's revenue is ₹${total.toLocaleString("en-IN")}. Today so far: ₹${todayTotal.toLocaleString("en-IN")} across ${todayOrders.length} orders.`,
    });
  }

  if (q.includes("stock") || q.includes("inventory") || q.includes("low")) {
    const snap = await adminDb.collection("menuItems").where("propertyId", "==", propertyId).get();
    const items = snap.docs.map((d) => d.data() as any);
    const low = items.filter((m) => m.stock / m.maxStock <= 0.25);
    return NextResponse.json({
      reply: low.length ? `Running low: ${low.map((m) => `${m.name} (${m.stock} left)`).join(", ")}.` : "Nothing is critically low right now.",
    });
  }

  if (q.includes("staff") || q.includes("duty") || q.includes("roster") || q.includes("working")) {
    const snap = await adminDb.collection("staff").where("propertyId", "==", propertyId).get();
    const staff = snap.docs.map((d) => d.data() as any);
    const onDuty = staff.filter((s) => s.status === "ON_DUTY");
    return NextResponse.json({
      reply: `${onDuty.length} of ${staff.length} staff are on duty: ${onDuty.map((s) => s.name).join(", ") || "none"}.`,
    });
  }

  if (q.includes("sync") || q.includes("channel") || q.includes("airbnb")) {
    return NextResponse.json({
      reply: "Channel sync is a preview feature — real Airbnb/Booking.com/MakeMyTrip integration requires becoming an approved connectivity partner with each platform.",
    });
  }

  if (q.trim() === "" || q.includes("hello") || q.includes("hi")) {
    return NextResponse.json({
      reply: "Hi! Ask me about today's occupancy, revenue, stock levels, or staff on duty — I'm reading this straight from your database.",
    });
  }

  return NextResponse.json({
    reply: "I can help with occupancy, arrivals/departures, revenue, stock levels, or staff on duty — try asking about one of those.",
  });
}
