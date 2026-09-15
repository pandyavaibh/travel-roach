# Travel Roach

India travel guide and city-wise directory of travel agents, hotels and restaurants.

**Next.js 16.3 · React 19.2 · TypeScript 5.9 · Postgres · Drizzle ORM · Tailwind**

Requires Node 20.9 or newer.

---

## The stack, and why

**Front end and back end are both Next.js.** Server components, server actions and route handlers all run on Node — that *is* your Node backend. A separate Express app would mean two deploys, two sets of environment variables and CORS between them, for nothing gained. Add a separate service only when you need something Next can't do, such as a long-running image worker.

**Postgres, not MongoDB.** The data is relational: cities belong to states, listings belong to cities, reviews belong to listings and users. A query like "published hotels in Ahmedabad rated 4+, sorted by response time" is one indexed join here, and an awkward `$lookup` aggregation in Mongo. Ratings also have to stay consistent — publishing a review updates the listing's cached rating in the same transaction, both or neither.

**Drizzle, not Prisma.** Types come from the schema with no code generation step, and the SQL it emits is the SQL you wrote. On serverless that matters: no engine binary to ship.

---

## Setup

### 1. Rename the route folders (required, 5 seconds)

Next.js dynamic routes need square brackets. Zip tools strip them, so they ship as `-state-`.

```bash
bash scripts/fix-route-folders.sh
```

Windows: double-click `scripts\fix-route-folders.bat`

You should end up with `src/app/[state]/[city]/[section]/[slug]/`. **Skipping this is what causes every dynamic page to 404.**

### 2. Database

Create a Postgres database — [Neon](https://neon.tech) has a free tier that fits this site. Copy the **pooled** connection string.

```bash
cp .env.example .env
```

Fill in `DATABASE_URL`, and generate `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Install and run

```bash
npm install
npm run db:setup      # tables, 35 states, Ahmedabad content
npm run db:admin      # your admin account
npm run dev
```

Public site at `/`. Admin at `/admin/login`.

---

## What exists

### Public site

| Route | What it is |
|---|---|
| `/` | Popular destinations (traffic ranked), seasonal rail, 35 states by region, trending places, interests, itinerary lengths |
| `/[state]` | State hub — why, best places, city guides, itineraries, food by city, festival calendar, how to reach |
| `/[state]/[city]` | City guide, every section with live counts |
| `/[state]/[city]/[section]` | Section listing, filtered and paginated |
| `/[state]/[city]/[section]/[slug]` | Article, attraction, event, itinerary or listing profile |
| `/destinations` `/places` `/things-to-do` `/food-culture` | The four mega-menu hubs |
| `/search` | Site search |
| `/plan` | Trip planner |
| `/about` `/contact` `/list-your-business` `/write-for-us` `/privacy` `/terms` | Static pages |
| `/sitemap.xml` `/robots.txt` | Generated from content |

**The ten city sections:** things to do, attractions, itineraries, food, how to reach, where to stay, near by, fairs & festivals, restaurants, travel agents.

### Admin (stage 1 of 3)

Login and sessions, four roles, user management, and a media library with drag-and-drop upload that resizes to WebP. See `ADMIN.md`.

**Not yet built:** the post editor (stage 2) and the owner portal (stage 3).

---

## Two content sources, converging

Right now there are two:

- **`src/content/*.ts`** — what the public pages render from. 35 states, 86 cities, ~5,100 generated articles, 2,069 listings. Boots with zero setup, never has an empty-database failure mode.
- **Postgres** — what the admin writes to. Holds the 35 states and the real Ahmedabad content.

**They converge in stage 2**, when the public pages switch to reading from the database alongside the editor being built. Until then, admin changes won't appear on the public site. That's deliberate — a half-connected system is worse than two clearly separate ones.

---

## Deploying

**Hostinger Business: follow `DEPLOY-HOSTINGER.md`** — step by step, including the Neon database setup, since Hostinger does not offer Postgres.

Vercel also works and is simpler (same company as Next.js, free tier covers this site). Either way you still need Postgres hosted elsewhere.

Environment variable changes always need a redeploy.

State, city and section pages pre-render (~1,000 pages). Detail pages render on first request and cache for an hour — to pre-build more, extend `generateStaticParams` in the `[slug]` route.

---

## Listings and Google Places

Google Places can seed a directory, but its terms conflict with selling listings three ways: place data must be refreshed every 30 days and cannot be stored permanently; Google-sourced results must appear on a Google Map and cannot be commercially reordered; reviews must stay attributed to Google.

**So: seed once, then own the record.** Your own description, photos and verification against the state tourism register. Keep the place ID for map links — that's allowed. Place Details is roughly $17 per 1,000 calls, so 5,000 listings is about $85 once versus $85 every month.

The Ahmedabad listings in the database were compiled by hand for exactly this reason.

---

## Design system

Tokens in `tailwind.config.ts`, shared classes in `src/app/globals.css`.

**Colours** — ink `#17160F`, paper `#F4F1EA`, orange `#E2670B`, teal `#0B4F4A`, sand `#FBEAD8`, rule `#E0DACB`.

**Type** — Newsreader for display (light, italic for accents), Schibsted Grotesk for everything else.

**Corners** — interactive elements are pills, media is square. Don't let a component library reintroduce rounded cards.

**Utilities:** `.shell` (page container), `.hair` (1px hairline grid — rules ride on children as outlines so empty tracks never show), `.rail` (scrollbar-hidden scroller), `.pill` / `.pill-on` / `.pill-off`, `.ph` (image placeholder).

---

## Still to do

1. **Photography.** Every image is a placeholder. Biggest visual gap.
2. **Stage 2 — the editor.** Tiptap rich text, image insertion, draft/publish, and admin screens for listings, attractions, events and cities. This is also when public pages switch to the database.
3. **Stage 3 — owner portal.** Signup, email verification, domain-check claims, the six-card dashboard, traveller reviews with photos.
4. **Real editorial.** Generated articles have correct structure and honest framing but are scaffolding. Replace city by city, starting where traffic is.
5. **Analytics.** The homepage "popular" ranking is a fixed list. The `page_views` table exists — wire it up.
6. **Tailwind 4.** The one remaining stack upgrade. Config moves into CSS and several utilities are renamed, including the `outline` pair the hairline grid uses on every page.

---

## Notes on Next 16

**`proxy.ts`, not `middleware.ts`.** Next 16 renamed the convention and moved it to the Node runtime. It is strictly for routing now — auth belongs in pages. This codebase already worked that way: the proxy only checks whether a session cookie exists, and `requireStaff` / `requireOwner` do the authoritative check in each page where they can reach the database.

**Turbopack is the default bundler.** No configuration needed; builds are faster.

**React Compiler is stable but opt-in.** It memoises components automatically at the cost of slower builds. There is a commented line in `next.config.ts` for when you want it.
