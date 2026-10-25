import type { CSSProperties, ReactNode } from 'react';

type P = { className?: string; style?: CSSProperties };
const wrap = (children: ReactNode, p: P, extra: Record<string, string | number> = {}) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={p.className} style={p.style} {...extra}>{children}</svg>
);
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const ClockIcon = (p: P) => wrap(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, p, { ...stroke, strokeWidth: 2.2 });
export const PeopleIcon = (p: P) => wrap(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 5a3.5 3.5 0 0 1 0 6.5M18 14c2.2.6 3.5 2.6 3.5 6" /></>, p, stroke);
export const FlameIcon = (p: P) => wrap(<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.6 1 2 1.6 2C10 8 11 5.5 12 3Z" />, p, stroke);
export const HeartIcon = (p: P) => wrap(<path d="M12 21s-8-5.2-8-11a4.7 4.7 0 0 1 8-3.3A4.7 4.7 0 0 1 20 10c0 5.8-8 11-8 11Z" />, p);
export const CloseIcon = (p: P) => wrap(<path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />, p);
export const StarIcon = (p: P) => wrap(<path d="m12 2.8 2.7 5.9 6.3.7-4.7 4.3 1.3 6.3L12 16.8 6.4 20l1.3-6.3L3 9.4l6.3-.7Z" />, p);
export const HandIcon = (p: P) => wrap(<><path d="M12 3 2.5 20h19Z" /><path d="M12 10v4M12 17v.01" /></>, p, { strokeLinecap: 'round', strokeLinejoin: 'round' });
export const SearchIcon = (p: P) => wrap(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>, p, { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' });
export const DiceIcon = (p: P) => wrap(<><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><circle cx="8.5" cy="8.5" r="1" fill="currentColor" /><circle cx="15.5" cy="8.5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="8.5" cy="15.5" r="1" fill="currentColor" /><circle cx="15.5" cy="15.5" r="1" fill="currentColor" /></>, p, stroke);
export const ArrowUpIcon = (p: P) => wrap(<path d="M12 19V5M5 12l7-7 7 7" />, p);
export const ChevronLeftIcon = (p: P) => wrap(<path d="M15 5l-7 7 7 7" />, p);
export const ChevronRightIcon = (p: P) => wrap(<path d="M9 5l7 7-7 7" />, p);
export const HelpIcon = (p: P) => wrap(<><circle cx="12" cy="12" r="9.5" /><path d="M9.2 9.3a2.9 2.9 0 0 1 5.6 1c0 1.9-2.8 2.3-2.8 4" /><circle cx="12" cy="17.6" r=".6" fill="currentColor" /></>, p);
export const HomeIcon = (p: P) => wrap(<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />, p);
export const CalendarIcon = (p: P) => wrap(<><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>, p);
export const UserIcon = (p: P) => wrap(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></>, p);
export const TickIcon = (p: P) => wrap(<path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />, p);

export function SprigLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path d="M16 29V13" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M16 15C16 8 11 4 4 4c0 7 4 11 12 11Z" fill="var(--accent)" />
      <path d="M16 19c0-6 4-10 12-10 0 7-4 10-12 10Z" fill="var(--citrus)" />
    </svg>
  );
}

/** Plus that turns into a tick when the parent button is aria-pressed (see .wish-btn in styles.css). */
export const PlusTickIcon = (p: P) => wrap(<><path className="ic-plus" d="M12 5v14M5 12h14" /><path className="ic-tick" d="M5 12.5l4.5 4.5L19 7.5" /></>, p);
