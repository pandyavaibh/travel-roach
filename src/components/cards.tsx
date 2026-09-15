import Link from 'next/link';
import { Placeholder, Badge } from './ui';
import { inr } from '@/lib/site';
import type { Article } from '@/content/articles';
import type { Attraction } from '@/content/places';
import type { Event } from '@/content/events';
import type { Pkg } from '@/content/packages';
import type { Listing } from '@/content/listings';
import { KIND_PRICE_LABEL, KIND_CTA, REVIEW_SOURCE } from '@/content/listings';

export function ArticleCard({ a, href }: { a: Article; href: string }) {
  return (
    <Link href={href} className="card block group">
      <Placeholder className="h-[clamp(150px,15vw,185px)]" />
      <div className="p-5 pb-[22px]">
        <div className="eyebrow">{a.kicker}</div>
        <div className="mt-2.5 font-serif text-[clamp(19px,1.9vw,22px)] leading-[1.16] text-ink group-hover:text-orange">{a.title}</div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-2">{a.dek}</p>
        <div className="mt-3.5 pt-3 border-t border-rule-2 meta">{a.author} · {a.minutes} min</div>
      </div>
    </Link>
  );
}

export function FeaturedArticle({ a, href }: { a: Article; href: string }) {
  return (
    <Link href={href} className="card grid group [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
      <Placeholder className="min-h-[clamp(220px,24vw,320px)]" />
      <div className="p-[clamp(24px,3vw,40px)]">
        <div className="eyebrow">Featured · {a.kicker}</div>
        <h2 className="mt-4 font-serif text-[clamp(25px,3vw,36px)] leading-[1.12] group-hover:text-orange">{a.title}</h2>
        <p className="mt-3.5 text-[15px] leading-relaxed text-ink-3">{a.dek}</p>
        <div className="mt-5 pt-4 border-t border-rule-2 meta">{a.author} · {a.minutes} min read · Updated {a.published}</div>
      </div>
    </Link>
  );
}

export function AttractionCard({ a, href }: { a: Attraction; href: string }) {
  return (
    <Link href={href} className="card block group">
      <div className="relative">
        <Placeholder className="h-[clamp(170px,17vw,210px)]" />
        <span className="absolute top-0 left-0 bg-ink text-paper px-4 py-2.5 font-serif text-[20px] leading-none">{String(a.rank).padStart(2, '0')}</span>
      </div>
      <div className="p-5 pb-[22px]">
        <div className="eyebrow">{a.category}</div>
        <div className="mt-2.5 font-serif text-[21px] leading-[1.15] text-ink group-hover:text-orange">{a.name}</div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-2">{a.summary}</p>
        <div className="mt-3.5 pt-3 border-t border-rule-2 meta">{a.timeNeeded} · {a.entryFee}</div>
      </div>
    </Link>
  );
}

export function EventRow({ e, href }: { e: Event; href: string }) {
  const d = new Date(e.startsOn);
  return (
    <Link href={href} className="card grid items-center gap-[clamp(14px,2vw,24px)] p-[clamp(16px,2vw,22px)] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] group">
      <div className="flex items-center gap-[18px] min-w-0">
        <span className="shrink-0 w-[76px] bg-sand text-center py-3.5">
          <span className="block font-serif text-[27px] leading-none">{String(d.getUTCDate()).padStart(2, '0')}</span>
          <span className="block label text-orange-deep mt-1.5">{d.toLocaleString('en', { month: 'short', timeZone: 'UTC' })}</span>
        </span>
        <span className="min-w-0">
          <span className="block font-serif text-[clamp(19px,1.9vw,23px)] leading-[1.15] text-ink group-hover:text-orange">{e.name}</span>
          <span className="block meta mt-2">{e.venue}</span>
          <span className="block mt-2 text-[13px] leading-relaxed text-ink-3">{e.note}</span>
        </span>
      </div>
      <div className="flex items-center justify-end gap-3.5 flex-wrap">
        <Badge tone={e.ticketed ? 'teal' : 'sand'}>{e.ticketed ? 'Ticketed' : 'Free'}</Badge>
        {e.bookAhead && <span className="meta text-right">{e.bookAhead}</span>}
      </div>
    </Link>
  );
}

export function PackageRow({ p, href }: { p: Pkg; href: string }) {
  return (
    <div className="card p-[clamp(18px,2vw,24px)] grid items-center gap-[clamp(16px,2vw,26px)] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
      <div className="flex items-center gap-[18px] min-w-0">
        <span className="shrink-0 w-[72px] bg-teal text-white text-center py-[15px]">
          <span className="block font-serif text-[29px] leading-none">{String(p.days).padStart(2, '0')}</span>
          <span className="block label text-teal-2 mt-1.5">Days</span>
        </span>
        <span className="min-w-0">
          <Link href={href} className="block font-serif text-[clamp(19px,1.9vw,23px)] leading-[1.14] text-ink hover:text-orange">{p.name}</Link>
          <span className="block meta mt-2">{p.route}</span>
          <span className="block mt-2 text-[13px] leading-relaxed text-ink-3">{p.note}</span>
        </span>
      </div>
      <div className="flex items-center justify-end gap-4 flex-wrap">
        <span className="text-right">
          <span className="block label">From, per person</span>
          <span className="block font-serif text-[22px] leading-none mt-1.5">{inr(p.priceFrom)}</span>
          <span className="block text-[11px] font-medium text-muted-3 mt-1.5">Sold by {p.sellers} operators</span>
        </span>
        <Link href={href} className="btn-primary">View plan</Link>
      </div>
    </div>
  );
}

export function ListingCard({ l, href }: { l: Listing; href: string }) {
  const [cta] = KIND_CTA[l.kind];
  return (
    <div className="card p-[clamp(18px,2vw,26px)] grid gap-[clamp(18px,2vw,28px)] items-start [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
      <div className="flex gap-[18px] items-start min-w-0">
        <Placeholder className="w-[78px] h-[78px] shrink-0" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href={href} className="font-serif text-[clamp(20px,2vw,25px)] leading-[1.1] text-ink hover:text-orange">{l.name}</Link>
            {l.verified && <Badge>Verified</Badge>}
          </div>
          <div className="meta mt-2">{l.meta}</div>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-3">{l.blurb}</p>
          <div className="flex gap-1.5 flex-wrap mt-3.5">
            {l.tags.map((t) => (
              <span key={t} className="border border-rule bg-paper rounded-full px-3 py-1.5 text-xs text-ink-2">{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-end justify-end gap-5 flex-wrap">
        <div className="text-right">
          <div className="font-serif text-[clamp(26px,2.6vw,34px)] leading-none">{l.rating.toFixed(1)}</div>
          <div className="meta mt-1.5">{l.reviews.toLocaleString('en-IN')} reviews</div>
          <div className="text-[11px] font-medium text-muted-3 mt-1.5">{REVIEW_SOURCE[l.kind]}</div>
        </div>
        <div className="text-right">
          <div className="label">{KIND_PRICE_LABEL[l.kind]}</div>
          <div className="font-serif text-[clamp(19px,2vw,23px)] leading-none mt-2">{inr(l.priceFrom)}</div>
        </div>
        <Link href={href} className="btn-primary">{cta}</Link>
      </div>
    </div>
  );
}
