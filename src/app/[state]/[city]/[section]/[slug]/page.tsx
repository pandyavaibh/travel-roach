import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb, Placeholder, Badge, StatPills, SectionHead, SampleNote } from '@/components/ui';
import { ArticleCard, AttractionCard, ListingCard } from '@/components/cards';
import EnquiryForm from '@/components/EnquiryForm';
import { STATE_BY_SLUG } from '@/content/states';
import { CITY_BY_KEY } from '@/content/cities';
import { ARTICLES, articlesFor, articleBySlug } from '@/content/articles';
import { attractionsFor, attractionBySlug } from '@/content/places';
import { eventsFor, eventBySlug } from '@/content/events';
import { packagesFor } from '@/content/packages';
import { listingsFor, listingBySlug, REVIEWS_FOR, KIND_FORM, KIND_SINGULAR, KIND_PRICE_LABEL, REVIEW_SOURCE, type Kind } from '@/content/listings';
import { sectionDef, inr } from '@/lib/site';

export const revalidate = 3600;

/* Detail pages render on demand and are then cached (ISR). Pre-rendering all
   ~10,000 of them at build time would make deploys take twenty minutes for no
   real gain — the first visitor pays a few hundred milliseconds, nobody else does.
   To pre-render the busiest ones, return a subset here instead of an empty array. */
export function generateStaticParams() {
  return ARTICLES.filter((a) => a.citySlug === 'ahmedabad')
    .map((a) => ({ state: a.stateSlug, city: a.citySlug, section: a.section, slug: a.slug }));
}

type Props = { params: Promise<{ state: string; city: string; section: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city, section, slug } = await params;
  const a = articleBySlug(state, city, section, slug);
  if (a) return { title: a.title, description: a.dek };
  const at = section === 'attractions' ? attractionBySlug(state, city, slug) : null;
  if (at) return { title: at.name, description: at.summary };
  const l = ['hotels','restaurants','travel-agents'].includes(section) ? listingBySlug(state, city, section as Kind, slug) : null;
  if (l) return { title: l.name, description: l.blurb };
  return {};
}

export default async function DetailPage({ params }: Props) {
  const { state, city, section, slug } = await params;
  const c = CITY_BY_KEY.get(state + '/' + city);
  const s = STATE_BY_SLUG.get(state);
  const def = sectionDef(section);
  if (!c || !s || !def) notFound();

  const base = `/${state}/${city}`;
  const sectionBase = `${base}/${section}`;
  const crumbs: [string, string | null][] = [['India','/'], [s.name, '/' + state], [c.name, base], [def.label, sectionBase]];

  /* ---------------- Article ---------------- */
  const article = articleBySlug(state, city, section, slug);
  if (article) {
    const more = articlesFor(state, city, section).filter((a) => a.slug !== slug).slice(0, 3);
    return (
      <main>
        <article className="shell pt-[clamp(24px,3vw,40px)]">
          <Breadcrumb items={[...crumbs, [article.title, null]]} />
          <div className="eyebrow mt-[clamp(16px,2vw,26px)]">{article.kicker}</div>
          <h1 className="m-0 mt-4 max-w-[20ch] text-[clamp(34px,5.6vw,76px)] leading-[1] tracking-[-.032em]">{article.title}</h1>
          <p className="mt-5 max-w-[56ch] text-[clamp(16px,1.6vw,20px)] leading-[1.5] text-ink-3">{article.dek}</p>
          <div className="meta mt-6 pb-5 border-b border-rule">{article.author} · {article.minutes} min read · Updated {article.published}</div>
          <Placeholder className="h-[clamp(220px,30vw,420px)] mt-6" label="ARTICLE HERO" />
          <div className="prose-r mt-[clamp(26px,3.4vw,44px)]">
            {article.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="bg-sand p-[clamp(24px,3vw,40px)] mt-[clamp(26px,3.4vw,44px)] max-w-[72ch]">
            <div className="label text-orange-deep">Before you go</div>
            <ul className="mt-4 flex flex-col gap-3">
              {article.takeaways.map((t) => (
                <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-ink-3">
                  <span aria-hidden className="text-orange">—</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </article>
        <section className="shell pt-[clamp(40px,5vw,72px)]">
          <SectionHead eyebrow="Keep reading" title={`More ${def.label.toLowerCase()} in ${c.name}`} more="See all" moreHref={sectionBase} />
          <div className="grid gap-[clamp(12px,1.4vw,18px)] mt-7 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {more.map((a) => <ArticleCard key={a.slug} a={a} href={`${sectionBase}/${a.slug}`} />)}
          </div>
        </section>
      </main>
    );
  }

  /* ---------------- Attraction ---------------- */
  if (section === 'attractions') {
    const a = attractionBySlug(state, city, slug);
    if (!a) notFound();
    const near = attractionsFor(state, city).filter((x) => x.slug !== slug).slice(0, 4);
    return (
      <main>
        <section className="shell pt-[clamp(24px,3vw,40px)]">
          <Breadcrumb items={[...crumbs, [a.name, null]]} />
          <div className="flex flex-wrap items-end justify-between gap-6 mt-[clamp(14px,1.8vw,24px)]">
            <div>
              <div className="eyebrow">{a.category} · {c.name}</div>
              <h1 className="m-0 mt-4 max-w-[16ch] text-[clamp(36px,5.6vw,78px)] leading-[1] tracking-[-.032em]">{a.name}</h1>
            </div>
            <Badge tone="sand">#{a.rank} in {c.name}</Badge>
          </div>
          <p className="mt-5 max-w-[54ch] text-[clamp(15px,1.5vw,18px)] leading-[1.55] text-ink-3">{a.summary}</p>
          <Placeholder className="h-[clamp(220px,28vw,400px)] mt-[clamp(22px,3vw,36px)]" label={`PHOTO — ${a.name}`} />
        </section>

        <section className="shell pt-[clamp(26px,3.4vw,44px)]">
          <div className="label border-b border-rule pb-3.5">Plan your visit</div>
          <div className="hair mt-px [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
            {([['Timings', a.timings], ['Entry fee', a.entryFee], ['Time needed', a.timeNeeded], ['Best time', a.bestTime],
               ['Closed on', a.closedOn], ['Photography', a.photography], ['Nearest station', a.nearestStation], ['Accessibility', a.accessibility]] as [string,string][])
              .map(([k, v]) => (
                <div key={k} className="bg-white p-5 pb-6">
                  <div className="label">{k}</div>
                  <div className="font-serif text-[19px] leading-[1.2] text-ink mt-3">{v}</div>
                </div>
              ))}
          </div>
        </section>

        <section className="shell pt-[clamp(30px,4vw,56px)] grid gap-[clamp(26px,3.4vw,56px)] items-start [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div className="min-w-0">
            <h2 className="m-0 text-[clamp(24px,2.8vw,34px)] leading-[1.1] tracking-[-.02em]">History</h2>
            <div className="prose-r mt-4">{a.history.map((p, i) => <p key={i}>{p}</p>)}</div>
            <h2 className="m-0 mt-[clamp(28px,3.4vw,44px)] text-[clamp(24px,2.8vw,34px)] leading-[1.1] tracking-[-.02em]">Practical tips</h2>
            <ul className="mt-4 flex flex-col gap-3 max-w-[72ch]">
              {a.tips.map((t) => (
                <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-ink-3"><span aria-hidden className="text-orange">—</span>{t}</li>
              ))}
            </ul>
          </div>
          <aside className="card">
            <div className="ph h-[200px] relative">
              <span className="absolute left-3.5 bottom-3 text-[9px] font-medium tracking-[.1em] text-[#A79F8E]">MAP — {a.lat.toFixed(3)}, {a.lng.toFixed(3)}</span>
            </div>
            <div className="p-5 pb-6">
              <div className="label">Location</div>
              <p className="mt-3 text-sm leading-relaxed text-ink-3">{a.name}, {c.name}, {s.name}</p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lng}`}
                 target="_blank" rel="noopener noreferrer" className="btn-outline w-full mt-4">Open in Google Maps</a>
            </div>
          </aside>
        </section>

        <section className="shell pt-[clamp(40px,5vw,72px)]">
          <SectionHead eyebrow="Nearby" title={`Other places in ${c.name}`} more="All attractions" moreHref={sectionBase} />
          <div className="grid gap-[clamp(12px,1.4vw,18px)] mt-7 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {near.map((x) => <AttractionCard key={x.slug} a={x} href={`${sectionBase}/${x.slug}`} />)}
          </div>
        </section>
      </main>
    );
  }

  /* ---------------- Event ---------------- */
  if (section === 'festivals') {
    const e = eventBySlug(state, city, slug);
    if (!e) notFound();
    const d = new Date(e.startsOn);
    const others = eventsFor(state, city).filter((x) => x.slug !== slug).slice(0, 4);
    return (
      <main>
        <section className="shell pt-[clamp(24px,3vw,40px)]">
          <Breadcrumb items={[...crumbs, [e.name, null]]} />
          <div className="flex flex-wrap items-end justify-between gap-6 mt-[clamp(14px,1.8vw,24px)]">
            <h1 className="m-0 max-w-[16ch] text-[clamp(36px,5.6vw,78px)] leading-[1] tracking-[-.032em]">{e.name}</h1>
            <Badge tone={e.ticketed ? 'teal' : 'sand'}>{e.ticketed ? 'Ticketed' : 'Free entry'}</Badge>
          </div>
          <p className="mt-5 max-w-[54ch] text-[clamp(15px,1.5vw,18px)] leading-[1.55] text-ink-3">{e.note}</p>
          <div className="mt-[clamp(20px,2.6vw,30px)]">
            <StatPills items={[
              ['Starts', d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })],
              ['Ends', e.endsOn ? new Date(e.endsOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }) : 'One day'],
              ['Venue', e.venue], ['Season', e.season],
              ...(e.priceFrom ? ([['From', e.priceFrom]] as [string,string][]) : []),
            ]} />
          </div>
          <Placeholder className="h-[clamp(200px,26vw,380px)] mt-[clamp(22px,3vw,36px)]" label={`PHOTO — ${e.name}`} />
        </section>
        <section className="shell pt-[clamp(26px,3.4vw,44px)]">
          <div className="prose-r">
            <p>{e.note} Dates shift with the lunar calendar in some years — confirm before booking non-refundable travel.</p>
            <p>{e.ticketed
              ? `Tickets go on sale well ahead and the good nights sell out first. ${e.bookAhead ?? ''} Beds in ${c.name} are the real constraint: rooms within walking distance of the venue are gone months before the event.`
              : `There is no ticket, which means there is no capacity limit either. Arrive early, expect road closures around the venue, and plan to walk the last stretch.`}</p>
          </div>
          <div className="bg-ink p-[clamp(24px,3vw,40px)] mt-[clamp(26px,3.4vw,44px)]">
            <h2 className="m-0 max-w-[22ch] text-[clamp(22px,2.6vw,32px)] leading-[1.16] text-paper">Need beds and transport for {e.name}?</h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted">Listed operators in {c.name} hold allocations for the festival weeks and can arrange transfers when the roads close.</p>
            <div className="flex flex-wrap gap-2.5 mt-6">
              <Link href={`${base}/travel-agents`} className="btn-primary">Travel agents in {c.name}</Link>
              <Link href={`${base}/hotels`} className="btn-outline">Where to stay</Link>
            </div>
          </div>
        </section>
        <section className="shell pt-[clamp(40px,5vw,72px)]">
          <SectionHead eyebrow="Calendar" title={`Other events in ${c.name}`} more="Full calendar" moreHref={sectionBase} />
          <div className="hair mt-7 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
            {others.map((x) => (
              <Link key={x.slug} href={`${sectionBase}/${x.slug}`} className="block bg-white p-5 hover:bg-paper">
                <div className="label">{new Date(x.startsOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })}</div>
                <div className="font-serif text-[20px] leading-tight text-ink mt-2.5">{x.name}</div>
                <div className="meta mt-2">{x.venue}</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  /* ---------------- Package ---------------- */
  if (section === 'itineraries') {
    const p = packagesFor(state, city).find((x) => x.slug === slug);
    if (!p) notFound();
    const others = packagesFor(state, city).filter((x) => x.slug !== slug).slice(0, 4);
    return (
      <main>
        <section className="shell pt-[clamp(24px,3vw,40px)]">
          <Breadcrumb items={[...crumbs, [p.name, null]]} />
          <div className="flex flex-wrap items-end justify-between gap-6 mt-[clamp(14px,1.8vw,24px)]">
            <h1 className="m-0 max-w-[16ch] text-[clamp(36px,5.6vw,78px)] leading-[1] tracking-[-.032em]">{p.name}</h1>
            <Badge>{p.days} {p.days === 1 ? 'day' : 'days'}</Badge>
          </div>
          <p className="mt-5 max-w-[54ch] text-[clamp(15px,1.5vw,18px)] leading-[1.55] text-ink-3">{p.note}</p>
          <div className="mt-[clamp(20px,2.6vw,30px)]">
            <StatPills items={[['Route', p.route], ['From, per person', inr(p.priceFrom)], ['Operators', String(p.sellers)], ['Includes', p.inclusions.join(', ')]]} />
          </div>
        </section>

        <section className="shell pt-[clamp(30px,4vw,56px)] grid gap-[clamp(26px,3.4vw,56px)] items-start [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div className="min-w-0">
            <h2 className="m-0 text-[clamp(24px,2.8vw,34px)] leading-[1.1] tracking-[-.02em]">Day by day</h2>
            <div className="hair mt-5 [grid-template-columns:1fr]">
              {p.dayPlan.map((d) => (
                <div key={d.day} className="bg-white p-5 pb-6 grid gap-4 [grid-template-columns:60px_minmax(0,1fr)] items-start">
                  <span className="bg-teal text-white text-center py-2.5">
                    <span className="block font-serif text-[22px] leading-none">{String(d.day).padStart(2, '0')}</span>
                  </span>
                  <span>
                    <span className="block font-serif text-[20px] leading-tight text-ink">{d.title}</span>
                    <span className="block mt-2 text-sm leading-relaxed text-ink-3">{d.detail}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <aside className="sticky top-[130px]">
            <EnquiryForm listing={p.name} kind="itinerary" title="Get quotes"
              note={`${p.sellers} listed operators run this itinerary. One enquiry reaches the ones that match your dates.`}
              cta="Request quotes" dateField="Travel dates" />
          </aside>
        </section>

        <section className="shell pt-[clamp(40px,5vw,72px)]">
          <SectionHead eyebrow="Itineraries" title={`Other plans for ${c.name}`} more="All itineraries" moreHref={sectionBase} />
          <div className="hair mt-7 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
            {others.map((x) => (
              <Link key={x.slug} href={`${sectionBase}/${x.slug}`} className="block bg-white p-5 hover:bg-paper">
                <div className="label">{x.days} {x.days === 1 ? 'day' : 'days'}</div>
                <div className="font-serif text-[20px] leading-tight text-ink mt-2.5">{x.name}</div>
                <div className="meta mt-2">{inr(x.priceFrom)}</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  /* ---------------- Listing profile ---------------- */
  if (['hotels','restaurants','travel-agents'].includes(section)) {
    const kind = section as Kind;
    const l = listingBySlug(state, city, kind, slug);
    if (!l) notFound();
    const reviews = REVIEWS_FOR(l);
    const form = KIND_FORM[kind];
    const others = listingsFor(state, city, kind).filter((x) => x.slug !== slug).slice(0, 3);

    return (
      <main>
        <section className="shell pt-[clamp(24px,3vw,40px)]">
          <Breadcrumb items={[...crumbs, [l.name, null]]} />
          <div className="grid gap-[clamp(22px,3vw,44px)] items-end mt-[clamp(16px,2vw,26px)] [grid-template-columns:repeat(auto-fit,minmax(290px,1fr))]">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                {l.verified ? <Badge>Verified</Badge> : <Badge tone="sand">Unverified</Badge>}
                <span className="meta">{l.registration}</span>
              </div>
              <h1 className="m-0 mt-4 max-w-[14ch] text-[clamp(36px,5.6vw,74px)] leading-none tracking-[-.032em]">{l.name}</h1>
              <p className="mt-4 max-w-[50ch] text-[clamp(15px,1.4vw,17px)] leading-[1.6] text-ink-3">{l.meta}</p>
            </div>
            <StatPills items={[['Rating', l.rating.toFixed(1)], ['Reviews', l.reviews.toLocaleString('en-IN')],
              [KIND_PRICE_LABEL[kind], inr(l.priceFrom)], ['Since', String(l.established)]]} />
          </div>
          {l.sample && <div className="mt-5"><SampleNote>Business details verified from published sources. The rating and review count are placeholders until the Google Business Profile sync runs.</SampleNote></div>}
          <Placeholder className="h-[clamp(200px,24vw,340px)] mt-[clamp(22px,3vw,36px)]" label="GALLERY — 5 IMAGES" />
        </section>

        <section className="shell pt-[clamp(28px,3.6vw,48px)] grid gap-[clamp(26px,3.4vw,56px)] items-start [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div className="min-w-0">
            <h2 className="m-0 text-[clamp(24px,2.8vw,34px)] leading-[1.1] tracking-[-.02em]">About</h2>
            <div className="prose-r mt-4">{l.about.map((p, i) => <p key={i}>{p}</p>)}</div>

            <h2 className="m-0 mt-[clamp(30px,3.6vw,48px)] text-[clamp(24px,2.8vw,34px)] leading-[1.1] tracking-[-.02em]">
              {kind === 'hotels' ? 'Property details' : kind === 'restaurants' ? 'Restaurant details' : 'At a glance'}
            </h2>
            <div className="hair mt-5 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
              {l.details.map(([k, v]) => (
                <div key={k} className="bg-white p-5 pb-6">
                  <div className="label">{k}</div>
                  <div className="font-serif text-[19px] leading-[1.16] text-ink mt-3">{v}</div>
                </div>
              ))}
            </div>

            <h2 className="m-0 mt-[clamp(30px,3.6vw,48px)] text-[clamp(24px,2.8vw,34px)] leading-[1.1] tracking-[-.02em]">
              {kind === 'hotels' ? 'Room types' : kind === 'restaurants' ? "What's served" : 'Tours & packages'}
            </h2>
            <div className="flex flex-col gap-3 mt-5">
              {l.rows.map((r) => (
                <div key={r.name} className="card p-5 grid gap-4 items-center [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
                  <div className="min-w-0">
                    <div className="font-serif text-[20px] leading-[1.14] text-ink">{r.name}</div>
                    <div className="meta mt-2">{r.meta}</div>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-3">{r.note}</p>
                  </div>
                  <div className="flex items-center justify-end gap-4 flex-wrap">
                    <span className="font-serif text-[22px] leading-none text-ink">{r.price}</span>
                    <a href="#enquire" className="btn-outline">{form.cta}</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4 mt-[clamp(30px,3.6vw,48px)]">
              <h2 className="m-0 text-[clamp(24px,2.8vw,34px)] leading-[1.1] tracking-[-.02em]">Reviews</h2>
              <span className="meta">{REVIEW_SOURCE[kind]}</span>
            </div>
            <div className="flex flex-col gap-3 mt-5">
              {reviews.map((r) => (
                <div key={r.who} className="card p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <span className="text-[15px] font-semibold text-ink">{r.who}</span>
                    <span className="meta">{r.when} · {r.stars}</span>
                  </div>
                  <p className="mt-3 text-sm leading-[1.65] text-ink-3">{r.text}</p>
                  <div className="meta mt-3">Booked: {r.trip}</div>
                </div>
              ))}
            </div>
          </div>

          <aside id="enquire" className="sticky top-[130px] flex flex-col gap-3.5 min-w-0">
            <EnquiryForm listing={l.name} kind={KIND_SINGULAR[kind]} title={form.title} note={form.note} cta={form.cta} dateField={form.dateField} />
            <div className="card p-5">
              <div className="label">Contact</div>
              <div className="flex flex-col gap-2 mt-3.5">
                <a href={`tel:${l.phone.replace(/\s/g, '')}`} className="btn-outline w-full">{l.phone}</a>
                <a href={`https://wa.me/${l.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-outline w-full">WhatsApp</a>
              </div>
            </div>
            <div className="card">
              <div className="ph h-[170px] relative">
                <span className="absolute left-3.5 bottom-3 text-[9px] font-medium tracking-[.1em] text-[#A79F8E]">GOOGLE MAP</span>
              </div>
              <div className="p-5 text-[13px] leading-[1.6] text-muted-2">{l.address}<br /><br />{l.hours}</div>
            </div>
            <div className="bg-sand border border-sand-rule p-5">
              <div className="label text-orange-deep">Own this listing?</div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-ink-3">Claim it to update your details, photos and prices yourself.</p>
              <Link href="/list-your-business" className="btn-dark w-full mt-3.5">Claim this listing</Link>
            </div>
          </aside>
        </section>

        <section className="shell pt-[clamp(40px,5vw,72px)]">
          <SectionHead eyebrow={KIND_SINGULAR[kind]} title={`Other ${def.label.toLowerCase()} in ${c.name}`} more="See all" moreHref={sectionBase} />
          <div className="flex flex-col gap-3.5 mt-7">
            {others.map((x) => <ListingCard key={x.slug} l={x} href={`${sectionBase}/${x.slug}`} />)}
          </div>
        </section>
      </main>
    );
  }

  notFound();
}
