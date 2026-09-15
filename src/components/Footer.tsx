import Link from 'next/link';
import { FOOTER_COLUMNS, SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="mt-[clamp(56px,7vw,110px)] bg-ink px-[clamp(16px,3vw,32px)] pt-[clamp(44px,5.4vw,76px)] pb-9">
      <div className="max-w-shell mx-auto">
        <div className="grid gap-[clamp(28px,3.4vw,48px)] pb-[clamp(36px,4.4vw,56px)] border-b border-rule-dark [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-[34px] h-[34px] rounded-full bg-orange text-white font-serif text-[15px]">TR</span>
              <span className="font-serif text-[23px] text-paper">{SITE.name}</span>
            </div>
            <p className="mt-4 max-w-[32ch] text-sm leading-relaxed text-muted">
              India, guide by guide. Written on the ground, updated when the timings change.
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="label text-orange pb-4">{col.title}</div>
              <div className="flex flex-col gap-2.5">
                {col.links.map(([label, href]) => (
                  <Link key={label + href} href={href} className="text-sm text-muted-3 hover:text-orange">{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-4 pt-6 text-xs font-medium text-[#6E6858]">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span>Ratings for hotels and restaurants shown via Google Business Profile</span>
        </div>
      </div>
    </footer>
  );
}
