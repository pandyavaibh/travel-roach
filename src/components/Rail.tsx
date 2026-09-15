'use client';

import { useRef } from 'react';

export default function Rail({ children, ariaLabel }: { children: React.ReactNode; ariaLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const step = (dir: number) => () => {
    const el = ref.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0;
    const w = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * w * 2, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="shell flex justify-end gap-2 pb-1">
        <button onClick={step(-1)} aria-label={`Scroll ${ariaLabel} left`}
          className="w-[46px] h-[46px] rounded-full border border-rule bg-white text-ink hover:border-ink">←</button>
        <button onClick={step(1)} aria-label={`Scroll ${ariaLabel} right`}
          className="w-[46px] h-[46px] rounded-full border border-rule bg-white text-ink hover:border-ink">→</button>
      </div>
      <div ref={ref} className="rail flex gap-[clamp(12px,1.4vw,20px)] overflow-x-auto snap-x snap-mandatory px-[clamp(16px,3vw,32px)] py-[clamp(18px,2.4vw,30px)] [scroll-padding-left:clamp(16px,3vw,32px)]">
        {children}
      </div>
    </div>
  );
}
