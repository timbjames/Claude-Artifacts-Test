import { useCallback, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/** useState that is mirrored to localStorage. Storage can be blocked, so every access is guarded. */
export function useStoredState<T>(key: string, initial: T, revive?: (raw: unknown) => T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        return revive ? revive(parsed) : (parsed as T);
      }
    } catch { /* fall back to the initial value */ }
    return initial;
  });
  const set: Dispatch<SetStateAction<T>> = useCallback(
    next => {
      setValue(prev => {
        const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
        return v;
      });
    },
    [key],
  );
  return [value, set];
}
