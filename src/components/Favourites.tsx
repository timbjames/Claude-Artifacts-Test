import { Illustration } from './Dish';
import { RecipeCard } from './RecipeCard';
import type { Recipe } from '../types';

interface Props {
  list: Recipe[];
  avoid: string[];
  onOpen: (id: string) => void;
  onToggleSave: (id: string) => void;
  onGoHome: () => void;
}

export function Favourites({ list, avoid, onOpen, onToggleSave, onGoHome }: Props) {
  return (
    <section className="view" aria-labelledby="favTitle">
      <div className="vhead">
        <h2 className="vtitle" id="favTitle">My picks</h2>
        <p>The dishes you hearted. Show this list to whoever is cooking.</p>
      </div>
      {list.length ? (
        <div className="grid">
          {list.map(r => <RecipeCard key={r.id} recipe={r} avoid={avoid} saved onOpen={onOpen} onToggleSave={onToggleSave} />)}
        </div>
      ) : (
        <div className="empty">
          <span className="art"><Illustration id="_default" /></span>
          <strong>No picks yet</strong>
          <span>Tap the heart on any dish you fancy and it will wait for you here.</span>
          <button type="button" className="btn primary" onClick={onGoHome}>Find something yummy</button>
        </div>
      )}
    </section>
  );
}
