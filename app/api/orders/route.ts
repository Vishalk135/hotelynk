import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/session";

type CartLine = { menuItemId: string; quantity: number };

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.propertyId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const lines: CartLine[] = body?.lines ?? [];

  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  try {
    const orderId = await adminDb.runTransaction(async (tx) => {
      let total = 0;
      const orderItems: { menuItemId: string; name: string; quantity: number; priceEach: number }[] = [];

      // Firestore transactions require all reads before any writes.
      const menuRefs = lines.map((l) => adminDb.collection("menuItems").doc(l.menuItemId));
      const menuSnaps = await Promise.all(menuRefs.map((ref) => tx.get(ref)));

      menuSnaps.forEach((snap, i) => {
        if (!snap.exists) throw new Error(`Menu item not found.`);
        const data = snap.data()!;
        // Critical: prevents ordering another client's menu items.
        if (data.propertyId !== user.propertyId) throw new Error(`Menu item not found.`);
        const qty = lines[i].quantity;
        if (data.stock < qty) throw new Error(`Not enough stock for ${data.name}.`);

        total += data.price * qty;
        orderItems.push({ menuItemId: snap.id, name: data.name, quantity: qty, priceEach: data.price });
      });

      menuSnaps.forEach((snap, i) => {
        tx.update(menuRefs[i], { stock: snap.data()!.stock - lines[i].quantity });
      });

      const orderRef = adminDb.collection("orders").doc();
      tx.set(orderRef, {
        propertyId: user.propertyId,
        total,
        items: orderItems,
        createdAt: Timestamp.now(),
      });

      return orderRef.id;
    });

    return NextResponse.json({ ok: true, orderId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
