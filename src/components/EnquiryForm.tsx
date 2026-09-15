'use client';

import { useActionState } from 'react';
import { submitEnquiry, type EnquiryState } from '@/app/actions';

const initial: EnquiryState = { ok: false };

export default function EnquiryForm({ listing, kind, title, note, cta, dateField }: {
  listing: string; kind: string; title: string; note: string; cta: string; dateField: string;
}) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);

  if (state.ok) {
    return (
      <div className="bg-ink p-[clamp(22px,2.6vw,30px)]">
        <div className="font-serif text-[clamp(21px,2.2vw,26px)] text-paper">Sent</div>
        <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{state.message}</p>
      </div>
    );
  }

  const field = 'w-full border border-rule-dark bg-[#221F1A] text-paper px-4 py-3 rounded-xl text-sm outline-none focus:border-orange placeholder:text-[#7C776A]';

  return (
    <form action={action} className="bg-ink p-[clamp(22px,2.6vw,30px)]">
      <div className="font-serif text-[clamp(21px,2.2vw,26px)] text-paper">{title}</div>
      <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{note}</p>

      <input type="hidden" name="listing" value={listing} />
      <input type="hidden" name="kind" value={kind} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="flex flex-col gap-2.5 mt-5">
        {([['name','Your name','text'],['email','Email','email'],['phone','Phone / WhatsApp','tel'],['dates',dateField,'text']] as const).map(([name, ph, type]) => (
          <div key={name}>
            <input name={name} type={type} placeholder={ph} aria-label={ph}
              aria-invalid={!!state.errors?.[name]} className={field} />
            {state.errors?.[name] && <p className="mt-1 text-xs text-[#F0A58A]">{state.errors[name]}</p>}
          </div>
        ))}
        <textarea name="message" rows={3} placeholder="What are you planning?" aria-label="Message" className={field + ' resize-y'} />
        {state.errors?.message && <p className="text-xs text-[#F0A58A]">{state.errors.message}</p>}
        {state.message && !state.ok && <p className="text-xs text-[#F0A58A]">{state.message}</p>}
        <button type="submit" disabled={pending}
          className="btn-primary w-full mt-1 min-h-[50px] disabled:opacity-60">{pending ? 'Sending…' : cta}</button>
      </div>
    </form>
  );
}
