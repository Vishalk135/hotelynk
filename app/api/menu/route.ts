import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/session";

const VALID_CATEGORIES = ["Mains", "Snacks", "Drinks"];

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.propertyId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { name, price, stock, category } = body ?? {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Item name is required." }, { status: 400 });
  }
  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum <= 0) {
    return NextResponse.json({ error: "Enter a valid price." }, { status: 400 });
  }
  const stockNum = Number(stock);
  if (!Number.isFinite(stockNum) || stockNum < 0) {
    return NextResponse.json({ error: "Enter a valid stock quantity." }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  const ref = adminDb.collection("menuItems").doc();
  await ref.set({
    propertyId: user.propertyId,
    name: name.trim(),
    price: Math.round(priceNum),
    stock: Math.round(stockNum),
    // maxStock anchors the stock-level bar in the POS UI — starting stock
    // doubled gives reasonable headroom until the owner restocks for real.
    maxStock: Math.max(Math.round(stockNum) * 2, 10),
    category,
    createdAt: Timestamp.now(),
  });

  return NextResponse.json({ ok: true, itemId: ref.id });
}
