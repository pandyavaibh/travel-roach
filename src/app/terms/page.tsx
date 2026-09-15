import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';

export const metadata: Metadata = { title: "Terms & conditions", description: "The terms that apply to using this site and to being listed on it." };

export default function Page() {
  return (
    <main className="shell pt-[clamp(24px,3vw,40px)]">
      <Breadcrumb items={[['India','/'], ["Terms & conditions", null]]} />
      <h1 className="m-0 mt-[clamp(14px,1.8vw,24px)] max-w-[18ch] text-[clamp(38px,6.4vw,88px)] leading-[.98] tracking-[-.033em]">Terms & conditions</h1>
      <p className="mt-5 max-w-[56ch] text-[clamp(16px,1.6vw,20px)] leading-[1.5] text-ink-3">The terms that apply to using this site and to being listed on it.</p>
      <div className="prose-r mt-[clamp(26px,3.4vw,44px)]">
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Using the site</h2>
        <p>Guides are published in good faith and checked before publication, but timings, prices and opening days change. Confirm anything critical before you travel. We are not liable for losses arising from out-of-date information.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Enquiries and bookings</h2>
        <p>When you send an enquiry you are contacting that business directly. Any contract for travel, accommodation or a meal is between you and them. We are not a party to it and take no commission on it.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Listings</h2>
        <p>Businesses are responsible for the accuracy of their own listing. Verification confirms documents at the time of checking and is not a guarantee of service quality. We remove listings that misrepresent themselves.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Reviews</h2>
        <p>Hotel and restaurant ratings are sourced from Google Business Profile and remain attributable to Google. Travel agent reviews are collected from travellers who enquired through this site.</p>
        <p>These terms were last updated in February 2026.</p>
      </div>
      
    </main>
  );
}
