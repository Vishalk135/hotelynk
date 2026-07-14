# Hotelynk — landing page

A single-page marketing site for **Hotelynk**, a hospitality management
suite (bookings, channel sync, POS, staffing) for Goa's guesthouses,
villas, shacks and water sports operators.

Built with Next.js 14 (App Router) + TypeScript + Tailwind CSS. Fully
responsive from small phones up to wide desktop screens.

## Run it locally

You need [Node.js](https://nodejs.org) 18.18+ installed.

```bash
npm install
```

### Set up email delivery (required for the "Get in touch" form)

The form on the site sends an email to **vishalkumbhar124@gmail.com** every
time someone submits it, using [Resend](https://resend.com) (free tier:
3,000 emails/month, no credit card needed).

1. Sign up at [resend.com](https://resend.com) and grab an API key from the
   dashboard.
2. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
3. Paste your key into `.env.local`:
   ```
   RESEND_API_KEY=re_your_actual_key
   ```
4. That's it — `npm run dev` will now actually send emails.

The email currently sends **from** Resend's shared test address
(`onboarding@resend.dev`), which works immediately with no extra setup.
Once you verify your own domain (`hotelynk.in`) on Resend — a few DNS
records, same idea as the Vercel domain setup — you can change the `from`
address in `app/api/contact/route.ts` to something like
`Hotelynk <hello@hotelynk.in>` so it doesn't look like a test email.

Each email is set to **reply-to** the visitor's address, so you can hit
"Reply" in Gmail and it goes straight to them.

### Then run the dev server

```bash
npm run dev
```

Then open http://localhost:3000. The first `npm run dev` needs an internet
connection once, to fetch the Google Fonts (Space Grotesk, Inter,
JetBrains Mono) — after that they're cached locally by Next.js.

## Build for production

```bash
npm run build
npm start
```

## Where things live

- `app/page.tsx` — the whole page: nav, hero, pain points, the four
  product modules, "who it's for", founder note, waitlist section, footer.
- `app/waitlist-form.tsx` — the email capture form (client component).
  Right now it just confirms the email locally — wire the `handleSubmit`
  function up to your email provider (Mailchimp, a simple API route,
  Google Sheet, whatever you use) when you're ready to actually collect
  addresses.
- `app/layout.tsx` — fonts and page metadata (title/description for
  search and link previews).
- `app/globals.css` — base styles, focus states, reduced-motion handling.
- `tailwind.config.ts` — the design tokens: colors (`dusk`, `cream`,
  `mustard`, `azure`, `coral`) and fonts (Space Grotesk display,
  Inter body, JetBrains Mono for labels/data). Change the hex
  values here to re-theme the whole site.

## Easy edits

- **Copy**: everything is plain text in `app/page.tsx` — headline,
  module descriptions, pain points, founder quote.
- **Colors**: edit the hex values in `tailwind.config.ts` under
  `theme.extend.colors`.
- **Modules**: the four product cards come from the `MODULES` array near
  the top of `app/page.tsx` — add, remove, or reorder freely.
- **Waitlist destination**: point `waitlist-form.tsx`'s `handleSubmit` at
  a real endpoint when you have one.

## Deploying

The easiest path is [Vercel](https://vercel.com) (same company as
Next.js) — push this to a GitHub repo and import it there, or run
`npx vercel` from this folder. Any host that runs Node also works.

**Important:** `.env.local` is only for your machine and is never
uploaded (it's in `.gitignore`). On Vercel, add the same variable under
**Project Settings → Environment Variables**:
- Key: `RESEND_API_KEY`
- Value: your Resend API key

Without this, the live site's "Get in touch" form will show an error
instead of sending — the API route checks for the key and fails safely
rather than silently dropping submissions.
