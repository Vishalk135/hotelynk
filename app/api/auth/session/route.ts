import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { SESSION_COOKIE_NAME } from "@/lib/session";

// 5 days, matching the cookie maxAge below.
const SESSION_EXPIRY_MS = 60 * 60 * 24 * 5 * 1000;

export async function POST(req: NextRequest) {
  const { idToken } = await req.json().catch(() => ({ idToken: null }));

  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
  }

  try {
    // Verifying first gives a clearer error than letting a bad token
    // fail inside createSessionCookie.
    await adminAuth.verifyIdToken(idToken);

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRY_MS,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_EXPIRY_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    return res;
  } catch (err) {
    console.error("Session creation failed:", err);
    return NextResponse.json({ error: "Could not create session." }, { status: 401 });
  }
}
