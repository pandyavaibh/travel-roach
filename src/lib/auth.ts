import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { eq, and, gt } from 'drizzle-orm';
import { db, users, sessions } from '@/db';

import { SESSION_COOKIE, SESSION_DAYS } from './constants';
export { SESSION_COOKIE };

export type Role = 'admin' | 'editor' | 'owner' | 'traveller';
export type SessionUser = { id: number; email: string; name: string; role: Role; emailVerified: boolean };

export const hashPassword = (pw: string) => bcrypt.hash(pw, 11);
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);
export const token = () => randomBytes(24).toString('hex');

export async function createSession(userId: number) {
  const id = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await db.insert(sessions).values({ id, userId, expiresAt });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, id, {
    httpOnly: true, sameSite: 'lax', path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
  });
  return id;
}

export async function destroySession() {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (id) await db.delete(sessions).where(eq(sessions.id, id));
  jar.delete(SESSION_COOKIE);
}

/** Current user, or null. Safe to call from any server component. */
export async function getUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return null;

  const rows = await db.select({
    id: users.id, email: users.email, name: users.name,
    role: users.role, emailVerified: users.emailVerified,
  })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, id), gt(sessions.expiresAt, new Date())))
    .limit(1);

  const u = rows[0];
  return u ? { ...u, role: u.role as Role, emailVerified: !!u.emailVerified } : null;
}

export const isStaff = (u: SessionUser | null): u is SessionUser =>
  !!u && (u.role === 'admin' || u.role === 'editor');

/** Throws a redirect if the user is not staff. Use at the top of admin pages. */
export async function requireStaff(): Promise<SessionUser> {
  const u = await getUser();
  if (!isStaff(u)) {
    redirect('/admin/login');
  }
  return u;
}

export async function requireAdmin(): Promise<SessionUser> {
  const u = await getUser();
  if (!u || u.role !== 'admin') {
    redirect('/admin');
  }
  return u;
}

export async function requireOwner(): Promise<SessionUser> {
  const u = await getUser();
  if (!u || (u.role !== 'owner' && u.role !== 'admin')) {
    redirect('/portal/login');
  }
  return u;
}

/** Domain match: claims auto-approve when the email domain matches the listing website. */
export function domainMatches(email: string, website: string | null): boolean {
  if (!website) return false;
  const emailDomain = email.split('@')[1]?.toLowerCase().replace(/^www\./, '');
  if (!emailDomain) return false;
  const free = ['gmail.com','yahoo.com','hotmail.com','outlook.com','rediffmail.com','icloud.com','proton.me'];
  if (free.includes(emailDomain)) return false;
  try {
    const host = new URL(website.startsWith('http') ? website : 'https://' + website)
      .hostname.toLowerCase().replace(/^www\./, '');
    return host === emailDomain || host.endsWith('.' + emailDomain) || emailDomain.endsWith('.' + host);
  } catch { return false; }
}
