import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { name, email, password, propertyId: bodyPropertyId } = body ?? {};

  // Owners can only add staff to their own property. Super-admins must
  // specify which property (they aren't tied to one themselves).
  let propertyId: string | null = null;
  if (user.role === "OWNER") {
    propertyId = user.propertyId;
  } else if (user.role === "SUPER_ADMIN") {
    propertyId = bodyPropertyId ?? null;
  } else {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  if (!propertyId) {
    return NextResponse.json({ error: "No property specified." }, { status: 400 });
  }
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  try {
    const authUser = await adminAuth.createUser({ email, password, displayName: name });
    await adminDb.collection("users").doc(authUser.uid).set({
      email,
      name,
      role: "STAFF",
      propertyId,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ ok: true, uid: authUser.uid });
  } catch (err: any) {
    const message =
      err?.code === "auth/email-already-exists"
        ? "That email is already in use by another account."
        : "Failed to create staff account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
