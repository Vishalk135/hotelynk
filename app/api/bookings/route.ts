import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.propertyId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { roomId, guestName, checkIn, checkOut } = body ?? {};

  if (!roomId || !guestName || !checkIn || !checkOut) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const roomRef = adminDb.collection("rooms").doc(roomId);
  const roomSnap = await roomRef.get();
  if (!roomSnap.exists) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }
  // Critical: without this check, a user could pass any roomId and book
  // a room belonging to a different client entirely.
  if (roomSnap.data()?.propertyId !== user.propertyId) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  const checkInDate = new Date(checkIn);
  const isArrivingToday = checkInDate.toDateString() === new Date().toDateString();

  const bookingRef = adminDb.collection("bookings").doc();

  await adminDb.runTransaction(async (tx) => {
    tx.set(bookingRef, {
      propertyId: user.propertyId,
      roomId,
      guestName,
      checkIn: Timestamp.fromDate(checkInDate),
      checkOut: Timestamp.fromDate(new Date(checkOut)),
      createdAt: Timestamp.now(),
    });
    tx.update(roomRef, { status: isArrivingToday ? "ARRIVING" : "CHECKED_IN" });
  });

  return NextResponse.json({ ok: true, bookingId: bookingRef.id });
}
