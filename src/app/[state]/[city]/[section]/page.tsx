import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb, Chips, Pagination, SampleNote, EmptyState } from '@/components/ui';
import { ArticleCard, FeaturedArticle, AttractionCard, EventRow, PackageRow, ListingCard } from '@/components/cards';
import { STATE_BY_SLUG } from '@/content/states';
import { CITIES, CITY_BY_KEY } from '@/content/cities';
import { articlesFor } from '@/content/articles';
import { attractionsFor } from '@/content/places';
import { eventsFor } from '@/content/events';
import { packagesFor } from '@/content/packages';
import { listingsFor } from '@/content/listings';
import { CITY_SECTIONS, sectionDef, SECTION_CHIPS, LISTING_FILTERS } from '@/lib/site';

export const revalidate = 3600;
export function generateStaticParams() {
  return CITIES.flatMap((c) => CITY_SECTIONS.map((s) => ({ state: c.stateSlug, city: c.slug, section: s.slug })));
}

type Props = {
  params: Promise<{ state: string; city: string; section: string }>;
  searchParams: Promise<{ f?: string; page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city, section } = await params;
  const c = CITY_BY_KEY.get(state + '/' + city);
  const def = sectionDef(section);
  if (!c || !def) return {};
  return { title: `${def.label} in ${c.name}`, description: `${def.label} in ${c.name}, checked on the ground and updated when it changes.` };
}

const PER_PAGE = 12;

const INTROS: Record<string, (city: string, n: number) => string> = {
  'things-to-do': (c, n) => `${n} guides to the sights, walks and neighbourhoods of ${c}, written on the ground and updated when the timings change.`,
  attractions: (c, n) => `${n} places in ${c}, each with timings, entry fees, how long you need and what sits nearby.`,
  itineraries: (c, n) => `${n} day-by-day plans you can follow yourself or have a listed operator run for you. Prices are per person, twin sharing, excluding flights.`,
  food: (c, n) => `${n} food guides for ${c} — thali houses, street stalls, recipes and the cafés worth a morning.`,
  'how-to-reach': (c, n) => `${n} guides to getting into and around ${c}, with real door-to-door times and what each option costs.`,
  hotels: (c, n) => `${n} properties in ${c}. Owners keep their own listings current; ratings sync nightly from Google Business Profile.`,
  nearby: (c, n) => `${n} day trips within reach of ${c}, sorted by how far you have to go and what you get for it.`,
  festivals: (c, n) => `${n} dated events across the year in ${c}. Two of them will affect where you can stay.`,
  restaurants: (c, n) => `${n} places to eat in ${c}. Owners manage their own menus and hours.`,
  'travel-agents': (c, n) => `${n} listed operators, advisors and licensed guides in ${c}. Verification checks IATA accreditation, state tourism registration or an ASI guide licence.`,
};

export default async function SectionPage({ params, searchParams }: Props) {
  const { state, city, section } = await params;
  const sp = await searchParams;
  const c = CITY_BY_KEY.get(state + '/' + city);
  const s = STATE_BY_SLUG.get(state);
  const def = sectionDef(section);
  if (!c || !s || !def) notFound();

  const base = `/${state}/${city}`;
  const sectionBase = `${base}/${section}`;
  const page = Math.max(1, Number(sp.page ?? 1));
  const filter = sp.f ?? '';

  let items: any[] = [];
  if (def.type === 'articles') items = articlesFor(state, city, section);
  else if (def.type === 'attractions') items = attractionsFor(state, city);
  else if (def.type === 'events') items = eventsFor(state, city);
  else if (def.type === 'packages') items = packagesFor(state, city);
  else if (def.type === 'directory') items = listingsFor(state, city, def.kind!);

  // Filters
  if (filter && filter !== 'All') {
    items = items.filter((i: any) => {
      const hay = [i.kicker, i.category, i.season, i.meta, ...(i.tags ?? [])].filter(Boolean).join(' ').toLowerCase();
      if (filter === 'Free') return i.ticketed === false;
      if (filter === 'Ticketed') return i.ticketed === true;
      if (filter === '1 day') return i.days === 1;
      if (filter === '2 – 3 days') return i.days >= 2 && i.days <= 3;
      if (filter === '4 – 6 days') return i.days >= 4 && i.days <= 6;
      if (filter === 'A week or more') return i.days >= 7;
      return hay.includes(filter.toLowerCase());
    });
  }

  const total = items.length;
  const pages = Math.ceil(total / PER_PAGE);
  const featured = def.type === 'articles' && page === 1 && !filter ? items[0] : null;
  const list = (featured ? items.slice(1) : items).slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const chips = SECTION_CHIPS[section];
  const filters = def.kind ? LISTING_FILTERS[def.kind] : null;
  const hasSample = def.type === 'directory' && items.some((i: any) => i.sample);

  return (
    <main>
      <section className="shell pt-[clamp(24px,3vw,40px)]">
        <Breadcrumb items={[['India','/'], [s.name, '/' + state], [c.name, base], [def.label, null]]} />
        <div className="flex flex-wrap items-end justify-between gap-6 mt-[clamp(14px,1.8vw,24px)]">
          <h1 className="m-0 max-w-[15ch] text-[clamp(38px,6.6vw,92px)] leading-[.97] tracking-[-.033em]">{def.label} in {c.name}</h1>
          <span className="inline-flex items-center bg-ink text-paper rounded-full px-5 py-2.5 text-[12px] font-semibold">{total} {def.type === 'events' ? 'events' : def.type === 'packages' ? 'packages' : def.type === 'directory' ? 'listings' : def.type === 'attractions' ? 'places' : 'articles'}</span>
        </div>
        <p className="mt-[clamp(16px,2vw,24px)] max-w-[58ch] text-[clamp(15px,1.4vw,17px)] leading-[1.6] text-ink-3">
          {INTROS[section]?.(c.name, total)}
        </p>
        {hasSample && (
          <div className="mt-[clamp(18px,2.2vw,26px)]">
            <SampleNote>Real {c.name} businesses, names and areas verified. Ratings and review counts are placeholders until the Google Business Profile sync runs.</SampleNote>
          </div>
        )}
      </section>

      {chips && (
        <div className="sticky top-[72px] z-[60] bg-paper border-b border-rule mt-[clamp(22px,2.8vw,34px)]">
          <div className="shell py-2.5"><Chips items={chips} active={filter} base={sectionBase} /></div>
        </div>
      )}

      <section className="shell pt-[clamp(24px,3vw,40px)]">
        {filters && (
          <div className="rail flex gap-2 overflow-x-auto pb-5 items-center">
            <span className="label whitespace-nowrap pr-1.5">Filter</span>
            <Link href={sectionBase} className={`pill ${!filter ? 'pill-on' : 'pill-off'}`}>All {total}</Link>
            {filters.flatMap((g) => g.options).map((o) => (
              <Link key={o} href={`${sectionBase}?f=${encodeURIComponent(o)}`} className={`pill ${filter === o ? 'pill-on' : 'pill-off'}`}>
                {o}
              </Link>
            ))}
          </div>
        )}

        {total === 0 ? (
          <EmptyState title="Nothing matches that filter"
            body={`We have not published anything in ${c.name} under that filter yet. Clear it to see everything in this section.`}
            href={sectionBase} cta={`All ${def.label.toLowerCase()}`} />
        ) : (
          <>
            {featured && <FeaturedArticle a={featured} href={`${sectionBase}/${featured.slug}`} />}

            {def.type === 'articles' && (
              <div className="grid gap-[clamp(12px,1.4vw,18px)] mt-[clamp(14px,1.6vw,20px)] [grid-template-columns:repeat(auto-fit,minmax(290px,1fr))]">
                {list.map((a: any) => <ArticleCard key={a.slug} a={a} href={`${sectionBase}/${a.slug}`} />)}
              </div>
            )}
            {def.type === 'attractions' && (
              <div className="grid gap-[clamp(12px,1.4vw,18px)] [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))]">
                {list.map((a: any) => <AttractionCard key={a.slug} a={a} href={`${sectionBase}/${a.slug}`} />)}
              </div>
            )}
            {def.type === 'events' && (
              <div className="flex flex-col gap-3">
                {list.map((e: any) => <EventRow key={e.slug} e={e} href={`${sectionBase}/${e.slug}`} />)}
              </div>
            )}
            {def.type === 'packages' && (
              <div className="flex flex-col gap-3">
                {list.map((p: any) => <PackageRow key={p.slug} p={p} href={`${sectionBase}/${p.slug}`} />)}
              </div>
            )}
            {def.type === 'directory' && (
              <div className="flex flex-col gap-3.5">
                {list.map((l: any) => <ListingCard key={l.slug} l={l} href={`${sectionBase}/${l.slug}`} />)}
              </div>
            )}

            <Pagination page={page} pages={pages} base={sectionBase} />
          </>
        )}
      </section>

      {/* Other sections */}
      <section className="shell pt-[clamp(40px,5vw,72px)]">
        <div className="label border-b border-rule pb-3.5">More in {c.name}</div>
        <div className="rail flex gap-2 overflow-x-auto pt-4">
          {CITY_SECTIONS.filter((x) => x.slug !== section).map((x) => (
            <Link key={x.slug} href={`${base}/${x.slug}`} className="pill pill-off">{x.label}</Link>
          ))}
        </div>
      </section>
    </main>
  );
}
