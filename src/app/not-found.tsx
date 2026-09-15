import Link from 'next/link';
import { STATES } from '@/content/states';

export default function NotFound() {
  const picks = STATES.slice(0, 8);
  return (
    <main className="shell py-[clamp(48px,8vw,110px)]">
      <div className="eyebrow">404</div>
      <h1 className="mt-4 max-w-[18ch] text-[clamp(38px,6.4vw,88px)] leading-[.98] tracking-[-.033em]">We have not written that one yet</h1>
      <p className="mt-5 max-w-[52ch] text-[clamp(15px,1.5vw,18px)] leading-relaxed text-ink-3">
        The page you asked for does not exist. Try one of the state hubs below, or search.
      </p>
      <div className="flex flex-wrap gap-2.5 mt-7">
        <Link href="/" className="btn-primary">Home</Link>
        <Link href="/search" className="btn-outline">Search guides</Link>
        <Link href="/destinations" className="btn-outline">All destinations</Link>
      </div>
      <div className="hair mt-10 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        {picks.map((s) => (
          <Link key={s.slug} href={'/' + s.slug} className="block bg-white p-5 hover:bg-paper">
            <div className="font-serif text-[21px] text-ink">{s.name}</div>
            <div className="meta mt-2">{s.tagline}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
