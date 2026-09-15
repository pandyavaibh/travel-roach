import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';

export const metadata: Metadata = { title: "About us", description: "Travel Roach is a guide to India written by people who go, checked against what is actually open, and updated when it changes." };

export default function Page() {
  return (
    <main className="shell pt-[clamp(24px,3vw,40px)]">
      <Breadcrumb items={[['India','/'], ["About us", null]]} />
      <h1 className="m-0 mt-[clamp(14px,1.8vw,24px)] max-w-[18ch] text-[clamp(38px,6.4vw,88px)] leading-[.98] tracking-[-.033em]">About us</h1>
      <p className="mt-5 max-w-[56ch] text-[clamp(16px,1.6vw,20px)] leading-[1.5] text-ink-3">Travel Roach is a guide to India written by people who go, checked against what is actually open, and updated when it changes.</p>
      <div className="prose-r mt-[clamp(26px,3.4vw,44px)]">
        <p>We started because the information travellers needed most — the timing of the aarti, whether the ticket counter takes cards, which gate has the shorter queue — was the information nobody published. Everything else was already written twice over.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">How we work</h2>
        <p>Every guide is written after a visit. Timings, fees and closing days are checked before publication and re-checked on a rolling schedule. When something changes, the date on the page changes with it.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">What we do not do</h2>
        <p>We do not sell placement in the directory. Travel agents, hotels and restaurants are sorted by rating and response time, and no amount of money moves a listing up. Verified badges reflect a document check, not a payment.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Where the money comes from</h2>
        <p>Businesses pay to be verified and to manage their own listing. That is the whole model. It works only if travellers trust the ranking, which is why the ranking is not for sale.</p>
      </div>
      <div className="bg-sand p-[clamp(24px,3vw,40px)] mt-[clamp(30px,4vw,56px)] max-w-[72ch]">
        <h2 className="m-0 font-serif text-[clamp(22px,2.6vw,30px)] leading-tight text-ink">Something out of date?</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-3">If a timing has changed or a place has closed, tell us and we will check it within the week.</p>
        <Link href="/contact" className="btn-primary mt-5">Report a change</Link>
      </div>
    </main>
  );
}
