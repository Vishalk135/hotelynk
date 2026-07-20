import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/session";
import { Timestamp } from "firebase-admin/firestore";
import BookingsClient from "./bookings-client";

export default async function BookingsPage() {
  const user = await getCurrentUser();
  const propertyId = user!.propertyId!;

  const [roomsSnap, bookingsSnap] = await Promise.all([
    adminDb.collection("rooms").where("propertyId", "==", propertyId).orderBy("name", "asc").get(),
    adminDb.collection("bookings").where("propertyId", "==", propertyId).orderBy("createdAt", "desc").get(),
  ]);

  const rooms = roomsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
  const bookings = bookingsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

  const formatted = rooms.map((r) => {
    const latest = bookings.find((b) => b.roomId === r.id);
    return {
      id: r.id,
      name: r.name,
      price: r.price,
      status: r.status,
      guest: latest?.guestName ?? null,
      nights: latest
        ? `${(latest.checkIn as Timestamp).toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${(latest.checkOut as Timestamp).toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
        : null,
    };
  });

  return <BookingsClient initialRooms={formatted} />;
}
