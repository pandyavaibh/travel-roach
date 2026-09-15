import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';

export const metadata: Metadata = { title: "Contact", description: "Corrections, partnership questions and press enquiries all reach the same small team." };

export default function Page() {
  return (
    <main className="shell pt-[clamp(24px,3vw,40px)]">
      <Breadcrumb items={[['India','/'], ["Contact", null]]} />
      <h1 className="m-0 mt-[clamp(14px,1.8vw,24px)] max-w-[18ch] text-[clamp(38px,6.4vw,88px)] leading-[.98] tracking-[-.033em]">Contact</h1>
      <p className="mt-5 max-w-[56ch] text-[clamp(16px,1.6vw,20px)] leading-[1.5] text-ink-3">Corrections, partnership questions and press enquiries all reach the same small team.</p>
      <div className="prose-r mt-[clamp(26px,3.4vw,44px)]">
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Corrections</h2>
        <p>If a timing, fee or closing day on a guide is wrong, that is the most useful email we receive. Include the page and what you found instead, and we will verify and update it.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Listing a business</h2>
        <p>Travel agents, hotels and restaurants can claim or create a listing through the business page rather than by email — it is faster and the verification queue is shorter.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Press and partnerships</h2>
        <p>We work with state tourism boards and publishers on editorial projects, on the condition that coverage stays independent.</p>
        <p>Email us at hello@travelroach.com. We answer within two working days.</p>
      </div>
      <div className="bg-sand p-[clamp(24px,3vw,40px)] mt-[clamp(30px,4vw,56px)] max-w-[72ch]">
        <h2 className="m-0 font-serif text-[clamp(22px,2.6vw,30px)] leading-tight text-ink">Own a business?</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-3">Claim your listing, verify it and manage your own details, photos and prices.</p>
        <Link href="/list-your-business" className="btn-primary mt-5">List your business</Link>
      </div>
    </main>
  );
}
