import Link from 'next/link';

export function Breadcrumb({ items }: { items: [string, string | null][] }) {
  return (
    <nav aria-label="Breadcrumb" className="meta">
      {items.map(([label, href], i) => (
        <span key={label + i}>
          {i > 0 && <span className="text-rule-3 px-1.5">·</span>}
          {href ? <Link href={href}>{label}</Link> : <span className="text-ink">{label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function SectionHead({ eyebrow, title, lede, more, moreHref, live }: {
  eyebrow: string; title: string; lede?: string; more?: string; moreHref?: string; live?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b border-rule pb-5">
      <div className="min-w-0">
        <div className="eyebrow flex items-center gap-2.5">
          {live && <span className="w-[7px] h-[7px] rounded-full bg-orange pulse-dot" />}
          {eyebrow}
        </div>
        <h2 className="mt-3 text-[clamp(26px,3.4vw,44px)] leading-[1.05] tracking-[-.02em]">{title}</h2>
      </div>
      {lede && <p className="m-0 max-w-[38ch] text-[15px] leading-relaxed text-muted-2">{lede}</p>}
      {more && moreHref && <Link href={moreHref} className="whitespace-nowrap text-[13px] font-semibold text-ink hover:text-orange">{more} →</Link>}
    </div>
  );
}

export function StatPills({ items }: { items: [string, string][] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([k, v]) => (
        <span key={k} className="inline-flex flex-col gap-1.5 border border-rule bg-white rounded-[18px] px-[18px] py-3">
          <span className="label">{k}</span>
          <span className="font-serif text-[19px] leading-none text-ink">{v}</span>
        </span>
      ))}
    </div>
  );
}

export function Placeholder({ className = '', label }: { className?: string; label?: string }) {
  return (
    <div className={`ph relative ${className}`} aria-hidden>
      {label && <span className="absolute left-3.5 bottom-3 text-[9px] font-medium tracking-[.1em] text-[#A79F8E]">{label}</span>}
    </div>
  );
}

export function Badge({ children, tone = 'teal' }: { children: React.ReactNode; tone?: 'teal' | 'sand' | 'ink' }) {
  const tones = {
    teal: 'bg-teal text-white', sand: 'bg-sand text-orange-deep border border-sand-rule', ink: 'bg-ink text-paper',
  };
  return <span className={`inline-block rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.08em] ${tones[tone]}`}>{children}</span>;
}

export function Chips({ items, active, base }: { items: string[]; active: string; base: string }) {
  return (
    <div className="rail flex gap-2 overflow-x-auto">
      {items.map((c) => {
        const on = c === active || (c === 'All' && !active);
        const href = c === 'All' ? base : `${base}?f=${encodeURIComponent(c)}`;
        return <Link key={c} href={href} className={`pill ${on ? 'pill-on' : 'pill-off'}`}>{c}</Link>;
      })}
    </div>
  );
}

export function EmptyState({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
  return (
    <div className="card p-[clamp(26px,3.4vw,44px)] text-center">
      <h3 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight">{title}</h3>
      <p className="mt-3 mx-auto max-w-[52ch] text-[15px] leading-relaxed text-muted-2">{body}</p>
      <Link href={href} className="btn-primary mt-6">{cta}</Link>
    </div>
  );
}

export function SampleNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 bg-sand border border-sand-rule px-[18px] py-3.5">
      <Badge tone="sand">Sample data</Badge>
      <span className="text-[13px] leading-relaxed text-ink-3">{children}</span>
    </div>
  );
}

export function Pagination({ page, pages, base }: { page: number; pages: number; base: string }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <nav className="flex flex-wrap gap-2 pt-8" aria-label="Pagination">
      {nums.map((n) => (
        <Link key={n} href={n === 1 ? base : `${base}?page=${n}`}
          aria-current={n === page ? 'page' : undefined}
          className={`inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full border text-[13px] font-semibold ${n === page ? 'pill-on' : 'pill-off'}`}>{n}</Link>
      ))}
    </nav>
  );
}
