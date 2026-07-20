// Seeds Firebase with:
//   1. A SUPER_ADMIN account (you) - can access /admin to onboard clients.
//   2. One demo client property with an OWNER login, so you have
//      something to test the actual dashboard with immediately.
//
// Run with: npm run db:seed
// Requires .env.local to have your Firebase Admin credentials set
// (see .env.local.example and the README).

import { adminAuth, adminDb } from "../lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

async function getOrCreateAuthUser(email: string, password: string, displayName: string) {
  try {
    return await adminAuth.getUserByEmail(email);
  } catch {
    return adminAuth.createUser({ email, password, displayName });
  }
}

async function main() {
  console.log("Seeding Firebase...");

  // --- 1. Super-admin (platform owner - you) ---
  const superAdmin = await getOrCreateAuthUser("admin@hotelynk.in", "hotelynkadmin123", "Hotelynk Admin");
  await adminDb.collection("users").doc(superAdmin.uid).set({
    email: "admin@hotelynk.in",
    name: "Hotelynk Admin",
    role: "SUPER_ADMIN",
    propertyId: null,
    createdAt: Timestamp.now(),
  });

  // --- 2. One demo client property ---
  const propertyRef = adminDb.collection("properties").doc();
  const propertyId = propertyRef.id;
  await propertyRef.set({
    name: "ABC Villas",
    ownerEmail: "owner@hotelynk.in",
    createdAt: Timestamp.now(),
  });

  const owner = await getOrCreateAuthUser("owner@hotelynk.in", "hotelynk123", "Vishal Kumbhar");
  await adminDb.collection("users").doc(owner.uid).set({
    email: "owner@hotelynk.in",
    name: "Vishal Kumbhar",
    role: "OWNER",
    propertyId,
    createdAt: Timestamp.now(),
  });

  // --- Rooms ---
  const roomData = [
    { name: "Villa 1 · Pool", price: 6500, status: "VACANT" },
    { name: "Villa 2 · Sea View", price: 8200, status: "CHECKED_IN" },
    { name: "Villa 3 · Garden", price: 5400, status: "CHECKED_IN" },
    { name: "Villa 4 · Garden", price: 5400, status: "ARRIVING" },
    { name: "Room 5 · Standard", price: 3200, status: "HOUSEKEEPING" },
    { name: "Room 6 · Standard", price: 3200, status: "DEPARTING" },
    { name: "Villa 7 · Sea View", price: 8200, status: "CHECKED_IN" },
    { name: "Room 8 · Standard", price: 3200, status: "VACANT" },
  ];
  const roomRefs: FirebaseFirestore.DocumentReference[] = [];
  for (const r of roomData) {
    const ref = adminDb.collection("rooms").doc();
    await ref.set({ ...r, propertyId });
    roomRefs.push(ref);
  }

  const now = new Date();
  const inDays = (n: number) => new Date(now.getTime() + n * 86400000);
  await adminDb.collection("bookings").add({
    propertyId,
    roomId: roomRefs[1].id,
    guestName: "Marta Silva",
    checkIn: Timestamp.fromDate(inDays(-2)),
    checkOut: Timestamp.fromDate(inDays(3)),
    createdAt: Timestamp.now(),
  });
  await adminDb.collection("bookings").add({
    propertyId,
    roomId: roomRefs[3].id,
    guestName: "Tom & Ella Whitfield",
    checkIn: Timestamp.fromDate(now),
    checkOut: Timestamp.fromDate(inDays(5)),
    createdAt: Timestamp.now(),
  });

  // --- Menu ---
  const menuData = [
    { name: "Prawn Curry Rice", price: 380, stock: 14, maxStock: 30, category: "Mains" },
    { name: "Fish Thali", price: 450, stock: 9, maxStock: 25, category: "Mains" },
    { name: "Chicken Xacuti", price: 420, stock: 18, maxStock: 25, category: "Mains" },
    { name: "Bhaji Pav", price: 120, stock: 22, maxStock: 40, category: "Snacks" },
    { name: "Calamari Fry", price: 340, stock: 3, maxStock: 20, category: "Snacks" },
    { name: "Kingfisher (large)", price: 220, stock: 40, maxStock: 60, category: "Drinks" },
    { name: "Feni Sour", price: 280, stock: 16, maxStock: 30, category: "Drinks" },
    { name: "Watermelon Juice", price: 150, stock: 25, maxStock: 30, category: "Drinks" },
  ];
  const menuRefs: { ref: FirebaseFirestore.DocumentReference; price: number; name: string }[] = [];
  for (const m of menuData) {
    const ref = adminDb.collection("menuItems").doc();
    await ref.set({ ...m, propertyId });
    menuRefs.push({ ref, price: m.price, name: m.name });
  }

  // --- A week of order history, so the revenue chart has real data ---
  const ordersPerDay = [3, 2, 4, 3, 5, 7, 6];
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const count = ordersPerDay[6 - dayOffset];
    for (let i = 0; i < count; i++) {
      const picked = [...menuRefs].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 3));
      const items = picked.map((m) => ({
        menuItemId: m.ref.id,
        name: m.name,
        quantity: 1 + Math.floor(Math.random() * 3),
        priceEach: m.price,
      }));
      const total = items.reduce((s, l) => s + l.priceEach * l.quantity, 0);
      const createdAt = new Date(now.getTime() - dayOffset * 86400000 - Math.random() * 6 * 3600000);
      await adminDb.collection("orders").add({ propertyId, total, items, createdAt: Timestamp.fromDate(createdAt) });
    }
  }

  // --- Staff ---
  const staffData = [
    { name: "Vishal Kumbhar", role: "Manager", status: "ON_DUTY", shift: "9 AM – 6 PM", shifts: [true, true, true, true, true, false, false] },
    { name: "Sunita Naik", role: "Housekeeping", status: "ON_DUTY", shift: "8 AM – 4 PM", shifts: [true, true, false, true, true, true, false] },
    { name: "Vishal Gaonkar", role: "Front desk", status: "ON_DUTY", shift: "2 PM – 10 PM", shifts: [false, true, true, true, true, true, true] },
    { name: "Meena Fernandes", role: "Chef", status: "OFF", shift: null, shifts: [true, true, true, false, false, true, true] },
    { name: "Ajay Kunkolienkar", role: "Server", status: "ON_LEAVE", shift: null, shifts: [false, false, false, false, false, false, false] },
    { name: "Divya Prabhu", role: "Housekeeping", status: "ON_DUTY", shift: "8 AM – 4 PM", shifts: [true, false, true, true, false, true, true] },
  ];
  for (const s of staffData) {
    await adminDb.collection("staff").add({ ...s, propertyId });
  }

  console.log("\nSeed complete.\n");
  console.log("Super-admin login (use this to access /admin):");
  console.log("  admin@hotelynk.in / hotelynkadmin123\n");
  console.log("Demo client login (use this to see the property dashboard):");
  console.log("  owner@hotelynk.in / hotelynk123\n");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
