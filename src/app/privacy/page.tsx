import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';

export const metadata: Metadata = { title: "Privacy policy", description: "What we collect, why, and how to get it deleted." };

export default function Page() {
  return (
    <main className="shell pt-[clamp(24px,3vw,40px)]">
      <Breadcrumb items={[['India','/'], ["Privacy policy", null]]} />
      <h1 className="m-0 mt-[clamp(14px,1.8vw,24px)] max-w-[18ch] text-[clamp(38px,6.4vw,88px)] leading-[.98] tracking-[-.033em]">Privacy policy</h1>
      <p className="mt-5 max-w-[56ch] text-[clamp(16px,1.6vw,20px)] leading-[1.5] text-ink-3">What we collect, why, and how to get it deleted.</p>
      <div className="prose-r mt-[clamp(26px,3.4vw,44px)]">
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">What we collect</h2>
        <p>When you send an enquiry we collect your name, email, phone number if you give one, your travel dates and your message. That is passed to the business you contacted so they can reply. We keep a copy so we can resolve disputes.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Analytics</h2>
        <p>We record page views to rank popular destinations. This is aggregate traffic data and is not tied to your identity.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">What we do not do</h2>
        <p>We do not sell your details, and we do not pass your enquiry to businesses other than the one you contacted.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Deletion</h2>
        <p>Email privacy@travelroach.com and we will delete your enquiry records within thirty days.</p>
        <p>This policy was last updated in February 2026.</p>
      </div>
      
    </main>
  );
}
