/**
 * Creates (or promotes) the first admin account.
 *
 *   npm run db:admin
 *   npm run db:admin -- you@example.com "Your Name" yourpassword
 */
import 'dotenv/config';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { createInterface } from 'readline/promises';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error('DATABASE_URL is not set.'); process.exit(1); }

  let [email, name, password] = process.argv.slice(2);

  if (!email || !name || !password) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    email = email || (await rl.question('Email: ')).trim();
    name = name || (await rl.question('Name: ')).trim();
    password = password || (await rl.question('Password (10+ characters): ')).trim();
    rl.close();
  }

  if (!email.includes('@')) { console.error('That is not an email address.'); process.exit(1); }
  if (password.length < 10) { console.error('Password must be at least 10 characters.'); process.exit(1); }

  const sql = postgres(url, { max: 1, onnotice: () => {} });
  const hash = await bcrypt.hash(password, 11);

  try {
    const [row] = await sql`
      INSERT INTO users (email, password_hash, name, role, email_verified)
      VALUES (${email.toLowerCase()}, ${hash}, ${name}, 'admin', true)
      ON CONFLICT (email) DO UPDATE
        SET password_hash = EXCLUDED.password_hash,
            name = EXCLUDED.name,
            role = 'admin',
            email_verified = true
      RETURNING id, email`;

    console.log('Admin ready: ' + row.email);
    console.log('Sign in at /admin/login');
  } catch (err) {
    console.error('Failed. Have you run npm run db:setup yet?');
    console.error(err);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

main();
