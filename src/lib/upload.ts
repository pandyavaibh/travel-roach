import 'server-only';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';
import sharp from 'sharp';
import { db, media } from '@/db';

export const QUOTA = { owner: 50, traveller: 10 } as const;
const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export type UploadResult = { ok: true; id: number; path: string } | { ok: false; error: string };

/**
 * Resizes to 1800px wide, writes a 400px thumbnail, converts to WebP.
 * Originals are deliberately not kept — disk on shared hosting is finite.
 */
export async function saveUpload(file: File, opts: {
  uploadedBy: number;
  ownerKind?: 'library' | 'listing' | 'review' | 'post';
  ownerId?: number;
  alt?: string;
}): Promise<UploadResult> {
  if (!ALLOWED.includes(file.type)) return { ok: false, error: 'Use a JPEG, PNG, WebP or AVIF image.' };
  if (file.size > MAX_BYTES) return { ok: false, error: 'That image is over 12 MB. Compress it and try again.' };

  const root = process.env.UPLOAD_DIR || './public/uploads';
  const now = new Date();
  const folder = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const dir = path.join(root, folder);
  await mkdir(dir, { recursive: true });

  const stem = randomBytes(8).toString('hex');
  const buf = Buffer.from(await file.arrayBuffer());

  let img = sharp(buf, { failOn: 'none' }).rotate();
  const meta = await img.metadata();

  const mainName = stem + '.webp';
  const thumbName = stem + '-t.webp';

  const main = await img.resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  const thumb = await sharp(buf, { failOn: 'none' }).rotate()
    .resize({ width: 400, height: 400, fit: 'cover' }).webp({ quality: 74 }).toBuffer();

  await writeFile(path.join(dir, mainName), main);
  await writeFile(path.join(dir, thumbName), thumb);

  const publicPath = `/uploads/${folder}/${mainName}`;
  const [row] = await db.insert(media).values({
    filename: file.name.slice(0, 200),
    path: publicPath,
    thumbPath: `/uploads/${folder}/${thumbName}`,
    mime: 'image/webp',
    width: meta.width ?? null,
    height: meta.height ?? null,
    bytes: main.byteLength,
    alt: opts.alt ?? null,
    uploadedBy: opts.uploadedBy,
    ownerKind: opts.ownerKind ?? 'library',
    ownerId: opts.ownerId ?? null,
  }).returning({ id: media.id });

  return { ok: true, id: row.id, path: publicPath };
}
