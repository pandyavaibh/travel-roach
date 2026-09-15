import Link from 'next/link';
import Rail from '@/components/Rail';
import { SectionHead, Placeholder } from '@/components/ui';
import { STATES, REGION_ORDER } from '@/content/states';
import { CITIES, citiesOf } from '@/content/cities';
import { ATTRACTIONS } from '@/content/places';
import { POPULAR, INTERESTS, totalCities, totalStates } from '@/lib/site';

export const revalidate = 3600;

const SEASONAL = [
  ['gujarat','bhuj','Nov – Feb','White salt to the horizon. Go on a full moon.'],
  ['karnataka','hampi','Oct – Feb','Fourteen square miles of boulders and ruins.'],
  ['kerala','alappuzha','Sep – Mar','Houseboat, or the ₹40 public ferry that beats it.'],
  ['rajasthan','jaisalmer','Nov – Feb','A fort people still live inside.'],
  ['west-bengal','sundarbans','Nov – Mar','Mangrove tiger country, reachable only by boat.'],
  ['himachal-pradesh','spiti','Jun – Sep','Monasteries above 4,000m. The road closes in October.'],
  ['madhya-pradesh','bandhavgarh','Oct – Jun','The highest tiger density in India.'],
];

const TRIPS = [
  ['03','One city, properly','Enough for Ahmedabad, Udaipur or Kochi without rushing.'],
  ['05','A state\u2019s greatest hits','Three bases, two long drives, no repeated hotels.'],
  ['07','Gujarat or Rajasthan loop','The full circuit with permits and a driver.'],
  ['10','Golden Triangle plus one','Delhi, Agra, Jaipur — and Ranthambore or Varanasi.'],
  ['15','North to south by train','Six overnight trains, zero internal flights.'],
  ['30','The long way round','Coast to Himalaya, moving every third day.'],
];

export default function HomePage() {
  const byRegion = REGION_ORDER.map((r) => ({ region: r, states: STATES.filter((s) => s.region === r) }));
  const trending = ATTRACTIONS.filter((a) => ['Fort','Temple','Stepwell','Museum','Lake','Monument'].includes(a.category)).slice(0, 6);

  return (
    <main>
      {/* Hero */}
      <section className="shell pt-[clamp(40px,6vw,84px)]">
        <div className="flex items-center gap-2.5 mb-[clamp(20px,3vw,32px)]">
          <span className="inline-flex items-center bg-orange text-white rounded-full px-[15px] py-[7px] text-[11px] font-semibold uppercase tracking-[.1em]">{totalStates} states</span>
          <span className="text-[13px] font-medium text-muted-2">{totalCities} city guides · written on the ground</span>
        </div>
        <h1 className="m-0 max-w-[13ch] text-[clamp(50px,10.5vw,152px)] leading-[.92] tracking-[-.035em]">
          Go where the <em className="italic text-orange">guide</em> has been
        </h1>
        <div className="flex flex-wrap items-end justify-between gap-7 mt-[clamp(26px,4vw,44px)]">
          <p className="m-0 max-w-[46ch] text-[clamp(15px,1.5vw,18px)] leading-[1.55] text-ink-3">
            Timings at the temple gate. The price of the ticket. The last bus back. Every guide checked on the ground, and updated when it changes.
          </p>
          <form action="/search" className="flex flex-wrap items-center gap-2 bg-white border border-rule rounded-full p-[7px] pl-[22px] min-w-[min(100%,420px)]">
            <input name="q" placeholder="Where to?" aria-label="Search destinations" className="flex-1 min-w-[120px] py-3 bg-transparent text-base outline-none" />
            <button className="btn-dark px-[26px] min-h-[46px] text-sm">Search</button>
          </form>
        </div>
      </section>

      {/* Popular — traffic driven */}
      <section className="pt-[clamp(40px,5vw,72px)]">
        <div className="shell">
          <SectionHead live eyebrow="Popular destinations" title="Most-read in the last 24 hours"
            lede="Ranked by live traffic across the site, refreshed hourly." />
        </div>
        <div className="shell hair mt-7 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
          {POPULAR.map(([st, ci, move, fg, bar, readers], i) => {
            const city = CITIES.find((c) => c.stateSlug === st && c.slug === ci);
            if (!city) return null;
            return (
              <Link key={st + ci} href={`/${st}/${ci}`} className="block bg-paper p-5 pb-6 hover:bg-white">
                <div className="flex items-center justify-between gap-2.5">
                  <span className="font-serif text-[15px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[11px] font-semibold" style={{ color: fg }}>{move}</span>
                </div>
                <div className="font-serif text-[clamp(20px,2vw,25px)] leading-[1.1] text-ink mt-3.5">{city.name}</div>
                <div className="meta mt-2">{STATES.find((s) => s.slug === st)?.name}</div>
                <div className="h-[5px] bg-rule rounded-full overflow-hidden mt-4">
                  <span className="block h-[5px] bg-orange rounded-full" style={{ width: bar }} />
                </div>
                <div className="meta mt-2.5">{readers} readers</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Seasonal rail */}
      <section className="pt-[clamp(40px,5vw,72px)]">
        <div className="shell">
          <SectionHead eyebrow="Right now" title="In season this month" />
        </div>
        <Rail ariaLabel="seasonal destinations">
          {SEASONAL.map(([st, ci, window, note]) => {
            const city = CITIES.find((c) => c.stateSlug === st && c.slug === ci);
            if (!city) return null;
            return (
              <Link key={st + ci} href={`/${st}/${ci}`} className="snap-start shrink-0 w-[clamp(252px,25vw,330px)] group">
                <div className="relative">
                  <Placeholder className="h-[clamp(300px,32vw,410px)]" label={`PHOTO — ${city.name}`} />
                  <span className="absolute top-3.5 left-3.5 bg-paper text-ink rounded-full px-3.5 py-[7px] text-[11px] font-semibold">{window}</span>
                </div>
                <div className="pt-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-serif text-[clamp(21px,2.2vw,27px)] leading-[1.1] text-ink group-hover:text-orange">{city.name}</span>
                    <span className="meta">{STATES.find((s) => s.slug === st)?.name}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-2">{note}</p>
                </div>
              </Link>
            );
          })}
        </Rail>
      </section>

      {/* States by region */}
      <section className="bg-teal mt-[clamp(20px,3vw,40px)] py-[clamp(44px,6vw,84px)]">
        <div className="shell">
          <h2 className="m-0 max-w-[17ch] text-[clamp(32px,5vw,72px)] leading-[1.02] tracking-[-.03em] text-paper">
            Pick a state.<br />We know all {totalStates}.
          </h2>
          {byRegion.map(({ region, states }) => (
            <div key={region} className="mt-[clamp(28px,4vw,44px)]">
              <div className="flex items-center gap-3 pb-4 border-b border-teal-line">
                <span className="label text-teal-soft">{region}</span>
                <span className="text-[11px] font-medium text-teal-soft">{states.length}</span>
              </div>
              <div className="hair hair-teal mt-px [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
                {states.map((s) => (
                  <Link key={s.slug} href={'/' + s.slug} className="block bg-teal p-6 pb-7 hover:bg-[#0D5A54]">
                    <div className="flex items-baseline justify-between gap-3.5">
                      <span className="font-serif text-[clamp(20px,2vw,25px)] leading-[1.1] text-paper">{s.name}</span>
                      <span className="label text-teal-soft">{s.kind}</span>
                    </div>
                    <p className="mt-2.5 min-h-[40px] text-[13px] leading-relaxed text-teal-3">{s.tagline}</p>
                    <div className="mt-4 pt-3.5 border-t border-teal-line text-[12px] font-medium text-teal-soft">
                      {citiesOf(s.slug).length} city {citiesOf(s.slug).length === 1 ? 'guide' : 'guides'}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best places */}
      <section className="pt-[clamp(44px,6vw,84px)]">
        <div className="shell">
          <SectionHead live eyebrow="Best places to visit · trending today" title="What people are reading about"
            more="All places" moreHref="/places" />
          <div className="grid gap-[clamp(14px,1.6vw,22px)] mt-7 [grid-template-columns:repeat(auto-fit,minmax(290px,1fr))]">
            {trending.map((a, i) => (
              <Link key={a.slug + i} href={`/${a.stateSlug}/${a.citySlug}/attractions/${a.slug}`} className="card block group">
                <div className="relative">
                  <Placeholder className="h-[clamp(200px,20vw,250px)]" />
                  <span className="absolute top-0 left-0 bg-ink text-paper px-4 py-2.5 font-serif text-[22px] leading-none">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="p-[22px] pb-6">
                  <div className="font-serif text-[clamp(21px,2vw,26px)] leading-[1.12] text-ink group-hover:text-orange">{a.name}</div>
                  <div className="label mt-2.5">{a.category} · {a.citySlug.replace(/-/g, ' ')}</div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-3">{a.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interests */}
      <section className="pt-[clamp(44px,6vw,84px)]">
        <div className="shell">
          <SectionHead eyebrow="Things to do" title="Travel by interest"
            lede="Pick the thing you actually want to do. Every interest carries its own guides, seasons and states." />
          <div className="grid gap-[clamp(12px,1.4vw,18px)] mt-7 [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
            {INTERESTS.map(([name, count, season], i) => (
              <Link key={name} href="/things-to-do"
                className={`block border p-[22px] pb-[26px] ${i % 3 === 0 ? 'bg-sand border-sand-rule' : 'bg-white border-rule'} hover:border-ink`}>
                <Placeholder className="h-[clamp(96px,10vw,130px)]" />
                <div className="font-serif text-[clamp(19px,1.9vw,23px)] leading-[1.1] text-ink mt-[18px]">{name}</div>
                <div className="flex items-center justify-between gap-2.5 mt-2.5">
                  <span className="meta">{count} guides</span>
                  <span className="label text-orange-deep">{season}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Itinerary lengths */}
      <section className="bg-orange mt-[clamp(44px,6vw,84px)] py-[clamp(44px,6vw,80px)]">
        <div className="shell flex flex-wrap items-end justify-between gap-6">
          <h2 className="m-0 max-w-[15ch] text-[clamp(32px,5vw,68px)] leading-[1.02] tracking-[-.03em] text-white">How many days have you got?</h2>
          <p className="m-0 max-w-[34ch] text-[15px] leading-relaxed text-[#FFE3CB]">Day-by-day plans built around the season, the permits and the drive times.</p>
        </div>
        <div className="rail flex gap-[clamp(12px,1.4vw,20px)] overflow-x-auto snap-x snap-mandatory px-[clamp(16px,3vw,32px)] pt-[clamp(26px,3.5vw,40px)]">
          {TRIPS.map(([days, name, note]) => (
            <Link key={days} href="/destinations" className="snap-start shrink-0 w-[clamp(230px,23vw,290px)] bg-paper p-6 pb-7 block">
              <div className="font-serif text-[clamp(46px,5vw,66px)] leading-none text-ink">{days}</div>
              <div className="label text-orange-deep mt-2.5">Days</div>
              <div className="font-serif text-[19px] leading-tight mt-5 text-ink">{name}</div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted-2">{note}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
