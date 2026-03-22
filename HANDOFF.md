# Northern Connect — Handoff Document

**Last updated:** 2026-03-22
**Status:** App scaffolded and locally runnable. DB migration pending. Vercel deployment has 1 remaining TypeScript error to resolve.

---

## What Has Been Built

### Project Location
```
C:\Users\olasu\northern-connect\
```

### GitHub
```
https://github.com/Toemot/northern-connect
Branch: main
```

### Tech Stack
- **Framework:** Next.js 15 (App Router, TypeScript, Tailwind CSS)
- **Database:** Supabase — PostgreSQL + Auth + RLS
- **Hosting (target):** Vercel
- **Maps:** Leaflet + OpenStreetMap
- **UI primitives:** Radix UI
- **Analytics:** Plausible.io (to be added)

---

## Supabase Project Details

| Field | Value |
|---|---|
| Organisation | Toemot's Org |
| Project name | NC app |
| Project ID | `eafzmqbynbanavdcwuah` |
| Dashboard URL | https://supabase.com/dashboard/project/eafzmqbynbanavdcwuah |
| API URL | `https://eafzmqbynbanavdcwuah.supabase.co` |
| Region | **Confirm this is ca-central-1 (Montreal)** — required for BC PIPA compliance |
| DB password | Stored in your password manager — do not commit |

> **IMPORTANT:** If Supabase region is NOT ca-central-1, the app must be recreated in the correct region before any personal data is stored. This is a legal requirement under BC PIPA (SBC 2003 c. 63).

---

## Environment Variables

These are already in `.env.local` (not committed to Git — correct, this file is gitignored).

```env
NEXT_PUBLIC_SUPABASE_URL=https://eafzmqbynbanavdcwuah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  (see .env.local)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...       (see .env.local — server-side only)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Never commit `.env.local` to Git. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code.**

---

## How to Run the App Locally

### First time only — install dependencies

```powershell
cd C:\Users\olasu\northern-connect
npm install
```

### Every time — start the dev server

**Option A — double-click `start-dev.bat`** (recommended)
File is at `C:\Users\olasu\northern-connect\start-dev.bat`. Double-click it. It kills any stale Node processes, clears the cache, and starts the server.

**Option B — PowerShell manually**

```powershell
# Kill any old Node processes first
taskkill /F /IM node.exe /T

# Delete stale cache (only needed if server was previously stuck)
Remove-Item -Recurse -Force C:\Users\olasu\northern-connect\.next -ErrorAction SilentlyContinue

# Start
cd C:\Users\olasu\northern-connect
npm run dev
```

### Expected output

```
▲ Next.js 15.5.14
- Local:   http://localhost:3000
✓ Starting...
✓ Ready in 4.2s
```

Then open **http://localhost:3000** in your browser.

### If the server gets stuck on "Starting..."

This is a Windows file-lock issue on `.next\trace`. Fix:

```powershell
# Run in PowerShell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep 2
Remove-Item -Recurse -Force C:\Users\olasu\northern-connect\.next -ErrorAction SilentlyContinue
cd C:\Users\olasu\northern-connect
npm run dev
```

---

## Critical Pending Step — Run the Database Migration

**The app will load but show no data until this is done.**

The database schema (6 tables + 16 category seed rows) needs to be applied to Supabase.

### Steps

1. Open the migration file:
   `C:\Users\olasu\northern-connect\supabase\migrations\001_initial_schema.sql`

2. Copy the entire contents of that file.

3. Go to:
   https://supabase.com/dashboard/project/eafzmqbynbanavdcwuah/sql/new

4. Paste the SQL and click **Run**.

5. You should see: `Success. No rows returned.`

### What this creates

| Table | Purpose |
|---|---|
| `organization` | Agency/org profiles |
| `listing` | Service listings (the main content) |
| `event` | Community events |
| `agency_user` | Agency staff accounts (linked to Supabase Auth) |
| `category` | 16 preset categories (seeded automatically) |
| `indigenous_consent` | Consent records for Indigenous orgs |

After running the migration, the home page will show 16 category filter chips.

---

## What Is Working (Code Complete)

| Screen / Feature | Route | Status |
|---|---|---|
| Home / Search | `/` | ✅ Built |
| Service detail page | `/listings/[id]` | ✅ Built |
| Events list | `/events` | ✅ Built |
| Agency login | `/auth/login` | ✅ Built |
| Agency dashboard | `/dashboard` | ✅ Built |
| Add new listing | `/listings/new` | ✅ Built |
| Sign out | `/auth/signout` | ✅ Built |
| Supabase client (browser) | `src/lib/supabase/client.ts` | ✅ Built |
| Supabase client (server) | `src/lib/supabase/server.ts` | ✅ Built |
| Database types | `src/types/database.ts` | ✅ Built |
| Shared UI components | `src/components/ui/` | ✅ Built |
| PWA manifest | `public/manifest.json` | ✅ Built |

---

## Vercel Deployment — Status and Fix Needed

Deployment is failing with **1 TypeScript error** remaining (after 2 were already fixed).

### Current error (as of 2026-03-22)

```
./src/lib/supabase/server.ts
Type error: Parameter 'cookiesToSet' implicitly has an 'any' type.
```

The fix has been applied in the code but needs to be committed and pushed:

```powershell
cd C:\Users\olasu\northern-connect
git add src/lib/supabase/server.ts
git commit -m "fix: type cookiesToSet parameter in Supabase server client"
git push
```

Then retry the Vercel deployment.

### Vercel setup (when ready to redeploy)

1. Go to https://vercel.com → New Project
2. Import `Toemot/northern-connect` from GitHub
3. Framework: Next.js (auto-detected)
4. Add environment variables (all four from `.env.local`)
5. Click Deploy

The Vercel deployment auto-deploys on every `git push` to `main` once connected.

---

## What Still Needs to Be Done

### Before the app is functional locally

- [ ] Run the DB migration (see above — 5-minute task)

### Before Vercel deployment works

- [ ] Commit and push the `server.ts` fix (see above)
- [ ] Add all 4 environment variables in Vercel dashboard
- [ ] Redeploy

### Before closed beta (Phase 3)

- [ ] 50 listings entered and verified (call each org)
- [ ] Indigenous consent outreach initiated (letters sent to Lheidli T'enneh, PGNAFC, CSFS)
- [ ] BC Society incorporation filed
- [ ] NH Conflict of Interest clearance obtained in writing
- [ ] Accessibility audit (WCAG 2.1 AA) — see `PHASE3_SOFT_BETA.md`
- [ ] Privacy audit (BC PIPA) — see `PHASE3_SOFT_BETA.md`
- [ ] Legal review of Terms of Service and Privacy Policy
- [ ] Indigenous consent confirmed and `indigenous_consent` table populated

---

## Project File Index

| File | Purpose |
|---|---|
| `HANDOFF.md` | This file — resume point and instructions |
| `HINDRANCES.md` | All blockers ranked by severity |
| `PHASE2_BUILD_MVP.md` | Sprint plan, 50 listings strategy, dev responsibilities |
| `PHASE3_SOFT_BETA.md` | Beta launch gates, audit processes, Indigenous consent how-to |
| `supabase/migrations/001_initial_schema.sql` | Full DB schema — run this in Supabase SQL editor |
| `start-dev.bat` | One-click dev server start (Windows) |
| `.env.local` | Environment variables — not committed to Git |
| `src/app/(public)/` | Public-facing screens (home, listing detail, events) |
| `src/app/(agency)/` | Agency dashboard and listing management |
| `src/app/auth/` | Login and sign-out routes |
| `src/lib/supabase/` | Supabase client setup |
| `src/types/database.ts` | TypeScript types for all DB tables |

---

## Key Contacts and Accounts

| Service | Login / Access |
|---|---|
| GitHub | https://github.com/Toemot |
| Supabase | https://supabase.com/dashboard/project/eafzmqbynbanavdcwuah |
| Vercel | Log in with GitHub (Toemot) |

---

*To resume: open this file, run the dev server (`start-dev.bat`), run the DB migration, push the server.ts fix, and redeploy to Vercel.*
