import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { propertyName, ownerName, ownerEmail, ownerPassword } = body ?? {};

  if (!propertyName || !ownerName || !ownerEmail || !ownerPassword) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (ownerPassword.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  try {
    // 1. Create the Firebase Auth account for the client's owner.
    const authUser = await adminAuth.createUser({
      email: ownerEmail,
      password: ownerPassword,
      displayName: ownerName,
    });

    // 2. Create the property doc.
    const propertyRef = adminDb.collection("properties").doc();
    await propertyRef.set({
      name: propertyName,
      ownerEmail,
      createdAt: Timestamp.now(),
    });

    // 3. Create the user profile doc, linking auth account -> property.
    await adminDb.collection("users").doc(authUser.uid).set({
      email: ownerEmail,
      name: ownerName,
      role: "OWNER",
      propertyId: propertyRef.id,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ ok: true, propertyId: propertyRef.id, uid: authUser.uid });
  } catch (err: any) {
    console.error("Create client failed:", err);
    const message =
      err?.code === "auth/email-already-exists"
        ? "That email is already in use by another account."
        : "Failed to create client.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
