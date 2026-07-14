export const rooms = [
  { id: "R1", name: "Villa 1 · Pool", guest: null, status: "Vacant", price: 6500, nights: null },
  { id: "R2", name: "Villa 2 · Sea View", guest: "Marta Silva", status: "Checked in", price: 8200, nights: "12–15 Jul" },
  { id: "R3", name: "Villa 3 · Garden", guest: "Arjun Nair", status: "Checked in", price: 5400, nights: "10–14 Jul" },
  { id: "R4", name: "Villa 4 · Garden", guest: "Tom & Ella Whitfield", status: "Arriving today", price: 5400, nights: "13–18 Jul" },
  { id: "R5", name: "Room 5 · Standard", guest: null, status: "Housekeeping", price: 3200, nights: null },
  { id: "R6", name: "Room 6 · Standard", guest: "Priya Kamat", status: "Departing today", price: 3200, nights: "9–13 Jul" },
  { id: "R7", name: "Villa 7 · Sea View", guest: "Daniel Kruger", status: "Checked in", price: 8200, nights: "11–16 Jul" },
  { id: "R8", name: "Room 8 · Standard", guest: null, status: "Vacant", price: 3200, nights: null },
];

export const channels = [
  {
    name: "Airbnb",
    status: "Connected",
    lastSync: "2 minutes ago",
    listings: 8,
    color: "#E1592A",
  },
  {
    name: "Booking.com",
    status: "Connected",
    lastSync: "2 minutes ago",
    listings: 8,
    color: "#2E8FB0",
  },
  {
    name: "MakeMyTrip",
    status: "Connected",
    lastSync: "6 minutes ago",
    listings: 6,
    color: "#E3A62D",
  },
];

export const rateTable = [
  { room: "Standard Room", base: 3200, airbnb: 3200, booking: 3200, mmt: 3350 },
  { room: "Garden Villa", base: 5400, airbnb: 5400, booking: 5400, mmt: 5600 },
  { room: "Sea View Villa", base: 8200, airbnb: 8200, booking: 8200, mmt: 8500 },
];

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  stock: number;
  maxStock: number;
  category: string;
};

export const menu: MenuItem[] = [
  { id: "m1", name: "Prawn Curry Rice", price: 380, stock: 14, maxStock: 30, category: "Mains" },
  { id: "m2", name: "Fish Thali", price: 450, stock: 9, maxStock: 25, category: "Mains" },
  { id: "m3", name: "Chicken Xacuti", price: 420, stock: 18, maxStock: 25, category: "Mains" },
  { id: "m4", name: "Bhaji Pav", price: 120, stock: 22, maxStock: 40, category: "Snacks" },
  { id: "m5", name: "Calamari Fry", price: 340, stock: 3, maxStock: 20, category: "Snacks" },
  { id: "m6", name: "Kingfisher (large)", price: 220, stock: 40, maxStock: 60, category: "Drinks" },
  { id: "m7", name: "Feni Sour", price: 280, stock: 16, maxStock: 30, category: "Drinks" },
  { id: "m8", name: "Watermelon Juice", price: 150, stock: 25, maxStock: 30, category: "Drinks" },
];

export const staff = [
  { id: "s1", name: "Rohan D'Souza", role: "Manager", status: "On duty", shift: "9 AM – 6 PM" },
  { id: "s2", name: "Sunita Naik", role: "Housekeeping", status: "On duty", shift: "8 AM – 4 PM" },
  { id: "s3", name: "Vishal Gaonkar", role: "Front desk", status: "On duty", shift: "2 PM – 10 PM" },
  { id: "s4", name: "Meena Fernandes", role: "Chef", status: "Off", shift: "—" },
  { id: "s5", name: "Ajay Kunkolienkar", role: "Server", status: "On leave", shift: "—" },
  { id: "s6", name: "Divya Prabhu", role: "Housekeeping", status: "On duty", shift: "8 AM – 4 PM" },
];

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const scheduleGrid: Record<string, boolean[]> = {
  "Rohan D'Souza": [true, true, true, true, true, false, false],
  "Sunita Naik": [true, true, false, true, true, true, false],
  "Vishal Gaonkar": [false, true, true, true, true, true, true],
  "Meena Fernandes": [true, true, true, false, false, true, true],
  "Ajay Kunkolienkar": [false, false, false, false, false, false, false],
  "Divya Prabhu": [true, false, true, true, false, true, true],
};

export const revenueTrend = [
  { day: "Mon", revenue: 42000 },
  { day: "Tue", revenue: 38500 },
  { day: "Wed", revenue: 51000 },
  { day: "Thu", revenue: 47500 },
  { day: "Fri", revenue: 63000 },
  { day: "Sat", revenue: 78500 },
  { day: "Sun", revenue: 71000 },
];

export const activity = [
  { text: "Villa 4 · Garden booked via Airbnb for 13–18 Jul", time: "6 min ago", kind: "booking" },
  { text: "Rates synced across Airbnb, Booking.com, MakeMyTrip", time: "12 min ago", kind: "sync" },
  { text: "Calamari Fry stock is low (3 left)", time: "34 min ago", kind: "stock" },
  { text: "Vishal Gaonkar clocked in for front desk shift", time: "1 hr ago", kind: "staff" },
  { text: "Room 6 marked for housekeeping after checkout", time: "2 hr ago", kind: "booking" },
];
