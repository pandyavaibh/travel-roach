import 'server-only';

const API = 'https://api.brevo.com/v3/smtp/email';

type Mail = { to: string; subject: string; html: string; replyTo?: string; bcc?: string };

/** Sends via Brevo. Without an API key it logs instead, so dev never silently fails. */
export async function sendMail({ to, subject, html, replyTo, bcc }: Mail): Promise<boolean> {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.log('[mail:dev]', { to, subject, replyTo });
    console.log(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    return true;
  }
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { email: process.env.EMAIL_FROM, name: process.env.EMAIL_FROM_NAME || 'Travel Roach' },
        to: [{ email: to }],
        ...(bcc ? { bcc: [{ email: bcc }] } : {}),
        ...(replyTo ? { replyTo: { email: replyTo } } : {}),
        subject, htmlContent: html,
      }),
    });
    if (!res.ok) { console.error('[mail] brevo', res.status, await res.text()); return false; }
    return true;
  } catch (err) {
    console.error('[mail] failed', err);
    return false;
  }
}

const shell = (body: string) => `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px;color:#17160F">
<div style="font-size:22px;margin-bottom:24px">Travel&nbsp;Roach</div>${body}
<p style="margin-top:32px;font-size:12px;color:#8C8677">If you did not expect this email, ignore it.</p></div>`;

const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#E2670B;color:#fff;padding:13px 24px;border-radius:99px;text-decoration:none;font-weight:600;font-size:14px">${label}</a>`;

export const mailVerify = (to: string, name: string, url: string) => sendMail({
  to, subject: 'Confirm your email',
  html: shell(`<p>Hello ${name},</p><p>Confirm your email address to finish setting up your account.</p><p style="margin:28px 0">${button(url, 'Confirm email')}</p>`),
});

export const mailReset = (to: string, url: string) => sendMail({
  to, subject: 'Reset your password',
  html: shell(`<p>Someone asked to reset the password on this account. The link works for one hour.</p><p style="margin:28px 0">${button(url, 'Reset password')}</p>`),
});

export const mailClaimPending = (to: string, listing: string) => sendMail({
  to, subject: 'Claim received — ' + listing,
  html: shell(`<p>We have your claim for <strong>${listing}</strong>.</p><p>Your email domain does not match the listing website, so a person needs to check it. That usually takes a working day.</p>`),
});

export const mailClaimApproved = (to: string, listing: string, url: string) => sendMail({
  to, subject: 'You can now manage ' + listing,
  html: shell(`<p><strong>${listing}</strong> is yours to manage. Photos, prices and details update on the live site immediately.</p><p style="margin:28px 0">${button(url, 'Open your dashboard')}</p>`),
});

export const mailEnquiry = (to: string, listing: string, from: { name: string; email: string; phone?: string; dates?: string; message: string }) => sendMail({
  to, replyTo: from.email, bcc: process.env.ENQUIRY_BCC,
  subject: `New enquiry — ${listing} — ${from.name}`,
  html: shell(`<p><strong>${from.name}</strong> sent an enquiry about <strong>${listing}</strong>.</p>
<table style="font-size:14px;line-height:1.7;margin:20px 0">
<tr><td style="color:#8C8677;padding-right:16px">Email</td><td>${from.email}</td></tr>
<tr><td style="color:#8C8677;padding-right:16px">Phone</td><td>${from.phone || '—'}</td></tr>
<tr><td style="color:#8C8677;padding-right:16px">Dates</td><td>${from.dates || '—'}</td></tr></table>
<p style="background:#FBEAD8;padding:18px;border-radius:8px;font-size:14px;line-height:1.6">${from.message.replace(/\n/g, '<br>')}</p>
<p style="font-size:13px;color:#8C8677">Reply directly to this email to reach them.</p>`),
});
