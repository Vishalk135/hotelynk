import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/session";
import PosClient from "./pos-client";

export default async function PosPage() {
  const user = await getCurrentUser();
  const snap = await adminDb
    .collection("menuItems")
    .where("propertyId", "==", user!.propertyId!)
    .orderBy("name", "asc")
    .get();
  const menu = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
  return <PosClient initialMenu={menu} />;
}
