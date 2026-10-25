import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { emptyDoc, WISH_MAX, WishWriteError } from './types';
import type { WishDoc, WishSnapshot, WishStore } from './types';

export interface Wishlist {
  mode: WishStore['mode'];
  myId: string;
  docs: Record<string, WishDoc>;
  names: Record<string, string>;
  myDoc: WishDoc;
  readOnly: boolean;
  /** The last save was refused, so the unsaved picks were dropped. */
  rejected: boolean;
  syncError: boolean;
  writeError: boolean;
  /** Edit this person's own document. Saved in order, shown straight away. */
  mutate: (fn: (draft: WishDoc) => void, oldestWeekKey: string) => void;
  togglePick: (week: string, k: string, rid: string, oldestWeekKey: string) => void;
}

export function useWishlist(store: WishStore): Wishlist {
  const [snap, setSnap] = useState<WishSnapshot>({ docs: {}, names: {} });
  const [optimistic, setOptimistic] = useState<WishDoc | null>(null);
  const [readOnly, setReadOnly] = useState(!store.canWrite);
  const [rejected, setRejected] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [writeError, setWriteError] = useState(false);
  const pending = useRef(0);
  const chain = useRef<Promise<void>>(Promise.resolve());
  const confirmed = useRef<WishDoc | null>(null);
  const latest = useRef<WishDoc>(emptyDoc());

  useEffect(() => {
    return store.subscribe(
      s => {
        confirmed.current = s.docs[store.myId] ?? null;
        setSnap(s);
        if (pending.current === 0) setOptimistic(null);
      },
      () => setSyncError(true),
    );
  }, [store]);

  const myDoc = optimistic ?? snap.docs[store.myId] ?? emptyDoc();
  latest.current = myDoc;

  const mutate = useCallback((fn: (draft: WishDoc) => void, oldestWeekKey: string) => {
    if (readOnly) return;
    const next: WishDoc = JSON.parse(JSON.stringify(latest.current));
    fn(next);
    Object.keys(next.picks).forEach(k => { if (k < oldestWeekKey) delete next.picks[k]; });
    latest.current = next;
    setOptimistic(next);
    pending.current += 1;
    chain.current = chain.current
      .then(() => store.saveMine(next))
      .then(() => { setWriteError(false); })
      .catch((err: unknown) => {
        if (err instanceof WishWriteError && err.code === 'denied') {
          setReadOnly(true);
          setRejected(true);
          setOptimistic(null);
        } else {
          setWriteError(true);
        }
      })
      .finally(() => {
        pending.current -= 1;
        if (pending.current === 0 && store.mode === 'local') setOptimistic(null);
      });
  }, [readOnly, store]);

  const togglePick = useCallback((week: string, k: string, rid: string, oldestWeekKey: string) => {
    mutate(d => {
      const w = (d.picks[week] ??= {});
      const arr = (w[k] ??= []);
      const i = arr.indexOf(rid);
      if (i >= 0) arr.splice(i, 1);
      else if (arr.length < WISH_MAX) arr.push(rid);
    }, oldestWeekKey);
  }, [mutate]);

  return useMemo(() => ({
    mode: store.mode, myId: store.myId, docs: snap.docs, names: snap.names, myDoc,
    readOnly, rejected, syncError, writeError, mutate, togglePick,
  }), [store, snap, myDoc, readOnly, rejected, syncError, writeError, mutate, togglePick]);
}
