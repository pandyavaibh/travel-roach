'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db, users } from '@/db';
import { createSession, destroySession, verifyPassword, hashPassword, requireStaff, requireAdmin, token } from '@/lib/auth';
import { mailVerify } from '@/lib/email';

export type FormState = { error?: string; ok?: string };

const login = z.object({
  email: z.string().trim().pipe(z.email('Enter a valid email')),
  password: z.string().min(1, 'Enter your password'),
  next: z.string().optional(),
});

export async function loginAction(_p: FormState, fd: FormData): Promise<FormState> {
  const parsed = login.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { email, password, next } = parsed.data;

  const [u] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  // Same message either way — never reveal which accounts exist.
  if (!u || !(await verifyPassword(password, u.passwordHash))) return { error: 'Email or password is wrong.' };
  if (u.role !== 'admin' && u.role !== 'editor') return { error: 'That account cannot use the admin.' };

  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, u.id));
  await createSession(u.id);
  redirect(next && next.startsWith('/admin') ? next : '/admin');
}

export async function logoutAction() {
  await destroySession();
  redirect('/admin/login');
}

const newUser = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(160),
  email: z.string().trim().pipe(z.email('Enter a valid email')),
  password: z.string().min(10, 'Use at least 10 characters'),
  role: z.enum(['admin', 'editor', 'owner', 'traveller']),
});

export async function createUserAction(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = newUser.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  const [exists] = await db.select({ id: users.id }).from(users).where(eq(users.email, d.email.toLowerCase())).limit(1);
  if (exists) return { error: 'An account with that email already exists.' };

  const verifyToken = token();
  await db.insert(users).values({
    name: d.name, email: d.email.toLowerCase(),
    passwordHash: await hashPassword(d.password),
    role: d.role, emailVerified: d.role === 'admin' || d.role === 'editor', verifyToken,
  });

  if (d.role === 'owner' || d.role === 'traveller') {
    await mailVerify(d.email, d.name, `${process.env.NEXT_PUBLIC_SITE_URL}/portal/verify?t=${verifyToken}`);
  }
  revalidatePath('/admin/users');
  return { ok: `${d.name} added.` };
}

export async function setRoleAction(fd: FormData) {
  const me = await requireAdmin();
  const id = Number(fd.get('id'));
  const role = String(fd.get('role')) as 'admin' | 'editor' | 'owner' | 'traveller';
  // Guard against locking yourself out of the admin.
  if (id === me.id && role !== 'admin') return;
  await db.update(users).set({ role }).where(eq(users.id, id));
  revalidatePath('/admin/users');
}

export async function deleteUserAction(fd: FormData) {
  const me = await requireAdmin();
  const id = Number(fd.get('id'));
  if (id === me.id) return;
  await db.delete(users).where(eq(users.id, id));
  revalidatePath('/admin/users');
}
