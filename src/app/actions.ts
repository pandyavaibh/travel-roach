'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { mailEnquiry } from '@/lib/email';

const schema = z.object({
  listing: z.string().trim().max(200),
  kind: z.string().trim().max(40),
  name: z.string().trim().min(2, 'Please enter your name').max(160),
  email: z.string().trim().pipe(z.email('That email address looks wrong')),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  dates: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Tell them a little about the trip').max(4000),
  company: z.string().max(0).optional(), // honeypot
});

export type EnquiryState = { ok: boolean; errors?: Record<string, string>; message?: string };

const hits = new Map<string, { n: number; until: number }>();
function rateLimited(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.until) { hits.set(ip, { n: 1, until: now + 3600_000 }); return false; }
  rec.n += 1;
  return rec.n > 6;
}

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
    return { ok: false, errors };
  }
  const d = parsed.data;
  if (d.company) return { ok: true, message: 'Thanks.' };

  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return { ok: false, message: 'Too many enquiries from this connection. Try again in an hour.' };

  // Without BREVO_API_KEY this logs to the server console instead of sending,
  // so an enquiry is never silently lost.
  await mailEnquiry(process.env.ENQUIRY_BCC || process.env.EMAIL_FROM || 'ops@travelroach.com', d.listing, {
    name: d.name, email: d.email, phone: d.phone, dates: d.dates, message: d.message,
  });

  return { ok: true, message: 'Enquiry sent. They usually reply within a few hours.' };
}
