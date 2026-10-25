import { useEffect, useState } from 'react';
import { ArrowUpIcon } from './icons';

export function BackToTop() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; setShown(window.scrollY >= 400); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const up = () => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  };
  return (
    <button type="button" className="to-top" aria-label="Back to top" hidden={!shown} onClick={up}><ArrowUpIcon /></button>
  );
}
