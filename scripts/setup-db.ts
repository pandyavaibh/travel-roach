/**
 * Creates every table and imports the 35 states plus the Ahmedabad content by
 * running database/travel-roach.sql.
 *
 *   npm run db:setup
 *
 * Safe to re-run: it stops if states already exist.
 */
import 'dotenv/config';
import { readFile } from 'fs/promises';
import path from 'path';
import postgres from 'postgres';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }

  const sql = postgres(url, { max: 1, onnotice: () => {} });

  try {
    const [{ exists }] = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'states'
      ) AS exists`;

    if (exists) {
      const [{ count }] = await sql`SELECT count(*)::int AS count FROM states`;
      if (count > 0) {
        console.log(`Already populated (${count} states). Nothing to do.`);
        console.log('To start over, drop and recreate the database, then run this again.');
        await sql.end();
        return;
      }
    }

    console.log('Running database/travel-roach.sql…');
    const file = path.join(process.cwd(), 'database', 'travel-roach.sql');
    const dump = await readFile(file, 'utf8');

    // The dump is wrapped in one transaction, so a failure anywhere rolls all of it back.
    await sql.unsafe(dump);

    const [s] = await sql`SELECT count(*)::int AS n FROM states`;
    const [c] = await sql`SELECT count(*)::int AS n FROM cities WHERE published`;
    const [p] = await sql`SELECT count(*)::int AS n FROM posts`;
    const [l] = await sql`SELECT count(*)::int AS n FROM listings`;

    console.log(`
Done.

  ${s.n} states · ${c.n} published city · ${p.n} posts · ${l.n} listings

Ratings on every listing start at 0.0 — real reviews will build them.
The other 85 cities exist but stay hidden until you publish them.

Next:  npm run db:admin      (create your admin account)
       npm run dev           (then sign in at /admin)
`);
  } catch (err) {
    console.error('\nSetup failed. Nothing was written — the dump runs in a transaction.');
    console.error(err);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

main();
