# Tržby — multi-user income ledger

A small Next.js app for tracking daily cash/card income (built for a barbershop,
works for any per-transaction income). Each person logs in and only sees their
own entries. Same keypad + receipt-style UI as the original single-file version,
now backed by a real database instead of browser storage.

## Stack
- Next.js 15 (App Router) + TypeScript
- Prisma + PostgreSQL
- NextAuth.js (email/password via Credentials provider)

## 1. Local setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:
- `DATABASE_URL` — a free Postgres database works fine. Easiest options:
  [Neon](https://neon.tech) or [Supabase](https://supabase.com) — create a
  project, copy the connection string.
- `NEXTAUTH_SECRET` — generate one with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev

Then create the tables and start the app:

```bash
npm run db:push
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/register` to create
the first account.

## 2. Deploy (Vercel + Neon, both free tier)

1. Push this project to a GitHub repo.
2. Create a free Postgres DB at neon.tech, copy the connection string.
3. Import the repo into Vercel.
4. In Vercel's project settings → Environment Variables, add `DATABASE_URL`,
   `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` (your Vercel deployment URL, e.g.
   `https://your-app.vercel.app`).
5. Deploy. On first deploy, run `npx prisma db push` once (via `vercel env pull`
   locally, or a one-off script) to create the tables in the production DB.

## How data is scoped per user

Every `Entry` row has a `userId` foreign key. The API routes
(`app/api/entries/*`) always read the logged-in user's id from the session
and filter by it — nobody can see or delete another user's entries.

## Extending it

- Multiple staff sharing one shop: add a `Shop` model, relate `User` to a
  `Shop`, and let an owner view all staff totals — the day/month grouping
  logic in `components/Tracker.tsx` already does most of the aggregation
  you'd need.
- Swap Credentials auth for Google/email-magic-link later if you want
  passwordless login — the `authOptions` in `lib/auth.ts` is the only place
  that needs to change.

## Note on this scaffold

This was built and typechecked (`tsc --noEmit` passes cleanly) in a sandboxed
environment without access to Prisma's binary CDN, so the Prisma query engine
itself couldn't be downloaded and test-run here. That step will run normally
the moment you do `npm install` on your own machine or deploy to Vercel —
just flagging it so you know that specific piece hasn't been end-to-end
verified yet. Run `npm run dev` locally first to confirm everything wires up
before you deploy.
