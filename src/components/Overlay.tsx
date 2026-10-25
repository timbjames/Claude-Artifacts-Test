import { useEffect } from 'react';
import type { ReactNode } from 'react';

/** Dimmed backdrop plus a dialog. Closes on Escape and on a click outside the dialog. */
export function Overlay({ onClose, hue, children }: { onClose: () => void; hue?: number; children: ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);
  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabIndex={-1}
        style={hue === undefined ? undefined : { ['--h' as string]: hue }}>
        {children}
      </div>
    </div>
  );
}
