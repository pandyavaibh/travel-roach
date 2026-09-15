import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';

export const metadata: Metadata = { title: "Write for us", description: "We commission writers who live in the places they write about, and we pay on acceptance." };

export default function Page() {
  return (
    <main className="shell pt-[clamp(24px,3vw,40px)]">
      <Breadcrumb items={[['India','/'], ["Write for us", null]]} />
      <h1 className="m-0 mt-[clamp(14px,1.8vw,24px)] max-w-[18ch] text-[clamp(38px,6.4vw,88px)] leading-[.98] tracking-[-.033em]">Write for us</h1>
      <p className="mt-5 max-w-[56ch] text-[clamp(16px,1.6vw,20px)] leading-[1.5] text-ink-3">We commission writers who live in the places they write about, and we pay on acceptance.</p>
      <div className="prose-r mt-[clamp(26px,3.4vw,44px)]">
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">What we publish</h2>
        <p>City guides, single-subject pieces and practical explainers. The bar is simple: the piece should contain something a traveller cannot find by searching, and everything in it should have been checked in person.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">What we do not publish</h2>
        <p>Round-ups assembled from other round-ups, sponsored coverage, and anything written from a press trip without disclosure.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Rates</h2>
        <p>We pay per commissioned piece rather than per word, agreed before you start. Rates rise for writers we work with regularly.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Pitching</h2>
        <p>Send two paragraphs on the idea, one line on why you are the person to write it, and two links to previous work. Pitches for places we already cover need to say what is missing from the existing guide.</p>
        <p>Pitch to editors@travelroach.com. We reply to every pitch, usually within a fortnight.</p>
      </div>
      
    </main>
  );
}
