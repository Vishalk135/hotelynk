# Hotelynk — landing page + real multi-tenant product

A hospitality management SaaS for Goa's guesthouses, villas, shacks and
water sports operators — bookings, POS, and staffing, all real and
backed by Firebase. Multiple client businesses ("properties") can use
the same deployment, each only seeing their own data.

Built with Next.js 14 (App Router) + TypeScript + Tailwind CSS +
Firebase (Auth + Firestore). Fully responsive.

## What's in this project

- **`/`** — the marketing site
- **`/login`** — sign in (used by both clients and you, the platform admin)
- **`/demo`** — the actual product dashboard a client uses (Bookings, POS,
  Staff, Channel Sync preview, AI assistant)
- **`/admin`** — **only visible to you** — where you onboard new client
  businesses and hand them their login

## How multi-tenancy works

Every client is a "property" in Firestore. Every user (an owner or staff
member) belongs to exactly one property via a `propertyId` field, except
you (the `SUPER_ADMIN`), who isn't tied to any single property. Every
database query in the app filters by the signed-in user's `propertyId`,
so Client A can never see Client B's rooms, bookings, orders, or staff.
There is **no public signup** — you create every client's login yourself
from `/admin`, matching the door-to-door onboarding approach you
described (you personally set up their rooms/menu/staff on your first
visit anyway).

## Run it locally

You need [Node.js](https://nodejs.org) 18.18+ installed.

```bash
npm install
cp .env.local.example .env.local
```

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → name it (e.g. "hotelynk") → create.
2. In the left sidebar: **Build → Authentication** → **Get started** → enable the **Email/Password** provider (toggle it on, save).
3. In the left sidebar: **Build → Firestore Database** → **Create database** → start in **production mode** (the app only ever talks to Firestore through the server-side Admin SDK, never directly from the browser, so the default locked-down rules are exactly right — you don't need to write any Firestore security rules).

### 2. Get your client config (safe to expose in the browser)

**Project Settings** (gear icon, top left) → scroll to **"Your apps"** → click the **`</>`** (web) icon → register an app (any nickname) → copy the `firebaseConfig` values into `.env.local` as the six `NEXT_PUBLIC_FIREBASE_*` variables.

### 3. Get your admin credentials (secret — server only)

**Project Settings → Service Accounts** → **Generate new private key** → downloads a JSON file. Open it and copy three values into `.env.local`:
- `project_id` → `FIREBASE_PROJECT_ID`
- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes — it contains `\n` characters)

Delete the downloaded JSON file once you've copied the values out, or make sure it never ends up committed (it's already covered by `.gitignore` as a safety net).

### 4. Seed your first accounts

```bash
npm run db:seed
```

This creates:
- **A super-admin account** (you): `admin@hotelynk.in` / `hotelynkadmin123` — this is what gets you into `/admin`
- **One demo client**, "Candolim Villas", with rooms, menu, staff, and a week of order history already in place: `owner@hotelynk.in` / `hotelynk123`

**Change both passwords** before this is anything other than a local test — there's no self-serve "change password" screen yet (see "What's not built yet" below).

### 5. Run it

```bash
npm run dev
```

Sign in at `/login` with either account above.

## Onboarding a real client

1. Log in as the super-admin (`admin@hotelynk.in`).
2. Go to `/admin`.
3. Fill in their business name, their name, an email, and a temporary password → **Create client**.
4. Copy the credentials shown and give them to the client (in person, matching your sales approach).
5. Log in as them (or have them log in) and manually add their real rooms, menu items, and staff — there's no bulk-import yet, so this is a hands-on onboarding step, same as you described doing in person anyway.

## What's real vs. what's still mock

- **Bookings, POS, and Staff** — fully real, backed by Firestore, scoped per client.
- **Channel sync (Airbnb/Booking.com/MakeMyTrip)** — still a visual mockup, on purpose. Real integration requires becoming an approved connectivity partner with each platform first — a business process, not something to code around. The page says so.
- **The AI assistant** — real in that it queries each client's actual Firestore data live. Not a general-purpose LLM though — it's keyword matching (see `app/api/assistant/route.ts`) recognizing a fixed set of question types.

## What's not built yet

- Self-serve password reset / "forgot password" (Firebase Auth supports this out of the box — `sendPasswordResetEmail` — just not wired into a UI yet)
- Staff accounts beyond the owner (the admin panel creates OWNER accounts; adding a way for an owner to invite their own staff with STAFF-level accounts is a natural next step)
- Editing/deleting rooms, menu items, or staff after creation (currently create-only for those, via manual Firestore edits or the Firebase Console)
- Payments/subscriptions (see the "what you'll need" notes from earlier in this project's planning — Razorpay would be the standard India-first choice)

## Set up email delivery (for the "Get in touch" form)

The marketing site's contact form sends an email via [Resend](https://resend.com):

1. Sign up free at [resend.com](https://resend.com), grab an API key.
2. Paste it into `.env.local` as `RESEND_API_KEY`.

It currently sends **from** Resend's shared test address, which only
delivers to the email your Resend account is registered under. Verify
your own domain on Resend (Dashboard → Domains) to send from
`hello@hotelynk.in` to anyone.

## Where things live

- `app/page.tsx` — the marketing site
- `app/login/page.tsx` — sign-in page
- `app/demo/` — the client-facing product dashboard
- `app/admin/` — the super-admin client-onboarding panel
- `app/api/` — all server-side routes (bookings, orders, assistant, auth session, admin client creation, contact form)
- `lib/firebase-client.ts` — browser-side Firebase (used only for sign-in)
- `lib/firebase-admin.ts` — server-side Firebase (used for all real data access)
- `lib/session.ts` — reads and verifies who's signed in on the server
- `scripts/seed-firebase.ts` — one-time script to create your first accounts
- `tailwind.config.ts` — design tokens (colors, fonts)

## A Firestore gotcha you'll likely hit once

Some queries combine a `where()` filter with an `orderBy()` on a
different field (e.g., "this property's bookings, newest first").
Firestore requires a composite index for that combination, and it
won't exist yet on a fresh project. The **first time** you hit a page
that needs one, you'll get an error in your terminal/browser console
with a direct link — click it, it pre-fills the index for you in the
Firebase Console, click **Create**, wait a minute or two, then reload.
This is a one-time step per query shape, not a bug.

## Build for production

```bash
npm run build
npm start
```

## Deploying

The easiest path is [Vercel](https://vercel.com) — push this to a
GitHub repo and import it there, or run `npx vercel` from this folder.

### Environment variables on Vercel

`.env.local` never gets uploaded (it's in `.gitignore`). Add every
variable from `.env.local` under **Project Settings → Environment
Variables** on Vercel — all the `NEXT_PUBLIC_FIREBASE_*` ones, all the
`FIREBASE_*` admin ones, and `RESEND_API_KEY`. Missing any of these
causes a specific, visible failure (login fails, data won't load, or
the contact form errors) rather than a silent one.

One Firebase-specific note: `FIREBASE_PRIVATE_KEY` contains real
newline characters in your local `.env.local`, but when pasting into
Vercel's UI, keep it exactly as one line with literal `\n` sequences —
the code in `lib/firebase-admin.ts` already converts those back to real
newlines at runtime, so this should just work, but it's worth knowing
if you ever see an auth error only in production.

Firebase itself needs no separate hosting decision — Firestore and
Auth are already fully hosted by Google regardless of where your
Next.js app runs.
