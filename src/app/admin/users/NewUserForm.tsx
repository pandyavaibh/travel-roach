'use client';

import { useActionState } from 'react';
import { createUserAction, type FormState } from '../actions';

const initial: FormState = {};
const field = 'w-full border border-rule bg-paper px-4 py-3 text-sm outline-none focus:border-teal';

export default function NewUserForm() {
  const [state, action, pending] = useActionState(createUserAction, initial);
  return (
    <form action={action} className="bg-white border border-rule p-6 sticky top-6">
      <div className="font-serif text-[22px] leading-tight">Add an account</div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-2">Owners and travellers get a confirmation email. Staff accounts are active immediately.</p>
      <div className="flex flex-col gap-2.5 mt-5">
        <input name="name" placeholder="Full name" aria-label="Full name" className={field} />
        <input name="email" type="email" placeholder="Email" aria-label="Email" className={field} />
        <input name="password" type="password" placeholder="Password (10+ characters)" aria-label="Password" className={field} />
        <select name="role" defaultValue="editor" aria-label="Role" className={field}>
          <option value="editor">Editor — writes and publishes</option>
          <option value="admin">Admin — everything</option>
          <option value="owner">Owner — one business</option>
          <option value="traveller">Traveller — reviews only</option>
        </select>
        {state.error && <p className="text-xs text-[#B4441F]">{state.error}</p>}
        {state.ok && <p className="text-xs text-teal">{state.ok}</p>}
        <button disabled={pending} className="btn-primary w-full min-h-[46px] mt-1 disabled:opacity-60">
          {pending ? 'Adding…' : 'Add account'}
        </button>
      </div>
    </form>
  );
}
