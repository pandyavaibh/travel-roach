import { desc } from 'drizzle-orm';
import { db, users } from '@/db';
import { requireAdmin } from '@/lib/auth';
import { setRoleAction, deleteUserAction } from '../actions';
import NewUserForm from './NewUserForm';

export const dynamic = 'force-dynamic';

const ROLES = ['admin', 'editor', 'owner', 'traveller'] as const;

export default async function UsersPage() {
  const me = await requireAdmin();
  const rows = await db.select().from(users).orderBy(desc(users.createdAt)).limit(200);

  return (
    <main className="p-[clamp(20px,3vw,40px)]">
      <div className="eyebrow">Admin</div>
      <h1 className="m-0 mt-3 font-serif text-[clamp(30px,4vw,48px)] leading-none tracking-[-.025em]">Users</h1>
      <p className="mt-3.5 max-w-[56ch] text-[15px] leading-relaxed text-muted-2">
        Editors write and publish. Owners manage their own listings. Travellers can only review.
      </p>

      <div className="grid gap-[clamp(20px,2.6vw,36px)] mt-[clamp(24px,3vw,40px)] items-start [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <div className="min-w-0 order-2 lg:order-1">
          <div className="label border-b border-rule pb-3">{rows.length} accounts</div>
          <div className="hair mt-px [grid-template-columns:1fr]">
            {rows.map((u) => (
              <div key={u.id} className="bg-white p-4 px-5 flex flex-wrap items-center gap-x-5 gap-y-3 justify-between">
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-ink truncate">
                    {u.name}{u.id === me.id && <span className="meta font-normal"> · you</span>}
                  </div>
                  <div className="meta mt-1 truncate">{u.email}</div>
                  {!u.emailVerified && <div className="text-[11px] font-semibold text-orange-deep mt-1">Email unconfirmed</div>}
                </div>
                <div className="flex items-center gap-2">
                  <form action={setRoleAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={u.id} />
                    <select name="role" defaultValue={u.role} disabled={u.id === me.id}
                      aria-label={`Role for ${u.name}`}
                      className="border border-rule bg-paper px-3 min-h-[38px] text-[13px] rounded-full disabled:opacity-50">
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button disabled={u.id === me.id}
                      className="inline-flex items-center min-h-[38px] px-3.5 rounded-full border border-rule text-[12px] font-semibold text-ink disabled:opacity-40">Save</button>
                  </form>
                  <form action={deleteUserAction}>
                    <input type="hidden" name="id" value={u.id} />
                    <button disabled={u.id === me.id}
                      className="inline-flex items-center min-h-[38px] px-3.5 rounded-full border border-rule text-[12px] font-semibold text-[#B4441F] disabled:opacity-40">Delete</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:max-w-[340px] w-full"><NewUserForm /></div>
      </div>
    </main>
  );
}
