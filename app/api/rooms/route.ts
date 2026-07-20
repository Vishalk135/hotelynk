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
  const { name, price } = body ?? {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Room name is required." }, { status: 400 });
  }
  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum <= 0) {
    return NextResponse.json({ error: "Enter a valid price." }, { status: 400 });
  }

  const ref = adminDb.collection("rooms").doc();
  await ref.set({
    propertyId: user.propertyId,
    name: name.trim(),
    price: Math.round(priceNum),
    status: "VACANT",
    createdAt: Timestamp.now(),
  });

  return NextResponse.json({ ok: true, roomId: ref.id });
}