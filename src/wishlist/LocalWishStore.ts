import { emptyDoc } from './types';
import type { WishDoc, WishSnapshot, WishStore } from './types';

const KEY = 'sprig-wishes';

/** Keeps the wishlist on this device only. Used until a shared backend is plugged in. */
export class LocalWishStore implements WishStore {
  readonly mode = 'local' as const;
  readonly myId = 'local';
  readonly canWrite = true;
  private listeners = new Set<(s: WishSnapshot) => void>();
  private doc: WishDoc;

  constructor() {
    this.doc = emptyDoc();
    try {
      const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? 'null');
      if (raw && typeof raw === 'object') this.doc = { ...emptyDoc(), ...(raw as Partial<WishDoc>) };
    } catch { /* start empty */ }
  }

  private snapshot(): WishSnapshot {
    return { docs: { [this.myId]: this.doc }, names: {} };
  }

  subscribe(onChange: (snap: WishSnapshot) => void): () => void {
    this.listeners.add(onChange);
    onChange(this.snapshot());
    return () => { this.listeners.delete(onChange); };
  }

  async saveMine(doc: WishDoc): Promise<void> {
    this.doc = doc;
    try { localStorage.setItem(KEY, JSON.stringify(doc)); } catch { /* storage blocked: kept in memory only */ }
    this.listeners.forEach(fn => fn(this.snapshot()));
  }
}
