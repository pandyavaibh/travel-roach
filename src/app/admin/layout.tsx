import Link from 'next/link';
import { getUser, isStaff } from '@/lib/auth';
import { logoutAction } from './actions';

const NAV: [string, string][] = [
  ['Dashboard', '/admin'],
  ['Posts', '/admin/posts'],
  ['Attractions', '/admin/attractions'],
  ['Events', '/admin/events'],
  ['Itineraries', '/admin/packages'],
  ['Listings', '/admin/listings'],
  ['Claims', '/admin/claims'],
  ['Reviews', '/admin/reviews'],
  ['Enquiries', '/admin/enquiries'],
  ['Media', '/admin/media'],
  ['Cities', '/admin/cities'],
  ['Users', '/admin/users'],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Signed-out visitors only ever reach /admin/login, which renders its own shell.
  const user = await getUser();
  if (!isStaff(user)) return <>{children}</>;

  return (
    <div className="min-h-screen grid [grid-template-columns:minmax(0,1fr)] lg:[grid-template-columns:226px_minmax(0,1fr)] bg-paper">
      <aside className="bg-ink lg:sticky lg:top-0 lg:h-screen flex flex-col">
        <div className="flex items-center gap-2.5 p-5 border-b border-rule-dark">
          <span className="grid place-items-center w-[30px] h-[30px] rounded-full bg-orange text-white font-serif text-[13px]">TR</span>
          <span className="font-serif text-[18px] text-paper">Admin</span>
        </div>
        <nav className="flex-1 flex flex-col p-2.5 gap-0.5 overflow-y-auto">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href}
              className="flex items-center min-h-[42px] px-3.5 rounded-lg text-[13px] font-medium text-muted-3 hover:bg-[#232019] hover:text-paper">
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3.5 border-t border-rule-dark">
          <div className="text-[13px] font-semibold text-paper truncate">{user!.name}</div>
          <div className="text-[11px] text-muted mt-0.5 capitalize">{user!.role}</div>
          <div className="flex gap-2 mt-3">
            <Link href="/" className="flex-1 inline-flex items-center justify-center min-h-[38px] rounded-full border border-rule-dark text-[12px] font-semibold text-muted-3 hover:text-paper">Site</Link>
            <form action={logoutAction} className="flex-1">
              <button className="w-full inline-flex items-center justify-center min-h-[38px] rounded-full border border-rule-dark text-[12px] font-semibold text-muted-3 hover:text-paper">Sign out</button>
            </form>
          </div>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
