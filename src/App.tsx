import { useCallback, useMemo, useRef, useState } from 'react';
import { Account } from './components/Account';
import { BackToTop } from './components/BackToTop';
import { Favourites } from './components/Favourites';
import { Header } from './components/Header';
import { HelpSheet } from './components/HelpSheet';
import { Home } from './components/Home';
import { Overlay } from './components/Overlay';
import { PickerSheet } from './components/PickerSheet';
import { RecipeSheet } from './components/RecipeSheet';
import { TabBar } from './components/TabBar';
import { personNameFor, Week } from './components/Week';
import { SEED } from './data/recipes';
import { avoidHit, DEFAULT_FILTERS, filterRecipes, normalise } from './lib/recipes';
import { useStoredState } from './lib/useStoredState';
import { defaultWeekOffset, oldestKeptWeekKey, weekKey } from './lib/week';
import type { Filters, Profile, ViewId } from './types';
import { createWishStore } from './wishlist';
import { eatersOf, picksFor } from './wishlist/helpers';
import { useWishlist } from './wishlist/useWishlist';
import { WISH_MAX } from './wishlist/types';

type Sheet = { kind: 'recipe'; id: string } | { kind: 'picker' } | { kind: 'help' } | null;

const HASHES: Record<string, ViewId> = { home: 'home', week: 'week', favourites: 'fav', account: 'account' };
const DEFAULT_PROFILE: Profile = { name: '', hue: 140, avoid: [] };

const reviveProfile = (raw: unknown): Profile => {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Partial<Profile>;
  return {
    name: typeof o.name === 'string' ? o.name : DEFAULT_PROFILE.name,
    hue: typeof o.hue === 'number' ? o.hue : DEFAULT_PROFILE.hue,
    avoid: Array.isArray(o.avoid) ? o.avoid.filter((a): a is string => typeof a === 'string') : [],
  };
};
const reviveIds = (raw: unknown): string[] => (Array.isArray(raw) ? raw.filter((a): a is string => typeof a === 'string') : []);

export function App() {
  /* Recipes. To use an API, fetch the list and pass it through normalise() instead of SEED. */
  const [recipes] = useState(() => SEED.map(normalise));
  const byId = useCallback((id: string) => recipes.find(r => r.id === id), [recipes]);

  const [view, setView] = useState<ViewId>(() => HASHES[location.hash.slice(1)] ?? 'home');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [profile, setProfile] = useStoredState<Profile>('sprig-profile', DEFAULT_PROFILE, reviveProfile);
  const [savedIds, setSavedIds] = useStoredState<string[]>('sprig-saved', [], reviveIds);
  const [activeK, setActiveK] = useStoredState<string>('sprig-active', 'me', raw => (typeof raw === 'string' ? raw : 'me'));
  const [sheet, setSheet] = useState<Sheet>(null);
  const lastFocus = useRef<Element | null>(null);

  const now = useMemo(() => new Date(), []);
  const [weekOffset, setWeekOffset] = useState(() => defaultWeekOffset(now));
  const [store] = useState(createWishStore);
  const wl = useWishlist(store);

  const saved = useMemo(() => new Set(savedIds), [savedIds]);
  const avoid = profile.avoid;
  const hiddenCount = recipes.filter(r => avoidHit(r, profile).length).length;
  const homeList = useMemo(() => filterRecipes(recipes, filters, { avoid }), [recipes, filters, avoid]);
  const favList = recipes.filter(r => saved.has(r.id));

  /* Wishlist state for the person who is choosing */
  const wk = weekKey(now, weekOffset);
  const oldest = oldestKeptWeekKey(now);
  const exists = (id: string) => byId(id) !== undefined;
  const nameOf = personNameFor(wl, profile.name);
  const eaters = eatersOf(nameOf(wl.myId), wl.myDoc);
  const ae = eaters.find(e => e.k === activeK) ?? eaters[0];
  const chosen = picksFor(wl.myDoc, wk, ae.k, exists);

  const go = (v: ViewId) => { setView(v); window.scrollTo(0, 0); };
  const toggleSave = (id: string) =>
    setSavedIds(ids => (ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]));
  const open = (s: NonNullable<Sheet>) => { lastFocus.current = document.activeElement; setSheet(s); };
  const close = useCallback(() => {
    setSheet(null);
    const el = lastFocus.current;
    if (el instanceof HTMLElement && document.contains(el)) el.focus();
  }, []);
  const surprise = () => {
    const pool = homeList.length ? homeList : recipes.filter(r => !avoidHit(r, profile).length);
    if (pool.length) open({ kind: 'recipe', id: pool[Math.floor(Math.random() * pool.length)].id });
  };

  const count = view === 'home' ? `${homeList.length} ${homeList.length === 1 ? 'recipe' : 'recipes'}`
    : view === 'fav' ? `${favList.length} ${favList.length === 1 ? 'pick' : 'picks'}` : '';

  const sheetRecipe = sheet?.kind === 'recipe' ? byId(sheet.id) : undefined;

  return (
    <>
      <div className="wrap">
        <Header count={count} onHelp={() => open({ kind: 'help' })} />

        {view === 'home' && (
          <Home
            list={homeList} hiddenCount={hiddenCount} filters={filters} setFilters={setFilters} name={profile.name} avoid={avoid}
            saved={saved} onOpen={id => open({ kind: 'recipe', id })} onToggleSave={toggleSave} onSurprise={surprise}
            onReset={() => setFilters(DEFAULT_FILTERS)} onGoAccount={() => go('account')}
          />
        )}
        {view === 'fav' && (
          <Favourites list={favList} avoid={avoid} onOpen={id => open({ kind: 'recipe', id })} onToggleSave={toggleSave} onGoHome={() => go('home')} />
        )}
        {view === 'week' && (
          <Week
            byId={byId} now={now} weekOffset={weekOffset} setWeekOffset={setWeekOffset} wl={wl} profileName={profile.name}
            activeK={ae.k} setActiveK={setActiveK} onPick={() => { if (!wl.readOnly) open({ kind: 'picker' }); }}
            onOpen={id => open({ kind: 'recipe', id })}
          />
        )}
        {view === 'account' && (
          <Account profile={profile} setProfile={setProfile} hiddenCount={hiddenCount} pickCount={favList.length} onClearPicks={() => setSavedIds([])} />
        )}
      </div>

      <BackToTop />
      <TabBar view={view} favCount={favList.length} onGo={go} />

      {sheet?.kind === 'recipe' && sheetRecipe && (
        <Overlay onClose={close} hue={sheetRecipe.h}>
          <RecipeSheet
            recipe={sheetRecipe} avoid={avoid} saved={saved.has(sheetRecipe.id)} weekOffset={weekOffset}
            wish={{ on: chosen.includes(sheetRecipe.id), full: chosen.length >= WISH_MAX, disabled: wl.readOnly || (!chosen.includes(sheetRecipe.id) && chosen.length >= WISH_MAX) }}
            onToggleSave={toggleSave} onToggleWish={id => wl.togglePick(wk, ae.k, id, oldest)} onClose={close}
          />
        </Overlay>
      )}
      {sheet?.kind === 'picker' && (
        <Overlay onClose={close}>
          <PickerSheet
            title={`Pick for ${ae.k === 'me' ? 'you' : ae.name}`}
            recipes={recipes.filter(r => !avoidHit(r, profile).length)}
            selected={chosen} now={now} weekOffset={weekOffset}
            onToggle={id => wl.togglePick(wk, ae.k, id, oldest)} onClose={close}
          />
        </Overlay>
      )}
      {sheet?.kind === 'help' && (
        <Overlay onClose={close}>
          <HelpSheet onClose={close} />
        </Overlay>
      )}
    </>
  );
}
