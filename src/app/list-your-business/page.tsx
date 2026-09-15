import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';

export const metadata: Metadata = { title: "List your business", description: "Travel agents, hotels and restaurants can claim a listing, verify it and manage their own details." };

export default function Page() {
  return (
    <main className="shell pt-[clamp(24px,3vw,40px)]">
      <Breadcrumb items={[['India','/'], ["List your business", null]]} />
      <h1 className="m-0 mt-[clamp(14px,1.8vw,24px)] max-w-[18ch] text-[clamp(38px,6.4vw,88px)] leading-[.98] tracking-[-.033em]">List your business</h1>
      <p className="mt-5 max-w-[56ch] text-[clamp(16px,1.6vw,20px)] leading-[1.5] text-ink-3">Travel agents, hotels and restaurants can claim a listing, verify it and manage their own details.</p>
      <div className="prose-r mt-[clamp(26px,3.4vw,44px)]">
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">What a listing includes</h2>
        <p>Your description, photos, contact details, prices and opening hours, plus a direct enquiry form that reaches you rather than us. Hotels can list room types; restaurants can list menus; agents can list packages.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">What verification means</h2>
        <p>For travel agents we check an IATA accreditation, a state tourism registration or an ASI guide licence. For hotels and restaurants we check the trading licence and confirm the business is operating. Verified listings carry a badge and the date of the check.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">What it does not buy</h2>
        <p>Position. The directory sorts by rating and response time, and verification does not move you up the page. If we ever introduce a promoted slot it will be labelled as one.</p>
        <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] leading-tight tracking-[-.02em] mt-9 mb-3 text-ink">Reviews</h2>
        <p>Hotel and restaurant ratings sync nightly from your Google Business Profile and are attributed to Google. Travel agent reviews come only from travellers who sent an enquiry through this site.</p>
        <p>To start, email claims@travelroach.com with your business name, city and registration number.</p>
      </div>
      <div className="bg-sand p-[clamp(24px,3vw,40px)] mt-[clamp(30px,4vw,56px)] max-w-[72ch]">
        <h2 className="m-0 font-serif text-[clamp(22px,2.6vw,30px)] leading-tight text-ink">Already listed?</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-3">Claim an existing listing to take over its details and respond to enquiries directly.</p>
        <Link href="/contact" className="btn-primary mt-5">Claim a listing</Link>
      </div>
    </main>
  );
}
