import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb, SectionHead } from '@/components/ui';
import { STATES } from '@/content/states';
import { CITIES } from '@/content/cities';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata: Metadata = { title: 'Plan a trip', description: 'Tell us the dates and the shape of the trip, and we will point you at the guides and the operators that fit.' };

const LENGTHS = [
  ['03','A long weekend','One city, properly, without rushing.'],
  ['05','Five days','A state\u2019s greatest hits — three bases, two long drives.'],
  ['07','A week','The full circuit of one state, with permits and a driver.'],
  ['10','Ten days','Golden Triangle plus one, or a two-state loop.'],
  ['15','A fortnight','North to south by train, no internal flights.'],
  ['30','A month','Coast to Himalaya, moving every third day.'],
];

export default function PlanPage() {
  return (
    <main>
      <section className="shell pt-[clamp(24px,3vw,40px)]">
        <Breadcrumb items={[['India','/'], ['Plan a trip', null]]} />
        <h1 className="m-0 mt-[clamp(14px,1.8vw,24px)] max-w-[16ch] text-[clamp(38px,6.4vw,88px)] leading-[.98] tracking-[-.033em]">Plan a trip</h1>
        <p className="mt-5 max-w-[54ch] text-[clamp(16px,1.6vw,20px)] leading-[1.5] text-ink-3">
          Start with how long you have. The length of the trip decides more than the destination does.
        </p>
      </section>

      <section className="shell pt-[clamp(28px,3.6vw,48px)]">
        <div className="hair [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
          {LENGTHS.map(([days, name, note]) => (
            <Link key={days} href="/destinations" className="block bg-white p-6 pb-7 hover:bg-paper">
              <div className="font-serif text-[clamp(40px,4.4vw,58px)] leading-none text-ink">{days}</div>
              <div className="label text-orange-deep mt-2.5">Days</div>
              <div className="font-serif text-[19px] leading-tight mt-5 text-ink">{name}</div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted-2">{note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell pt-[clamp(36px,4.6vw,64px)] grid gap-[clamp(26px,3.4vw,56px)] items-start [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <div>
          <SectionHead eyebrow="Or start with a place" title="Pick a state" more="All destinations" moreHref="/destinations" />
          <div className="hair mt-7 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
            {STATES.slice(0, 12).map((s) => (
              <Link key={s.slug} href={'/' + s.slug} className="block bg-white p-5 hover:bg-paper">
                <div className="font-serif text-[19px] leading-tight text-ink">{s.name}</div>
                <div className="meta mt-2">{s.bestSeason}</div>
              </Link>
            ))}
          </div>
        </div>
        <EnquiryForm listing="Trip planning" kind="planning" title="Get help planning"
          note="Tell us the dates and the shape of the trip. We will point you at the guides, and at operators if you want one."
          cta="Send" dateField="Travel dates" />
      </section>
    </main>
  );
}
