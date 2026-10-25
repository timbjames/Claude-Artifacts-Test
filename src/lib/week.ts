/** Weeks run Monday to Sunday and are identified by their Monday as YYYY-MM-DD. */

export function weekStart(now: Date, off: number): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + off * 7);
  return d;
}

export function ymd(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function weekKey(now: Date, off: number): string {
  return ymd(weekStart(now, off));
}

export function weekRange(now: Date, off: number): string {
  const a = weekStart(now, off);
  const b = new Date(a);
  b.setDate(b.getDate() + 6);
  const f = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  return f(a) + ' to ' + f(b);
}

export function weekTag(off: number): string {
  if (off === 0) return 'This week';
  if (off === 1) return 'Next week';
  if (off === -1) return 'Last week';
  return off > 1 ? 'In ' + off + ' weeks' : -off + ' weeks ago';
}

/** On Saturday and Sunday people are planning the coming week. */
export function defaultWeekOffset(now: Date): number {
  return now.getDay() === 0 || now.getDay() === 6 ? 1 : 0;
}

export const MIN_WEEK_OFFSET = -2;
export const MAX_WEEK_OFFSET = 4;

/** Picks for weeks older than this are dropped when the wishlist is saved. */
export const oldestKeptWeekKey = (now: Date) => weekKey(now, -10);
