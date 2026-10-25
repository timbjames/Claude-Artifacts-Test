import { DiceIcon, SearchIcon } from './icons';
import { RecipeCard } from './RecipeCard';
import { MEALS, MOODS } from '../lib/recipes';
import type { Filters, Recipe } from '../types';

interface Props {
  list: Recipe[];
  hiddenCount: number;
  filters: Filters;
  setFilters: (f: Filters) => void;
  name: string;
  avoid: string[];
  saved: Set<string>;
  onOpen: (id: string) => void;
  onToggleSave: (id: string) => void;
  onSurprise: () => void;
  onReset: () => void;
  onGoAccount: () => void;
}

export function Home(p: Props) {
  const { filters: f, setFilters } = p;
  const diets: Array<['veg' | 'vegan' | 'quick', string]> = [['veg', 'Vegetarian'], ['vegan', 'Vegan'], ['quick', 'Under 30 min']];
  const toggleDiet = (k: 'veg' | 'vegan' | 'quick') => {
    const next = { ...f, [k]: !f[k] };
    if (k === 'vegan' && next.vegan) next.veg = false;
    if (k === 'veg' && next.veg) next.vegan = false;
    setFilters(next);
  };
  return (
    <div className="view" id="view-home">
      <section className="hero">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {p.name.trim() ? <div className="hello">Hi, {p.name.trim()}</div> : null}
          <h1>What looks <mark>yummy</mark> today?</h1>
          <p>Pick a mood, spot a dish you like, then tap it to see what is inside and who does which jobs. Press the heart on your favourites.</p>
        </div>
        <div className="search-row">
          <label className="search" htmlFor="q">
            <SearchIcon />
            <input id="q" type="search" placeholder="Search by dish or ingredient" autoComplete="off" value={f.q} onChange={e => setFilters({ ...f, q: e.target.value })} />
          </label>
          <button type="button" className="surprise" onClick={p.onSurprise}>
            <DiceIcon />
            Surprise me
          </button>
        </div>
      </section>

      <section className="filters" aria-label="Filters">
        <div className="frow">
          <span className="flabel">Meal</span>
          <div className="chips" role="group" aria-label="Meal">
            {MEALS.map(m => (
              <button type="button" className="chip" key={m} aria-pressed={f.meal === m} onClick={() => setFilters({ ...f, meal: m })}>{m}</button>
            ))}
          </div>
        </div>
        <div className="frow">
          <span className="flabel">I feel like something&hellip;</span>
          <div className="chips" role="group" aria-label="Mood">
            <button type="button" className="chip" aria-pressed={f.mood === ''} onClick={() => setFilters({ ...f, mood: '' })}>Anything</button>
            {MOODS.map(([m, em]) => (
              <button type="button" className="chip" key={m} aria-pressed={f.mood === m} onClick={() => setFilters({ ...f, mood: m })}>
                <span className="emo" aria-hidden="true">{em}</span>{m}
              </button>
            ))}
          </div>
        </div>
        <div className="frow">
          <span className="flabel">For grown-ups</span>
          <div className="chips diet" role="group" aria-label="Dietary and time">
            {diets.map(([k, l]) => (
              <button type="button" className="chip" key={k} aria-pressed={f[k]} onClick={() => toggleDiet(k)}>{l}</button>
            ))}
          </div>
        </div>
      </section>

      <main>
        {p.hiddenCount > 0 ? (
          <div className="notice">
            <span>{p.hiddenCount} {p.hiddenCount === 1 ? 'recipe is' : 'recipes are'} hidden by your food settings.</span>
            <button type="button" className="linkbtn" onClick={p.onGoAccount}>Change</button>
          </div>
        ) : null}
        {p.list.length > 0 ? (
          <div className="grid">
            {p.list.map(r => (
              <RecipeCard key={r.id} recipe={r} avoid={p.avoid} saved={p.saved.has(r.id)} onOpen={p.onOpen} onToggleSave={p.onToggleSave} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <strong>Nothing matches yet</strong>
            <span>Try a different mood or search, or loosen a filter.</span>
            <button type="button" className="btn primary" onClick={p.onReset}>Show everything</button>
          </div>
        )}
      </main>
    </div>
  );
}
