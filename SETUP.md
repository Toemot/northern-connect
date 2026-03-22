# Northern Connect — Project Setup & Reference

**Last amended:** 2026-03-22
**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Supabase · Vercel

---

## Quick Start (Local Development)

```bash
cd C:\Users\olasu\northern-connect
npm run dev
```

Open **http://localhost:3000**

> The dev server must be started fresh each session. Keep the terminal window open while working.

---

## Project Location

| Item | Path |
|---|---|
| Project root | `C:\Users\olasu\northern-connect` |
| Documentation | `C:\Users\olasu\OneDrive\Documents\NC app\` |
| Git repo | https://github.com/Toemot/northern-connect |

---

## Supabase

| Item | Value |
|---|---|
| Organisation | Toemot's Org |
| Project name | NC app |
| Project ID | `eafzmqbynbanavdcwuah` |
| Dashboard | https://supabase.com/dashboard/project/eafzmqbynbanavdcwuah |
| API URL | `https://eafzmqbynbanavdcwuah.supabase.co` |
| Region | ca-central-1 (Montreal, Canada) — **BC PIPA compliant** |
| SQL Editor | https://supabase.com/dashboard/project/eafzmqbynbanavdcwuah/sql/new |
| Table Editor | https://supabase.com/dashboard/project/eafzmqbynbanavdcwuah/editor |
| Auth users | https://supabase.com/dashboard/project/eafzmqbynbanavdcwuah/auth/users |

### Creating an Agency User (Manual — Beta Only)

1. Go to Auth → Users → Invite User (enter their email)
2. Go to Table Editor → `organization` → Insert Row (enter their org details)
3. Note the new `organization.id` UUID
4. Go to Table Editor → `agency_user` → Insert Row:
   - `id` = the UUID from the Auth user
   - `organization_id` = the org UUID from step 3
   - `display_name` = their name
   - `role` = `editor` (or `admin`)

### Running Migrations

If you need to re-run or update the schema:

```bash
cd C:\Users\olasu\northern-connect
npx supabase db push --db-url "postgresql://postgres:rLSDixQITLV1oQoh@db.eafzmqbynbanavdcwuah.supabase.co:5432/postgres"
```

Migration files are in `supabase/migrations/`.

---

## Environment Variables

These live in `.env.local` (gitignored — never committed).

| Variable | Purpose | Where used |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API URL | Client + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public read key (scoped by RLS) | Client + server |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS — server-side only | Server only |
| `NEXT_PUBLIC_APP_URL` | Base URL of the app | Redirects |

> **Security:** `SUPABASE_SERVICE_ROLE_KEY` must never appear in a `NEXT_PUBLIC_` variable. Rotate this key from Supabase → Settings → API after any session where it was shared.

### `.env.local` template (fill in values):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://eafzmqbynbanavdcwuah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from Supabase Settings → API>
SUPABASE_SERVICE_ROLE_KEY=<service_role key — rotate after sharing>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Vercel Deployment

| Item | Value |
|---|---|
| GitHub repo | https://github.com/Toemot/northern-connect |
| Framework | Next.js (auto-detected) |
| Deploy trigger | Every `git push` to `main` |

### Environment Variables to Set in Vercel

Go to Vercel → Project → Settings → Environment Variables and add:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://eafzmqbynbanavdcwuah.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(anon key)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(service_role key)* |
| `NEXT_PUBLIC_APP_URL` | *(your Vercel staging URL, e.g. https://northern-connect-xyz.vercel.app)* |

After setting variables, trigger a redeploy: Vercel → Deployments → Redeploy.

---

## Project Structure

```
northern-connect/
├── src/
│   ├── app/
│   │   ├── page.tsx                        # Home / Search (public)
│   │   ├── layout.tsx                      # Root layout + skip-nav
│   │   ├── globals.css                     # Tailwind + focus styles
│   │   ├── (public)/
│   │   │   ├── listings/[id]/page.tsx      # Service detail page
│   │   │   └── events/page.tsx             # Events list
│   │   ├── (agency)/
│   │   │   ├── dashboard/page.tsx          # Agency dashboard
│   │   │   └── listings/new/page.tsx       # Add new listing form
│   │   └── auth/
│   │       ├── login/page.tsx              # Agency login
│   │       └── signout/route.ts            # Sign out handler
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Badge.tsx                   # Status badges
│   │   │   └── Button.tsx                  # Accessible button
│   │   ├── listings/
│   │   │   ├── ListingCard.tsx             # Listing card on home screen
│   │   │   └── CategoryChips.tsx           # Filter chips
│   │   └── events/
│   │       └── EventCard.tsx               # Event card
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                   # Browser Supabase client
│   │   │   └── server.ts                   # Server Supabase client (SSR)
│   │   └── utils.ts                        # cn(), formatDate(), etc.
│   └── types/
│       └── database.ts                     # TypeScript types for all 6 tables
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql          # Full schema + RLS + seed data
├── public/
│   └── manifest.json                       # PWA manifest
├── .env.local                              # Secrets — gitignored
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Database Tables

| Table | Purpose | RLS |
|---|---|---|
| `organization` | An agency or org with public contact info | Public reads active; agency updates own |
| `listing` | A service entry (food, shelter, mental health…) | Public reads active only; agency manages own |
| `event` | A community event or activity | Public reads active; agency manages own |
| `agency_user` | Links Supabase Auth user to an org | Read own record only |
| `category` | Lookup table — 16 categories (seeded) | Public read all |
| `indigenous_consent` | Consent records per OCAP/DRIPA | Admin only |

---

## Common Commands

```bash
# Start dev server
npm run dev

# Build for production (also runs TypeScript check)
npm run build

# Push database migrations
npx supabase db push --db-url "postgresql://postgres:<password>@db.eafzmqbynbanavdcwuah.supabase.co:5432/postgres"

# Push code to GitHub (triggers Vercel auto-deploy)
git add .
git commit -m "your message"
git push
```

---

## What Is and Is Not Built

### Built (Sprint 1 complete)
- [x] Full database schema (6 tables, RLS, seed data)
- [x] Home / Search screen — live Supabase query, category chips, listing cards
- [x] Service detail page — SSR, contact actions
- [x] Events page — date filter tabs
- [x] Agency login — Supabase Auth
- [x] Agency dashboard — stats, listings table, verified-date warnings
- [x] Add New Listing form
- [x] PWA manifest
- [x] WCAG skip navigation, accessible focus styles
- [x] Git repo on GitHub

### Not Yet Built (Sprints 2–5)
- [ ] Map view (Leaflet + OpenStreetMap)
- [ ] Edit listing form (agency)
- [ ] Add/Edit event form (agency)
- [ ] Mark as Verified button
- [ ] Organization profile edit page
- [ ] 50 verified listings (manual data entry)
- [ ] Plausible.io analytics
- [ ] Vercel deployment working (pending TypeScript fix — see below)

---

## Known Issues

| Issue | Status | Fix |
|---|---|---|
| Vercel build fails — TypeScript error in dashboard/page.tsx | Fixed in commit after 2026-03-22 | Separated joined query into two queries with explicit local types |
| `localhost:3000` stops when terminal closes | Expected behaviour | Run `npm run dev` again each session |
| service_role key was shared in chat session | Rotate it | Supabase → Settings → API → Regenerate service_role key |

---

## Next Steps (Priority Order)

1. **Rotate the Supabase service_role key** — [Settings → API](https://supabase.com/dashboard/project/eafzmqbynbanavdcwuah/settings/api) → Regenerate → update `.env.local` and Vercel env vars
2. **Connect Vercel** — import repo, add env vars, deploy (see Vercel section above)
3. **Build map view** — Sprint 2 (Leaflet + OpenStreetMap)
4. **Build Edit Listing + Mark as Verified** — Sprint 3
5. **Enter 50 listings** — call each org to verify before activating
6. **Indigenous consent outreach** — letters to Lheidli T'enneh, PGNAFC, CSFS
7. **Incorporate BC Society** — bcregistry.gov.bc.ca

---

*See also: [PHASE2_BUILD_MVP.md](../NC app/PHASE2_BUILD_MVP.md) · [PHASE3_SOFT_BETA.md](../NC app/PHASE3_SOFT_BETA.md) · [HINDRANCES.md](../NC app/HINDRANCES.md)*
