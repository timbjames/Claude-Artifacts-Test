import { HelpIcon, SprigLogo } from './icons';

export function Header({ count, onHelp }: { count: string; onHelp: () => void }) {
  return (
    <header className="top">
      <div className="brand"><SprigLogo />Sprig</div>
      <div className="top-r">
        <span className="count" aria-live="polite">{count}</span>
        <button type="button" className="helpbtn" aria-label="How to use Sprig" onClick={onHelp}><HelpIcon /></button>
      </div>
    </header>
  );
}
