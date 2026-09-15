'use server';

import { unlink } from 'fs/promises';
import path from 'path';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db, media } from '@/db';
import { requireStaff } from '@/lib/auth';
import { saveUpload } from '@/lib/upload';

export async function uploadMediaAction(fd: FormData): Promise<{ error?: string } | void> {
  const user = await requireStaff();
  const file = fd.get('file');
  if (!(file instanceof File)) return { error: 'No file received.' };

  const res = await saveUpload(file, { uploadedBy: user.id, ownerKind: 'library' });
  if (!res.ok) return { error: res.error };
  revalidatePath('/admin/media');
}

export async function updateAltAction(fd: FormData) {
  await requireStaff();
  const id = Number(fd.get('id'));
  await db.update(media).set({ alt: String(fd.get('alt') ?? '').slice(0, 300) }).where(eq(media.id, id));
  revalidatePath('/admin/media');
}

export async function deleteMediaAction(fd: FormData) {
  await requireStaff();
  const id = Number(fd.get('id'));
  const [row] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (!row) return;

  // Remove files first; a missing file must not block the row delete.
  const root = process.env.UPLOAD_DIR || './public/uploads';
  for (const p of [row.path, row.thumbPath]) {
    if (!p) continue;
    try { await unlink(path.join(root, p.replace(/^\/uploads\//, ''))); } catch {}
  }
  await db.delete(media).where(eq(media.id, id));
  revalidatePath('/admin/media');
}
