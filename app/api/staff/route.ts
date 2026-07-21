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
  const { name, role } = body ?? {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!role || typeof role !== "string" || !role.trim()) {
    return NextResponse.json({ error: "Role is required." }, { status: 400 });
  }

  const ref = adminDb.collection("staff").doc();
  await ref.set({
    propertyId: user.propertyId,
    name: name.trim(),
    role: role.trim(),
    status: "OFF",
    shift: null,
    shifts: [false, false, false, false, false, false, false],
    createdAt: Timestamp.now(),
  });

  return NextResponse.json({ ok: true, staffId: ref.id });
}
