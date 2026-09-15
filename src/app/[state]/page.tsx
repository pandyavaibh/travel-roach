import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Rail from '@/components/Rail';
import { Breadcrumb, SectionHead, StatPills, Placeholder, Badge } from '@/components/ui';
import { PackageRow, AttractionCard } from '@/components/cards';
import { STATES, STATE_BY_SLUG } from '@/content/states';
import { citiesOf } from '@/content/cities';
import { ATTRACTIONS } from '@/content/places';
import { eventsForState } from '@/content/events';
import { packagesForState } from '@/content/packages';
import { articlesFor } from '@/content/articles';

export const revalidate = 3600;
export function generateStaticParams() { return STATES.map((s) => ({ state: s.slug })); }

type Props = { params: Promise<{ state: string }>; searchParams: Promise<{ food?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const s = STATE_BY_SLUG.get(state);
  if (!s) return {};
  return { title: s.name + ' travel guide', description: s.tagline };
}

export default async function StatePage({ params, searchParams }: Props) {
  const { state } = await params;
  const sp = await searchParams;
  const s = STATE_BY_SLUG.get(state);
  if (!s) notFound();

  const cities = citiesOf(state);
  const places = ATTRACTIONS.filter((a) => a.stateSlug === state).slice(0, 8);
  const packages = packagesForState(state);
  const events = eventsForState(state).slice(0, 8);
  const foodCity = cities.find((c) => c.slug === sp.food) || cities[0];
  const foodArticles = foodCity ? articlesFor(state, foodCity.slug, 'food').slice(0, 4) : [];

  return (
    <main>
      <section className="shell pt-[clamp(24px,3vw,40px)]">
        <Breadcrumb items={[['India', '/'], [s.name, null]]} />
        <div className="flex flex-wrap items-end justify-between gap-7 mt-[clamp(14px,1.8vw,24px)]">
          <h1 className="m-0 text-[clamp(50px,9.5vw,134px)] leading-[.93] tracking-[-.035em]">{s.name}</h1>
          <Badge>{s.region} India · {s.kind}</Badge>
        </div>
        <p className="mt-[clamp(18px,2.2vw,28px)] max-w-[56ch] text-[clamp(15px,1.5vw,18px)] leading-[1.55] text-ink-3">{s.tagline}. {s.intro[0].split('.')[0]}.</p>
        <div className="mt-[clamp(20px,2.6vw,30px)]">
          <StatPills items={[['Best time', s.bestSeason], ['Days needed', s.daysNeeded], ['Budget / day', s.dailyBudget], ['City guides', String(cities.length)], ['Airports', s.airports]]} />
        </div>
        <Placeholder className="h-[clamp(240px,30vw,420px)] mt-[clamp(24px,3.2vw,40px)]" label={`STATE HERO — ${s.name}`} />
      </section>

      {/* Why */}
      <section id="why" className="shell pt-[clamp(30px,4vw,56px)] grid gap-[clamp(28px,4vw,64px)] items-start [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <div>
          <h2 className="m-0 text-[clamp(26px,3.2vw,40px)] leading-[1.06] tracking-[-.02em]">Why {s.name}</h2>
          <div className="prose-r mt-4">{s.intro.map((p, i) => <p key={i}>{p}</p>)}</div>
        </div>
        <blockquote className="m-0 bg-sand p-[clamp(26px,3.4vw,44px)]">
          <p className="m-0 font-serif font-light italic text-[clamp(22px,2.6vw,32px)] leading-[1.32] text-ink">{s.quote}</p>
          <div className="mt-5 label text-orange-deep">{s.quoteBy}</div>
        </blockquote>
      </section>

      {/* Best places */}
      <section id="places" className="pt-[clamp(36px,4.6vw,64px)]">
        <div className="shell"><SectionHead eyebrow="Best places to visit" title="Ranked by what justifies the drive" /></div>
        <Rail ariaLabel="places">
          {places.map((a) => (
            <div key={a.slug} className="snap-start shrink-0 w-[clamp(250px,24vw,320px)]">
              <AttractionCard a={a} href={`/${a.stateSlug}/${a.citySlug}/attractions/${a.slug}`} />
            </div>
          ))}
        </Rail>
      </section>

      {/* City guides */}
      <section id="cities" className="bg-teal mt-[clamp(20px,3vw,40px)] py-[clamp(40px,5.4vw,76px)]">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 className="m-0 text-[clamp(30px,4.4vw,58px)] leading-[1.03] tracking-[-.03em] text-paper">{cities.length} city {cities.length === 1 ? 'guide' : 'guides'}</h2>
            <p className="m-0 max-w-[34ch] text-[15px] leading-relaxed text-teal-3">Each one carries its own things to do, food, festivals, hotels and agents.</p>
          </div>
          <div className="hair hair-teal mt-[clamp(24px,3.2vw,40px)] [grid-template-columns:repeat(auto-fit,minmax(215px,1fr))]">
            {cities.map((c) => (
              <Link key={c.slug} href={`/${state}/${c.slug}`} className="block bg-teal p-[22px] pb-[26px] hover:bg-[#0D5A54]">
                <div className="font-serif text-[clamp(20px,2vw,24px)] leading-[1.1] text-paper">{c.name}</div>
                <p className="mt-2.5 min-h-[38px] text-[13px] leading-relaxed text-teal-3">{c.tagline}</p>
                <div className="mt-3.5 pt-3 border-t border-teal-line text-[12px] font-medium text-teal-soft">{c.daysNeeded} days · {c.bestSeason}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Itineraries */}
      <section id="itineraries" className="shell pt-[clamp(36px,4.6vw,64px)]">
        <SectionHead eyebrow="Itineraries" title={`Packages across ${s.name}`} />
        <div className="flex flex-col gap-3 mt-6">
          {packages.map((p) => <PackageRow key={p.slug} p={p} href={`/${state}/${cities[0]?.slug ?? ''}/itineraries`} />)}
        </div>
      </section>

      {/* Food, city tabs */}
      {cities.length > 0 && (
        <section id="food" className="shell pt-[clamp(36px,4.6vw,64px)]">
          <SectionHead eyebrow="Food" title={`What ${s.name} eats, city by city`} />
          <div className="rail flex gap-2 overflow-x-auto py-4 mt-2">
            {cities.slice(0, 8).map((c) => (
              <Link key={c.slug} href={`/${state}?food=${c.slug}#food`}
                className={`pill ${c.slug === foodCity?.slug ? 'pill-on' : 'pill-off'}`}>{c.name}</Link>
            ))}
          </div>
          <div className="grid gap-[clamp(12px,1.4vw,18px)] [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
            {foodArticles.map((a) => (
              <Link key={a.slug} href={`/${state}/${a.citySlug}/food/${a.slug}`} className="card block group">
                <Placeholder className="h-[clamp(140px,14vw,170px)]" />
                <div className="p-5 pb-[22px]">
                  <div className="font-serif text-[20px] leading-[1.14] text-ink group-hover:text-orange">{a.title}</div>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted-2">{a.dek}</p>
                  <div className="meta mt-3">{foodCity?.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Festivals */}
      <section id="festivals" className="shell pt-[clamp(36px,4.6vw,64px)]">
        <SectionHead eyebrow="Festivals" title="Every dated event in the state"
          lede={`Pulled from all ${cities.length} city calendars.`} />
        <div className="hair mt-6 [grid-template-columns:1fr]">
          {events.map((e) => {
            const d = new Date(e.startsOn);
            return (
              <Link key={e.slug} href={`/${e.stateSlug}/${e.citySlug}/festivals/${e.slug}`}
                className="grid items-center gap-[clamp(14px,2vw,24px)] bg-white p-[18px] px-[clamp(16px,2vw,24px)] [grid-template-columns:84px_minmax(190px,1fr)_auto] group">
                <span className="block bg-sand py-3 px-2 text-center">
                  <span className="block font-serif text-[28px] leading-none text-ink">{String(d.getUTCDate()).padStart(2, '0')}</span>
                  <span className="block label text-orange-deep mt-1.5">{d.toLocaleString('en', { month: 'short', timeZone: 'UTC' })}</span>
                </span>
                <span className="block min-w-0">
                  <span className="block font-serif text-[clamp(19px,1.9vw,23px)] leading-[1.15] text-ink group-hover:text-orange">{e.name}</span>
                  <span className="block meta mt-2">{e.venue}</span>
                  <span className="block mt-2 text-[13px] leading-relaxed text-ink-3">{e.note}</span>
                </span>
                <span className="block text-right"><Badge tone={e.ticketed ? 'teal' : 'sand'}>{e.ticketed ? 'Ticketed' : 'Free'}</Badge></span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How to reach */}
      <section id="reach" className="shell pt-[clamp(36px,4.6vw,64px)]">
        <SectionHead eyebrow="How to reach" title={`Getting into ${s.name}`} />
        <div className="hair mt-6 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {[['By air', s.airports, 'Check which of them has the international traffic before booking.'],
            ['By train', 'Main junction', 'Long-distance services connect to Delhi, Mumbai and the regional capitals.'],
            ['By road', 'State highways', 'Road quality varies by district. A driver for the week often beats internal flights.'],
            ['Getting around', 'Hire a car', `Distances in ${s.name} are longer than they look on a map.`]].map(([k, v, note]) => (
            <div key={k} className="bg-white p-[22px] pb-[26px]">
              <div className="label">{k}</div>
              <div className="font-serif text-[clamp(19px,1.9vw,23px)] leading-[1.15] text-ink mt-3">{v}</div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted-2">{note}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
