import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb, EmptyState } from '@/components/ui';
import { STATES } from '@/content/states';
import { CITIES } from '@/content/cities';
import { ARTICLES } from '@/content/articles';
import { ATTRACTIONS } from '@/content/places';
import { LISTINGS } from '@/content/listings';

export const metadata: Metadata = { title: 'Search' };

type Hit = { title: string; sub: string; href: string; type: string };

function search(q: string): Hit[] {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  const hits: Hit[] = [];
  for (const s of STATES) if (s.name.toLowerCase().includes(t) || s.tagline.toLowerCase().includes(t))
    hits.push({ title: s.name, sub: s.tagline, href: '/' + s.slug, type: 'State' });
  for (const c of CITIES) if (c.name.toLowerCase().includes(t) || c.tagline.toLowerCase().includes(t))
    hits.push({ title: c.name, sub: c.tagline, href: `/${c.stateSlug}/${c.slug}`, type: 'City' });
  for (const a of ATTRACTIONS) if (a.name.toLowerCase().includes(t))
    hits.push({ title: a.name, sub: a.category + ' · ' + a.summary, href: `/${a.stateSlug}/${a.citySlug}/attractions/${a.slug}`, type: 'Place' });
  for (const a of ARTICLES) if (a.title.toLowerCase().includes(t) || a.dek.toLowerCase().includes(t))
    hits.push({ title: a.title, sub: a.dek, href: `/${a.stateSlug}/${a.citySlug}/${a.section}/${a.slug}`, type: 'Guide' });
  for (const l of LISTINGS) if (l.name.toLowerCase().includes(t))
    hits.push({ title: l.name, sub: l.meta, href: `/${l.stateSlug}/${l.citySlug}/${l.kind}/${l.slug}`, type: 'Listing' });
  return hits.slice(0, 60);
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const hits = search(q);

  return (
    <main className="shell pt-[clamp(24px,3vw,40px)]">
      <Breadcrumb items={[['India','/'], ['Search', null]]} />
      <h1 className="m-0 mt-[clamp(14px,1.8vw,24px)] text-[clamp(38px,6.4vw,88px)] leading-[.98] tracking-[-.033em]">Search</h1>

      <form action="/search" className="flex flex-wrap items-center gap-2 bg-white border border-rule rounded-full p-[7px] pl-[22px] max-w-[560px] mt-7">
        <input name="q" defaultValue={q} placeholder="Where to?" aria-label="Search"
          className="flex-1 min-w-[120px] py-3 bg-transparent text-base outline-none" />
        <button className="btn-dark px-[26px] min-h-[46px] text-sm">Search</button>
      </form>

      {!q ? (
        <div className="mt-10">
          <div className="label border-b border-rule pb-3.5">Popular searches</div>
          <div className="flex flex-wrap gap-2 pt-4">
            {['Rann of Kutch','Ladakh','Kerala backwaters','Golden Triangle','Tiger safari','Street food','Navratri','Hampi'].map((s) => (
              <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="pill pill-off">{s}</Link>
            ))}
          </div>
        </div>
      ) : hits.length === 0 ? (
        <div className="mt-10">
          <EmptyState title={`Nothing for "${q}"`}
            body="Try a city, a state, a dish or the name of a place. Our guides are organised by destination first."
            href="/destinations" cta="Browse destinations" />
        </div>
      ) : (
        <>
          <div className="meta mt-7">{hits.length} results for "{q}"</div>
          <div className="hair mt-4 [grid-template-columns:1fr]">
            {hits.map((h, i) => (
              <Link key={h.href + i} href={h.href} className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 bg-white p-4 px-5 hover:bg-paper">
                <span className="label shrink-0 w-[70px]">{h.type}</span>
                <span className="font-serif text-[19px] leading-tight text-ink">{h.title}</span>
                <span className="text-[13px] leading-relaxed text-muted-2 basis-full pl-[86px] max-[560px]:pl-0">{h.sub}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
