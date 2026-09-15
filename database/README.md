# Database — Postgres

Schema, indexes, full-text search and content in one file: `travel-roach.sql`.

---

## Where to host it

Hostinger does not offer Postgres on shared or Business plans. Three options that do:

| Host | Free tier | Notes |
|---|---|---|
| **Neon** | 0.5 GB, autosuspends | Serverless, branches per environment. Best fit for this site. |
| **Supabase** | 500 MB, pauses after 7 days idle | Includes a SQL editor and storage if you later move images off disk. |
| **Hostinger VPS** | — | Full control, you manage backups and updates yourself. |

Neon is what I'd pick: the connection pooler suits Next.js server components, which open and close connections constantly.

---

## Import it

**Option A — SQL editor (no terminal)**

Neon → your project → **SQL Editor**. Supabase → **SQL Editor**. Paste the contents of `travel-roach.sql`, run it.

**Option B — psql**

```bash
psql "$DATABASE_URL" -f database/travel-roach.sql
```

**Option C — from the app**

```bash
npm run db:setup
```

This runs the same file and prints a summary. It stops if states already exist, so it's safe to re-run.

All three are identical. The whole dump is one transaction — if anything fails, nothing is written.

---

## Then create your login

There is no default account.

```bash
npm run db:admin
```

It asks for email, name and password. Or inline:

```bash
npm run db:admin -- you@example.com "Your Name" your-password
```

Sign in at `/admin/login`.

**No terminal?** Generate a bcrypt hash at [bcrypt-generator.com](https://bcrypt-generator.com) with cost 11, then in the SQL editor:

```sql
INSERT INTO users (email, password_hash, name, role, email_verified)
VALUES ('you@example.com', 'PASTE_HASH_HERE', 'Your Name', 'admin', true);
```

---

## What's in the dump

| Table | Rows | Notes |
|---|---|---|
| `states` | 35 | All published |
| `cities` | 86 | Ahmedabad published, 85 hidden |
| `posts` | 60 | Ahmedabad, four sections |
| `attractions` | 8 | Full visitor details |
| `events` | 12 | A year of dated festivals |
| `packages` | 6 | With day-by-day plans |
| `listings` | 29 | 8 agents, 10 hotels, 11 restaurants |
| `listing_rows` | 116 | Rooms, menus, tour packages |
| `users` | 0 | You create the first |
| `media`, `reviews`, `enquiries`, `claims`, `page_views` | 0 | Fill as the site runs |

**Every rating is 0.0 and every review count is 0.** Ahmedabad business names, categories, areas and founding years are real and verified from published sources; the numbers were invented during design, so they're gone.

The 85 unpublished cities are real rows — flip `published` to true in the admin when you have content. Their state hubs stay live meanwhile and list only what's published.

---

## Postgres specifics worth knowing

**Enums are real types.** `role`, `status`, `listing_kind` and eight others are declared as Postgres enums, so an invalid value is rejected by the database rather than by application code. Adding a value later needs `ALTER TYPE ... ADD VALUE`.

**Full-text search is built in.** Two GIN indexes cover post titles/deks and listing names/blurbs. `/search` uses them — no Elasticsearch needed.

**`sort_rank`, not `rank`.** `rank` is a reserved window function in Postgres, so the attractions column is `sort_rank` to avoid quoting it everywhere.

**`updated_at` uses a trigger.** Postgres has no `ON UPDATE CURRENT_TIMESTAMP`, so `posts_touch` maintains it.

**Foreign keys cascade.** Deleting a city removes its posts, attractions, events and listings. Deleting a listing removes its rows, claims and reviews. Deleting a user sets `listings.owner_id` to null rather than deleting the business.

**`numeric` comes back as a string.** `postgres-js` returns `NUMERIC` as a string to preserve precision, so `rating_cached` needs `Number(...)` before `.toFixed()`. This matters once the public pages read from the database in stage 2.

---

## Connecting the app

In `.env`:

```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

Use the **pooled** connection string, not the direct one. Neon and Supabase both offer both; the pooled one is what a serverless app needs.

`src/db/index.ts` sets `prepare: false`, which is required when connecting through a transaction-mode pooler.

---

## Re-importing

The dump uses fixed primary keys, so re-running it on a populated database throws duplicate-key errors. To start clean:

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Then import again.

---

## Backups

Neon keeps point-in-time history on paid plans and lets you branch the database — take a branch before any schema change and you can roll back instantly. Supabase runs daily backups on paid plans.

On the free tier, take your own before schema changes:

```bash
pg_dump "$DATABASE_URL" > backup-$(date +%F).sql
```
