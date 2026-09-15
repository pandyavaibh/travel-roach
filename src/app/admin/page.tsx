import Link from 'next/link';
import { sql, eq, desc, and } from 'drizzle-orm';
import { db, posts, listings, claims, reviews, enquiries, media, cities } from '@/db';
import { requireStaff } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const count = async (table: any, where?: any) => {
  const q = db.select({ n: sql<number>`count(*)` }).from(table);
  const [r] = where ? await q.where(where) : await q;
  return Number(r?.n ?? 0);
};

export default async function AdminDashboard() {
  const user = await requireStaff();

  const [drafts, published, pendingClaims, newEnquiries, reported, listingCount, mediaCount, liveCities] = await Promise.all([
    count(posts, eq(posts.status, 'draft')),
    count(posts, eq(posts.status, 'published')),
    count(claims, eq(claims.status, 'pending')),
    count(enquiries, eq(enquiries.status, 'new')),
    count(reviews, eq(reviews.status, 'reported')),
    count(listings),
    count(media),
    count(cities, eq(cities.published, true)),
  ]);

  const recent = await db.select({
    id: posts.id, title: posts.title, status: posts.status, updatedAt: posts.updatedAt,
  }).from(posts).orderBy(desc(posts.updatedAt)).limit(6);

  const needsYou: [string, number, string][] = [
    ['Claims to review', pendingClaims, '/admin/claims'],
    ['New enquiries', newEnquiries, '/admin/enquiries'],
    ['Reported reviews', reported, '/admin/reviews?status=reported'],
    ['Drafts', drafts, '/admin/posts?status=draft'],
  ];

  const stats: [string, number, string][] = [
    ['Published posts', published, '/admin/posts'],
    ['Listings', listingCount, '/admin/listings'],
    ['Live cities', liveCities, '/admin/cities'],
    ['Media files', mediaCount, '/admin/media'],
  ];

  return (
    <main className="p-[clamp(20px,3vw,40px)]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="eyebrow">Admin</div>
          <h1 className="m-0 mt-3 font-serif text-[clamp(30px,4vw,48px)] leading-none tracking-[-.025em]">
            Hello, {user.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/posts/new" className="btn-primary">New post</Link>
          <Link href="/admin/listings/new" className="btn-outline">New listing</Link>
        </div>
      </div>

      <section className="mt-[clamp(26px,3.4vw,44px)]">
        <div className="label border-b border-rule pb-3">Needs you</div>
        <div className="hair mt-px [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {needsYou.map(([label, n, href]) => (
            <Link key={label} href={href} className="block bg-white p-5 pb-6 hover:bg-paper">
              <div className="font-serif text-[clamp(32px,3.6vw,44px)] leading-none" style={{ color: n > 0 ? '#E2670B' : '#17160F' }}>{n}</div>
              <div className="meta mt-3">{label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-[clamp(26px,3.4vw,44px)]">
        <div className="label border-b border-rule pb-3">The site</div>
        <div className="hair mt-px [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {stats.map(([label, n, href]) => (
            <Link key={label} href={href} className="block bg-white p-5 pb-6 hover:bg-paper">
              <div className="font-serif text-[clamp(32px,3.6vw,44px)] leading-none text-ink">{n}</div>
              <div className="meta mt-3">{label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-[clamp(26px,3.4vw,44px)]">
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <span className="label">Recently edited</span>
          <Link href="/admin/posts" className="text-[13px] font-semibold text-ink hover:text-orange">All posts →</Link>
        </div>
        {recent.length === 0 ? (
          <div className="bg-white border border-rule border-t-0 p-8 text-center">
            <p className="m-0 text-[15px] text-muted-2">No posts yet.</p>
            <Link href="/admin/posts/new" className="btn-primary mt-4">Write the first one</Link>
          </div>
        ) : (
          <div className="hair mt-px [grid-template-columns:1fr]">
            {recent.map((p) => (
              <Link key={p.id} href={`/admin/posts/${p.id}`} className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-4 hover:bg-paper">
                <span className="font-serif text-[18px] leading-tight text-ink">{p.title}</span>
                <span className="flex items-center gap-3">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.08em] ${p.status === 'published' ? 'bg-teal text-white' : 'bg-sand text-orange-deep'}`}>{p.status}</span>
                  <span className="meta">{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-GB') : ''}</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
