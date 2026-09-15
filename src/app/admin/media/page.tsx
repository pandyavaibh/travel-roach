import { desc, sql } from 'drizzle-orm';
import { db, media, users } from '@/db';
import { eq } from 'drizzle-orm';
import { requireStaff } from '@/lib/auth';
import MediaGrid from './MediaGrid';

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  await requireStaff();

  const rows = await db.select({
    id: media.id, path: media.path, thumbPath: media.thumbPath, filename: media.filename,
    alt: media.alt, bytes: media.bytes, width: media.width, height: media.height,
    createdAt: media.createdAt, uploader: users.name, ownerKind: media.ownerKind,
  })
    .from(media)
    .leftJoin(users, eq(media.uploadedBy, users.id))
    .orderBy(desc(media.createdAt))
    .limit(120);

  const [tot] = await db.select({ n: sql<number>`count(*)`, b: sql<number>`coalesce(sum(bytes),0)` }).from(media);
  const mb = (Number(tot?.b ?? 0) / 1048576).toFixed(1);

  return (
    <main className="p-[clamp(20px,3vw,40px)]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="eyebrow">Admin</div>
          <h1 className="m-0 mt-3 font-serif text-[clamp(30px,4vw,48px)] leading-none tracking-[-.025em]">Media</h1>
        </div>
        <div className="text-right">
          <div className="font-serif text-[26px] leading-none text-ink">{Number(tot?.n ?? 0)}</div>
          <div className="meta mt-1.5">files · {mb} MB</div>
        </div>
      </div>
      <p className="mt-3.5 max-w-[58ch] text-[15px] leading-relaxed text-muted-2">
        Everything uploaded across the site. Images are resized to 1800px and converted to WebP on upload — originals are not kept, because disk on shared hosting is finite.
      </p>
      <MediaGrid items={rows as any} />
    </main>
  );
}
