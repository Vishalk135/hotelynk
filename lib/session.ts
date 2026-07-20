import { cookies } from "next/headers";
import { adminAuth, adminDb } from "./firebase-admin";

export type Role = "SUPER_ADMIN" | "OWNER" | "STAFF";

export type CurrentUser = {
  uid: string;
  email: string | null;
  name: string;
  role: Role;
  // null only for SUPER_ADMIN, who isn't tied to one client's property.
  propertyId: string | null;
};

const SESSION_COOKIE_NAME = "hotelynk_session";
export { SESSION_COOKIE_NAME };

/**
 * Reads and verifies the session cookie, then fetches the matching
 * user profile document from Firestore. Returns null if not signed in
 * or the cookie is invalid/expired — callers should redirect to /login.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const profileDoc = await adminDb.collection("users").doc(decoded.uid).get();
    const profile = profileDoc.data();

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: profile?.name ?? decoded.email ?? "User",
      role: (profile?.role as Role) ?? "STAFF",
      propertyId: profile?.propertyId ?? null,
    };
  } catch {
    return null;
  }
}
