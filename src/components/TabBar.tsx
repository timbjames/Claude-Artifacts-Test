import type { ReactNode } from 'react';
import type { ViewId } from '../types';
import { CalendarIcon, HeartIcon, HomeIcon, UserIcon } from './icons';

const TABS: Array<{ id: ViewId; label: string; icon: ReactNode }> = [
  { id: 'home', label: 'Home', icon: <HomeIcon /> },
  { id: 'week', label: 'Week', icon: <CalendarIcon /> },
  { id: 'account', label: 'Account', icon: <UserIcon /> },
  { id: 'fav', label: 'Favourites', icon: <HeartIcon /> },
];

export function TabBar({ view, favCount, onGo }: { view: ViewId; favCount: number; onGo: (v: ViewId) => void }) {
  return (
    <nav className="tabbar" aria-label="Main">
      <div className="tabbar-in">
        {TABS.map(t => (
          <button type="button" className="tab" key={t.id} data-view={t.id} aria-current={view === t.id ? 'page' : 'false'} onClick={() => onGo(t.id)}>
            <span className="ico">{t.icon}</span>
            {t.id === 'fav' && favCount > 0 ? <span className="count-dot">{favCount}</span> : null}
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
