'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MEGA_MENU, SITE } from '@/lib/site';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[80] bg-paper/95 backdrop-blur border-b border-rule">
      <div className="shell flex items-center gap-[clamp(14px,3vw,44px)] py-3.5">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="grid place-items-center w-[38px] h-[38px] rounded-full bg-orange text-white font-serif text-[17px]">TR</span>
          <span className="font-serif text-[25px] tracking-[-.015em] text-ink">{SITE.name}</span>
        </Link>

        <nav className="rail hidden md:flex flex-1 min-w-0 items-center gap-[clamp(14px,2vw,30px)] overflow-x-auto">
          {MEGA_MENU.map(([label, href]) => (
            <Link key={href} href={href}
              className={`inline-flex items-center min-h-[44px] whitespace-nowrap text-sm font-medium ${pathname === href ? 'text-orange' : 'text-ink-2'}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 ml-auto shrink-0">
          <form action="/search" className="hidden sm:flex items-center gap-2 border border-rule bg-white rounded-full min-h-[44px] px-[clamp(12px,1.4vw,18px)] w-[clamp(120px,18vw,230px)] overflow-hidden">
            <span aria-hidden className="text-muted text-sm shrink-0">⌕</span>
            <input name="q" placeholder="Search guides" aria-label="Search guides"
              className="w-full min-w-0 bg-transparent text-[13px] outline-none" />
          </form>
          <Link href="/plan" className="btn-primary hidden sm:inline-flex">Plan a trip</Link>
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu"
            className="md:hidden btn-outline px-4">Menu</button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-rule bg-white">
          <div className="shell flex flex-col py-2">
            {MEGA_MENU.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="flex items-center min-h-[48px] text-sm font-medium text-ink-2 border-b border-rule-2 last:border-0">{label}</Link>
            ))}
            <Link href="/search" onClick={() => setOpen(false)} className="flex items-center min-h-[48px] text-sm font-medium text-ink-2">Search</Link>
          </div>
        </div>
      )}
    </header>
  );
}
