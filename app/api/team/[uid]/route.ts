import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/session";

export async function DELETE(req: NextRequest, { params }: { params: { uid: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (user.role !== "OWNER" && user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const targetUid = params.uid;
  const targetDoc = await adminDb.collection("users").doc(targetUid).get();
  if (!targetDoc.exists) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }
  const target = targetDoc.data()!;

  // Safety guards: never let this route remove an OWNER account (avoids
  // accidentally locking a client out of their own dashboard), and owners
  // can only remove staff within their own property.
  if (target.role === "OWNER" || target.role === "SUPER_ADMIN") {
    return NextResponse.json({ error: "Owner accounts can't be removed here." }, { status: 400 });
  }
  if (user.role === "OWNER" && target.propertyId !== user.propertyId) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  await adminAuth.deleteUser(targetUid).catch(() => {});
  await adminDb.collection("users").doc(targetUid).delete();

  return NextResponse.json({ ok: true });
}