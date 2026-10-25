import { allergenText, avoidHit, dietLabel, HEAT, pics } from '../lib/recipes';
import type { Recipe } from '../types';
import { hueStyle, Tile } from './Dish';
import { FlameIcon, HeartIcon, PeopleIcon } from './icons';

interface Props {
  recipe: Recipe;
  avoid: string[];
  saved: boolean;
  onOpen: (id: string) => void;
  onToggleSave: (id: string) => void;
}

export function RecipeCard({ recipe: r, avoid, saved, onOpen, onToggleSave }: Props) {
  const diet = dietLabel(r.diet);
  const inside = pics(r, 6);
  const hits = avoidHit(r, { avoid });
  return (
    <article className="card" style={hueStyle(r.h)}>
      <button type="button" className="card-open" onClick={() => onOpen(r.id)} aria-label={`Open recipe: ${r.name}`}>
        <Tile recipe={r} />
        <div className="body">
          <h3>{r.name}</h3>
          {r.blurb ? <p>{r.blurb}</p> : null}
          {r.tags.length ? <div className="tags">{r.tags.map(t => <span className="tag" key={t}>{t}</span>)}</div> : null}
          {inside.length ? (
            <div className="inside">
              <small>Inside</small>
              {inside.map(em => <span className="emo" aria-hidden="true" key={em}>{em}</span>)}
            </div>
          ) : null}
          <div className="meta">
            <span><PeopleIcon />Serves {r.serves}</span>
            <span>{r.level}</span>
            {r.heat ? <span><FlameIcon />{HEAT[r.heat]}</span> : null}
            {diet ? <span className="badge">{diet}</span> : null}
          </div>
          <div className="contains">{allergenText(r)}</div>
          {hits.length ? <div className="warn">Contains {hits.join(', ').toLowerCase()}, which you avoid</div> : null}
        </div>
      </button>
      <button
        type="button"
        className="heart"
        aria-pressed={saved}
        aria-label={`Add to my picks: ${r.name}`}
        onClick={() => onToggleSave(r.id)}
      >
        <HeartIcon />
      </button>
    </article>
  );
}
