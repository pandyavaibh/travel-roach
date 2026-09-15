# Deploying to Hostinger Business

Follow this in order. Steps 1 and 2 happen on your computer; the rest in hPanel.

**One thing to know first:** Hostinger Business does not offer Postgres. You'll create the database at Neon (free, five minutes) and Hostinger will run the app. That's step 3.

---

## Step 1 — Rename the route folders

**Do this before anything else.** Next.js dynamic routes need square brackets in folder names, and zip tools strip them, so they ship as `-state-`. Skipping this is exactly what made every city page 404 last time.

**Mac / Linux:**
```bash
cd source
bash scripts/fix-route-folders.sh
```

**Windows:** double-click `scripts\fix-route-folders.bat`

Confirm you now have:
```
src/app/[state]/[city]/[section]/[slug]/page.tsx
```

If the script won't run, rename the four folders by hand in your file explorer: `-state-` → `[state]`, `-city-` → `[city]`, `-section-` → `[section]`, `-slug-` → `[slug]`.

---

## Step 2 — Test locally

Don't deploy something you haven't seen run.

```bash
npm install
```

Node 20.9 or newer is required. Check with `node -v` — if you're older, install Node 22 LTS from nodejs.org.

You can't run the app yet without a database, so do step 3 first, then come back and run `npm run dev`.

---

## Step 3 — Create the database at Neon

1. Go to **neon.tech** → sign up (free, no card).
2. **Create project.** Name it `travel-roach`. Pick the region closest to your users — Singapore or Mumbai for an India-focused site.
3. On the project dashboard, find **Connection string**. Switch the toggle to **Pooled connection**. Copy it.

It looks like:
```
postgresql://user:pass@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**Use the pooled string, not the direct one.** A Next.js app opens and closes connections constantly and will exhaust the direct connection limit.

4. Still in Neon, open **SQL Editor**, paste the entire contents of `database/travel-roach.sql`, and run it.

You should see the tables appear under **Tables** in the sidebar: 35 states, 86 cities, 60 posts, 29 listings.

---

## Step 4 — Configure and verify locally

In the `source` folder:

```bash
cp .env.example .env
```

Open `.env` and fill in two values:

```
DATABASE_URL=<the pooled string from Neon>
SESSION_SECRET=<generate it below>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Generate the session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Create your admin account:
```bash
npm run db:admin
```

Then run it:
```bash
npm run dev
```

**Check these four before going further:**

- `http://localhost:3000` — homepage loads
- `http://localhost:3000/gujarat` — state page loads
- `http://localhost:3000/gujarat/ahmedabad` — city page loads
- `http://localhost:3000/admin/login` — you can sign in

If `/gujarat` 404s, step 1 didn't work. Go back.

---

## Step 5 — Push to GitHub

Hostinger deploys from a repository and rebuilds on every push. Commit **after** the rename, so the repo has real `[state]` folders.

```bash
git init
git add .
git commit -m "Travel Roach"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/travel-roach.git
git push -u origin main
```

`.env` is already in `.gitignore` — confirm it's not in the commit. `git status` should not list it.

---

## Step 6 — Create the Node.js app in hPanel

1. hPanel → **Websites** → your site → **Node.js** in the sidebar.

   *Don't see Node.js?* You're on a plan that doesn't support it. Business and Cloud do; shared and Premium are PHP-only. Upgrade before continuing.

2. **Deploy from GitHub.** Authorise Hostinger, pick your repository and the `main` branch.

3. Settings:

   | Field | Value |
   |---|---|
   | Framework | Next.js |
   | Node version | **20** or higher |
   | Build command | `npm run build` |
   | Start command | `npm run start` |
   | Root directory | leave blank if the repo root is the app; otherwise `source` |

   That last one matters: if you pushed the whole download rather than just the `source` folder, set the root directory to `source`.

4. **Deploy.**

---

## Step 7 — Environment variables

In the app's settings, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | the pooled Neon string |
| `SESSION_SECRET` | the same one you generated |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `NODE_ENV` | `production` |

Optional, for email (password resets and owner claims):

| Variable | Value |
|---|---|
| `BREVO_API_KEY` | from brevo.com → SMTP & API → API Keys |
| `EMAIL_FROM` | `noreply@yourdomain.com` |
| `ENQUIRY_BCC` | your own address |

Without the Brevo key, enquiries log to the server console instead of sending. Nothing breaks.

**Then redeploy.** Hostinger does not restart the app when you change a variable.

---

## Step 8 — Domain and SSL

1. The app → **Custom domain** → add your domain.
2. Domain registered with Hostinger? DNS is set for you. Registered elsewhere? Point the A record at the IP hPanel shows.
3. Enable **SSL**. Wait for it to read **Active** before sharing the link — visitors get a security warning otherwise.
4. Go back to **Environment variables** and set `NEXT_PUBLIC_SITE_URL` to your real domain, then redeploy once more. This affects canonical tags and the sitemap.

---

## Step 9 — Check the live site

- Homepage
- `/gujarat` and `/gujarat/ahmedabad`
- `/gujarat/ahmedabad/travel-agents` — listings appear
- One listing profile
- `/admin/login` — sign in works
- `/sitemap.xml` — returns URLs

Then submit the sitemap in Google Search Console.

---

## When something goes wrong

**Build fails, "Module not found"** — `npm install` wasn't clean. Delete `node_modules` and `package-lock.json` locally, reinstall, commit the new lockfile, push.

**Build fails on Node version** — Next 16 needs Node 20.9+. Set it in the app settings, then redeploy.

**Every dynamic page 404s, homepage works** — step 1. The repo has `-state-` instead of `[state]`.

**"DATABASE_URL is not set"** — the variable is missing, or you added it without redeploying.

**Database connection times out** — you used the direct Neon string instead of the pooled one.

**Admin login redirects in a loop** — `SESSION_SECRET` differs between what you set locally and in hPanel, or is missing in production.

**Uploaded images vanish after a deploy** — Hostinger rebuilt the container and wiped `public/uploads`. Check whether your plan has persistent storage. If not, move uploads to Cloudflare R2 — about $1/month at this size, and `src/lib/upload.ts` is the only file that changes.

---

## Redeploying later

Push to `main` and Hostinger rebuilds automatically. To redeploy without a code change — after an environment variable edit — use **Redeploy** in hPanel.

Build takes two to three minutes. State, city and section pages pre-render (roughly 1,000 pages); detail pages render on first request and cache for an hour.
