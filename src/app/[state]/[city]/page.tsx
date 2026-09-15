import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Rail from '@/components/Rail';
import { Breadcrumb, SectionHead, StatPills, Placeholder, Badge } from '@/components/ui';
import { ArticleCard, AttractionCard, EventRow, PackageRow, ListingCard } from '@/components/cards';
import { STATE_BY_SLUG } from '@/content/states';
import { CITIES, CITY_BY_KEY, citiesOf } from '@/content/cities';
import { articlesFor } from '@/content/articles';
import { attractionsFor } from '@/content/places';
import { eventsFor } from '@/content/events';
import { packagesFor } from '@/content/packages';
import { listingsFor } from '@/content/listings';
import { CITY_SECTIONS } from '@/lib/site';

export const revalidate = 3600;
export function generateStaticParams() {
  return CITIES.map((c) => ({ state: c.stateSlug, city: c.slug }));
}

type Props = { params: Promise<{ state: string; city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city } = await params;
  const c = CITY_BY_KEY.get(state + '/' + city);
  if (!c) return {};
  return { title: c.name + ' travel guide', description: c.intro };
}

export default async function CityPage({ params }: Props) {
  const { state, city } = await params;
  const c = CITY_BY_KEY.get(state + '/' + city);
  const s = STATE_BY_SLUG.get(state);
  if (!c || !s) notFound();

  const base = `/${state}/${city}`;
  const things = articlesFor(state, city, 'things-to-do');
  const food = articlesFor(state, city, 'food');
  const reach = articlesFor(state, city, 'how-to-reach');
  const near = articlesFor(state, city, 'nearby');
  const attractions = attractionsFor(state, city);
  const events = eventsFor(state, city);
  const packages = packagesFor(state, city);
  const hotels = listingsFor(state, city, 'hotels');
  const restaurants = listingsFor(state, city, 'restaurants');
  const agents = listingsFor(state, city, 'travel-agents');

  const counts: Record<string, number> = {
    'things-to-do': things.length, attractions: attractions.length, itineraries: packages.length,
    food: food.length, 'how-to-reach': reach.length, hotels: hotels.length,
    nearby: near.length, festivals: events.length, restaurants: restaurants.length,
    'travel-agents': agents.length,
  };

  return (
    <main>
      <section className="shell pt-[clamp(24px,3vw,40px)]">
        <Breadcrumb items={[['India', '/'], [s.name, '/' + state], [c.name, null]]} />
        <h1 className="m-0 mt-[clamp(16px,2vw,26px)] text-[clamp(46px,9vw,126px)] leading-[.94] tracking-[-.035em]">{c.name}</h1>
        <div className="flex flex-wrap items-end justify-between gap-6 mt-[clamp(18px,2.4vw,30px)]">
          <p className="m-0 max-w-[50ch] text-[clamp(15px,1.4vw,18px)] leading-[1.55] text-ink-3">{c.tagline}. {c.intro}</p>
          <StatPills items={[['Best time', c.bestSeason], ['Days', c.daysNeeded], ['Budget', c.dailyBudget], ['Airport', c.nearestAirport]]} />
        </div>
        <Placeholder className="h-[clamp(240px,32vw,440px)] mt-[clamp(26px,3.4vw,44px)]" label={`CITY HERO — ${c.name}`} />
      </section>

      <div className="sticky top-[72px] z-[60] bg-paper border-b border-rule mt-[clamp(28px,3.4vw,44px)]">
        <div className="shell rail flex gap-2 overflow-x-auto py-2.5">
          {CITY_SECTIONS.map((sec) => (
            <Link key={sec.slug} href={`${base}/${sec.slug}`} className="pill pill-off">
              {sec.label}<span className="opacity-60 font-medium">{counts[sec.slug]}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Things to do */}
      <section className="pt-[clamp(28px,4vw,52px)]">
        <div className="shell">
          <SectionHead eyebrow={`${things.length} articles`} title="Things to do"
            more="All things to do" moreHref={`${base}/things-to-do`} />
        </div>
        <Rail ariaLabel="things to do">
          {things.slice(0, 8).map((a) => (
            <div key={a.slug} className="snap-start shrink-0 w-[clamp(250px,24vw,320px)]">
              <ArticleCard a={a} href={`${base}/things-to-do/${a.slug}`} />
            </div>
          ))}
        </Rail>
      </section>

      {/* Attractions */}
      <section className="pt-[clamp(28px,4vw,52px)]">
        <div className="shell">
          <SectionHead eyebrow={`${attractions.length} places`} title="Attractions"
            lede="Timings, entry fees, how long you need and what is nearby."
            more="All attractions" moreHref={`${base}/attractions`} />
          <div className="grid gap-[clamp(12px,1.4vw,18px)] mt-7 [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))]">
            {attractions.slice(0, 4).map((a) => (
              <AttractionCard key={a.slug} a={a} href={`${base}/attractions/${a.slug}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Itineraries */}
      <section className="shell pt-[clamp(28px,4vw,52px)]">
        <SectionHead eyebrow={`${packages.length} packages`} title="Itineraries"
          more="All itineraries" moreHref={`${base}/itineraries`} />
        <div className="flex flex-col gap-3 mt-6">
          {packages.slice(0, 3).map((p) => <PackageRow key={p.slug} p={p} href={`${base}/itineraries/${p.slug}`} />)}
        </div>
      </section>

      {/* Food */}
      <section className="pt-[clamp(28px,4vw,52px)]">
        <div className="shell">
          <SectionHead eyebrow={`${food.length} articles`} title="Food"
            lede="Recipes, thali houses, street food and the cafés worth a morning."
            more="All food guides" moreHref={`${base}/food`} />
          <div className="grid gap-[clamp(12px,1.4vw,18px)] mt-7 [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))]">
            {food.slice(0, 4).map((a) => <ArticleCard key={a.slug} a={a} href={`${base}/food/${a.slug}`} />)}
          </div>
        </div>
      </section>

      {/* Where to stay */}
      <section className="shell pt-[clamp(28px,4vw,52px)]">
        <SectionHead eyebrow={`${hotels.length} properties`} title="Where to stay"
          lede="Owner-managed listings. Ratings sync nightly from Google Business Profile."
          more="All hotels" moreHref={`${base}/hotels`} />
        <div className="flex flex-col gap-3.5 mt-6">
          {hotels.slice(0, 3).map((l) => <ListingCard key={l.slug} l={l} href={`${base}/hotels/${l.slug}`} />)}
        </div>
      </section>

      {/* Restaurants */}
      <section className="shell pt-[clamp(28px,4vw,52px)]">
        <SectionHead eyebrow={`${restaurants.length} places`} title="Restaurants"
          lede="Cuisine, meal, price for two and what each one is good for."
          more="All restaurants" moreHref={`${base}/restaurants`} />
        <div className="flex flex-col gap-3.5 mt-6">
          {restaurants.slice(0, 3).map((l) => <ListingCard key={l.slug} l={l} href={`${base}/restaurants/${l.slug}`} />)}
        </div>
      </section>

      {/* How to reach + Near by */}
      <section className="shell pt-[clamp(28px,4vw,52px)] grid gap-[clamp(24px,3vw,48px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <div>
          <SectionHead eyebrow={`${reach.length} guides`} title="How to reach" more="All routes" moreHref={`${base}/how-to-reach`} />
          <div className="hair mt-6 [grid-template-columns:1fr]">
            {reach.slice(0, 4).map((a) => (
              <Link key={a.slug} href={`${base}/how-to-reach/${a.slug}`} className="block bg-white p-4 hover:bg-paper">
                <div className="label">{a.kicker}</div>
                <div className="font-serif text-[19px] leading-tight text-ink mt-2">{a.title}</div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <SectionHead eyebrow={`${near.length} trips`} title={`Near ${c.name}`} more="All day trips" moreHref={`${base}/nearby`} />
          <div className="hair mt-6 [grid-template-columns:1fr]">
            {near.slice(0, 4).map((a) => (
              <Link key={a.slug} href={`${base}/nearby/${a.slug}`} className="block bg-white p-4 hover:bg-paper">
                <div className="label">{a.kicker}</div>
                <div className="font-serif text-[19px] leading-tight text-ink mt-2">{a.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Festivals */}
      <section className="shell pt-[clamp(28px,4vw,52px)]">
        <SectionHead eyebrow={`${events.length} events`} title="Fairs & festivals"
          more="Full calendar" moreHref={`${base}/festivals`} />
        <div className="flex flex-col gap-3 mt-6">
          {events.slice(0, 4).map((e) => <EventRow key={e.slug} e={e} href={`${base}/festivals/${e.slug}`} />)}
        </div>
      </section>

      {/* Agents */}
      <section className="bg-ink mt-[clamp(36px,4.6vw,64px)] py-[clamp(40px,5.4vw,76px)]">
        <div className="shell flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow">Booking help</div>
            <h2 className="m-0 mt-3.5 max-w-[18ch] text-[clamp(30px,4.4vw,60px)] leading-[1.03] tracking-[-.03em] text-paper">
              {agents.filter((a) => a.verified).length} verified agents in {c.name}
            </h2>
            <p className="m-0 mt-4 max-w-[44ch] text-[15px] leading-relaxed text-muted">
              Checked against the state tourism register or an IATA accreditation. Sorted by rating and response time — placement is not for sale.
            </p>
          </div>
          <Link href={`${base}/travel-agents`} className="btn-primary min-h-[52px] px-[30px] text-[15px]">See the list</Link>
        </div>
      </section>

      {/* Other cities */}
      <section className="shell pt-[clamp(36px,4.6vw,64px)]">
        <SectionHead eyebrow={s.name} title={`Other cities in ${s.name}`} more={`All of ${s.name}`} moreHref={'/' + state} />
        <div className="hair mt-6 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          {citiesOf(state).filter((x) => x.slug !== city).slice(0, 8).map((x) => (
            <Link key={x.slug} href={`/${state}/${x.slug}`} className="block bg-white p-5 hover:bg-paper">
              <div className="font-serif text-[21px] leading-tight text-ink">{x.name}</div>
              <div className="meta mt-2">{x.tagline}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
