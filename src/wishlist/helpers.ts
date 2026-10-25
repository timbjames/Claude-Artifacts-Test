import type { Eater, WishDoc } from './types';

export interface EaterRef { k: string; name: string }

/** "me" is the signed-in person; the rest are family members they added. */
export function eatersOf(meName: string, doc: WishDoc): EaterRef[] {
  return [{ k: 'me', name: meName } as EaterRef].concat(doc.eaters.map((e: Eater) => ({ k: e.k, name: e.name })));
}

export function picksFor(doc: WishDoc, week: string, k: string, exists: (id: string) => boolean): string[] {
  return (doc.picks[week]?.[k] ?? []).filter(exists);
}

export interface Tally {
  /** recipe id -> names of the people who want it */
  counts: Record<string, string[]>;
  /** people who have chosen nothing yet this week */
  quiet: string[];
}

export function tally(
  docs: Record<string, WishDoc>,
  week: string,
  nameOf: (docId: string) => string,
  exists: (id: string) => boolean,
): Tally {
  const counts: Record<string, string[]> = {};
  const quiet: string[] = [];
  Object.entries(docs).forEach(([docId, d]) => {
    eatersOf(nameOf(docId), d).forEach(e => {
      const got = picksFor(d, week, e.k, exists);
      if (!got.length) quiet.push(e.name);
      got.forEach(rid => { (counts[rid] ??= []).push(e.name); });
    });
  });
  return { counts, quiet };
}
