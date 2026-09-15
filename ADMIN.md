# Backend — stage 1 of 3

Next.js 16.3 · React 19.2 · Postgres. Node 20.9+ required.

The admin shell. Login, roles, users, media library, and a Postgres database with your Ahmedabad content imported.

**This stage does not yet include the post editor or the owner portal.** Those are stages 2 and 3, built on top of what's here. What exists now works end to end: you can sign in, add accounts, and upload images.

---

## Setup

You need a Postgres database. Neon (neon.tech) has a free tier that fits this site — create a project and copy the **pooled** connection string. `database/README.md` covers the alternatives.

```bash
cp .env.example .env
```

Fill in three things:

| Variable | Where it comes from |
|---|---|
| `DATABASE_URL` | the pooled Postgres string, e.g. `postgresql://user:pass@host/db?sslmode=require` |
| `SESSION_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_SITE_URL` | your domain, or `http://localhost:3000` in dev |

Use the **pooled** connection string, not the direct one — a serverless app opens and closes connections constantly and will exhaust direct limits.

Then:

```bash
npm install
npm run db:setup      # creates tables, imports 35 states + Ahmedabad
npm run db:admin      # creates your admin account
npm run dev
```

Sign in at `/admin/login`.

`db:setup` is safe to re-run — it skips the import if states already exist.

---

## What got imported

- **35 states** — all published, all live on the site
- **86 cities** — Ahmedabad published, the other 85 in the database but hidden
- **Ahmedabad** — 60 posts, 8 attractions, 12 events, 6 itineraries, 29 listings with their room/menu/package rows

**Every rating is 0.0 and every review count is 0.** The invented numbers are gone. Real reviews will build them.

The other 85 cities exist as rows so you can publish them one at a time from the admin. Their state hubs stay live and list only published cities — so `/kerala` works and shows nothing under it until you publish Kochi.

---

## Roles

| Role | Can do |
|---|---|
| **admin** | Everything, including users and roles |
| **editor** | Write, publish, moderate, manage listings — no user management |
| **owner** | One business: photos, prices, rooms/menu/packages, reply to reviews |
| **traveller** | Review and upload photos, once email is confirmed |

You cannot demote or delete your own admin account — that's deliberate, it's the lockout guard.

---

## How claims will work

Built into `src/lib/auth.ts`, used by the owner portal in stage 3:

An owner signs up freely. When they claim a listing, `domainMatches()` compares their email domain against the listing's website. `booking@houseofmg.com` claiming The House of MG auto-approves. Anything else — including every Gmail address — queues for you in `/admin/claims`.

Free email providers are explicitly excluded, otherwise the check would be meaningless.

---

## Email

Brevo, as chosen. Add `BREVO_API_KEY` and `EMAIL_FROM` to `.env`.

**Without a key, emails log to the server console instead of sending.** Development works with no setup, and nothing fails silently.

For deliverability, add Brevo's SPF and DKIM records to your domain's DNS. Without them, password resets land in spam.

---

## Uploads

Images go to `public/uploads/YYYY/MM/`, resized to 1800px wide and converted to WebP, with a 400px square thumbnail. Originals are discarded — shared hosting disk is finite and originals are the fastest way to fill it.

Caps: **50 photos per listing for owners, 10 per review for travellers.**

One caveat: if your host rebuilds the container on deploy, `public/uploads` can be wiped. Check whether yours has persistent storage. If it doesn't, move to Cloudflare R2 or Supabase Storage — `src/lib/upload.ts` is the only file that changes.

---

## What's next

**Stage 2 — the editor.** Rich text with Tiptap, image insertion from the media library, draft and publish, plus admin screens for attractions, events, itineraries, listings and cities. This is what lets you publish the 20+ posts per section you described.

**Stage 3 — the owner portal.** Signup, email verification, claims, and the six-card dashboard: enquiries, views, photos, prices, reviews to reply to, verification status. Plus traveller reviews with photo upload and the verified-booking badge.

Say when and I'll build stage 2.

---

## One thing to decide

The live site currently reads from the TypeScript files in `src/content/`. The database now holds the same content, but **the public pages haven't been switched over to read from it yet** — that happens in stage 2, alongside the editor.

So right now: the admin is real and writes to Postgres; the public site still renders from files. They converge in stage 2. Nothing you do in the admin will show on the public site until then, which is why I'd rather build the editor next than hand you a half-connected system.
