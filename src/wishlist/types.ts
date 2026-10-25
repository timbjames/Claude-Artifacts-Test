/**
 * The weekly wishlist data model.
 *
 * One WishDoc per signed-in person. A person can choose for themselves ("me") and for
 * family members they add (children using a parent's phone). picks[weekKey][eaterKey] is
 * a list of recipe ids.
 */
export interface Eater { k: string; name: string }

export interface WishDoc {
  eaters: Eater[];
  picks: Record<string, Record<string, string[]>>;
}

export interface WishSnapshot {
  /** Every household member's document, keyed by user id. */
  docs: Record<string, WishDoc>;
  /** Display names for user ids, when the backend knows them. */
  names: Record<string, string>;
}

/** 'denied': this person may not write (refused, not retryable). 'failed': a network or server problem. */
export class WishWriteError extends Error {
  constructor(public code: 'denied' | 'failed', message?: string) {
    super(message ?? code);
  }
}

/**
 * Where wishlist data lives. Implement this for a real backend (see docs/firestore-wishlist.md);
 * the UI only talks to this interface.
 */
export interface WishStore {
  readonly mode: 'local' | 'shared';
  /** This person's user id (the key of their own document). */
  readonly myId: string;
  /** False when the backend already knows this person cannot write. */
  readonly canWrite: boolean;
  /** Calls onChange straight away and again on every change. Returns an unsubscribe function. */
  subscribe(onChange: (snap: WishSnapshot) => void, onError: (err: Error) => void): () => void;
  /** Replaces this person's own document. Rejects with WishWriteError. */
  saveMine(doc: WishDoc): Promise<void>;
}

export const WISH_MAX = 3;

export function emptyDoc(): WishDoc {
  return { eaters: [], picks: {} };
}
