'use client';

import { useActionState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginAction, type FormState } from '../actions';

const initial: FormState = {};

function LoginForm() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="w-full max-w-[400px] bg-white border border-rule p-[clamp(26px,4vw,40px)]">
      <div className="flex items-center gap-3">
        <span className="grid place-items-center w-[34px] h-[34px] rounded-full bg-orange text-white font-serif text-[15px]">TR</span>
        <span className="font-serif text-[22px] text-ink">Travel Roach</span>
      </div>
      <h1 className="m-0 mt-7 font-serif text-[clamp(26px,3vw,34px)] leading-tight">Sign in</h1>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-2">Admin and editor accounts only.</p>

      <input type="hidden" name="next" value={params.get('next') ?? '/admin'} />

      <div className="flex flex-col gap-2.5 mt-6">
        <input name="email" type="email" autoComplete="email" placeholder="Email" aria-label="Email"
          className="w-full border border-rule bg-paper px-4 py-3 text-sm outline-none focus:border-teal" />
        <input name="password" type="password" autoComplete="current-password" placeholder="Password" aria-label="Password"
          className="w-full border border-rule bg-paper px-4 py-3 text-sm outline-none focus:border-teal" />
        {state.error && <p className="text-xs text-[#B4441F]">{state.error}</p>}
        <button disabled={pending} className="btn-primary w-full min-h-[48px] mt-1 disabled:opacity-60">
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </div>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <main className="min-h-screen grid place-items-center p-6 bg-paper">
      <Suspense fallback={null}><LoginForm /></Suspense>
    </main>
  );
}
