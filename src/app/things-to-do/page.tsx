import Link from 'next/link';
import type { Metadata } from 'next';
import Rail from '@/components/Rail';
import { SectionHead, Placeholder, Breadcrumb } from '@/components/ui';
import { STATES, REGION_ORDER } from '@/content/states';
import { CITIES, citiesOf } from '@/content/cities';
import { ATTRACTIONS } from '@/content/places';
import { HUBS } from '@/lib/site';

export const revalidate = 3600;
const HUB = HUBS['things-to-do'];

export const metadata: Metadata = { title: HUB.title, description: HUB.intro };

export default function HubPage() {
  const rail = ATTRACTIONS.filter((_, i) => i % 37 === 0).slice(0, 8);
  return (
    <main>
      <section className="shell pt-[clamp(24px,3vw,40px)]">
        <Breadcrumb items={[['India','/'], [HUB.title, null]]} />
        <h1 className="m-0 mt-[clamp(14px,1.8vw,24px)] max-w-[16ch] text-[clamp(44px,8vw,112px)] leading-[.95] tracking-[-.035em]">{HUB.title}</h1>
        <p className="mt-[clamp(16px,2vw,26px)] max-w-[56ch] text-[clamp(15px,1.5vw,18px)] leading-[1.55] text-ink-3">{HUB.intro}</p>
      </section>

      <section className="shell pt-[clamp(28px,3.6vw,48px)]">
        <div className="hair [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {HUB.groups.map((g) => (
            <div key={g.title} className="bg-white p-6 pb-7">
              <div className="label text-orange pb-3.5 border-b border-rule">{g.title}</div>
              <div className="flex flex-col gap-0.5 pt-2">
                {g.links.map(([label, href]) => (
                  <Link key={label} href={href} className="flex items-center min-h-[44px] text-sm text-ink-2 hover:text-orange">{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-[clamp(36px,4.6vw,64px)]">
        <div className="shell"><SectionHead eyebrow="Editor's picks" title="Worth planning a trip around" /></div>
        <Rail ariaLabel="picks">
          {rail.map((a) => (
            <Link key={a.slug} href={`/${a.stateSlug}/${a.citySlug}/attractions/${a.slug}`}
              className="snap-start shrink-0 w-[clamp(250px,24vw,320px)] group">
              <div className="relative">
                <Placeholder className="h-[clamp(230px,24vw,300px)]" />
                <span className="absolute top-3.5 left-3.5 bg-paper text-ink rounded-full px-3.5 py-[7px] text-[11px] font-semibold">{a.category}</span>
              </div>
              <div className="pt-4">
                <div className="font-serif text-[clamp(20px,2vw,25px)] leading-[1.1] text-ink group-hover:text-orange">{a.name}</div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-2">{a.summary}</p>
              </div>
            </Link>
          ))}
        </Rail>
      </section>

      <section className="bg-ink mt-[clamp(20px,3vw,40px)] py-[clamp(40px,5.4vw,76px)]">
        <div className="shell">
          <h2 className="m-0 max-w-[20ch] text-[clamp(28px,4.2vw,56px)] leading-[1.04] tracking-[-.03em] text-paper">Browse by state</h2>
          {REGION_ORDER.map((region) => {
            const states = STATES.filter((s) => s.region === region);
            if (!states.length) return null;
            return (
              <div key={region} className="mt-[clamp(22px,3vw,36px)]">
                <div className="label text-muted pb-3.5 border-b border-rule-dark">{region}</div>
                <div className="hair hair-dark mt-px [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
                  {states.map((s) => (
                    <Link key={s.slug} href={'/' + s.slug}
                      className="flex items-center justify-between gap-3 bg-ink px-5 py-4 min-h-[44px] hover:bg-[#221F1A]">
                      <span className="font-serif text-[19px] leading-tight text-paper">{s.name}</span>
                      <span className="meta">{citiesOf(s.slug).length}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="shell pt-[clamp(36px,4.6vw,64px)]">
        <SectionHead eyebrow="Cities" title="Every city guide" />
        <div className="hair mt-7 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          {CITIES.map((c) => (
            <Link key={c.stateSlug + c.slug} href={`/${c.stateSlug}/${c.slug}`} className="block bg-white p-5 hover:bg-paper">
              <div className="font-serif text-[20px] leading-tight text-ink">{c.name}</div>
              <div className="meta mt-2">{c.tagline}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
