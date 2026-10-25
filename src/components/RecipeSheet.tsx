import { useEffect, useRef, useState } from 'react';
import { allergenText, avoidHit, dietLabel, HEAT } from '../lib/recipes';
import { weekTag } from '../lib/week';
import type { Recipe } from '../types';
import { Tile } from './Dish';
import { CloseIcon, HandIcon, PlusTickIcon, StarIcon } from './icons';

export interface WishButtonState {
  on: boolean;
  full: boolean;
  disabled: boolean;
}

interface Props {
  recipe: Recipe;
  avoid: string[];
  saved: boolean;
  wish: WishButtonState;
  weekOffset: number;
  onToggleSave: (id: string) => void;
  onToggleWish: (id: string) => void;
  onClose: () => void;
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function RecipeSheet({ recipe: r, avoid, saved, wish, weekOffset, onToggleSave, onToggleWish, onClose }: Props) {
  const diet = dietLabel(r.diet);
  const hits = avoidHit(r, { avoid });
  const hasKids = Array.isArray(r.kids) && r.kids.length > 0;
  const hasGrown = Array.isArray(r.grown);
  const [ticked, setTicked] = useState<Set<number>>(new Set());
  const closeRef = useRef<HTMLButtonElement>(null);
  const wishRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);

  const tag = weekTag(weekOffset).toLowerCase();
  const wishLabel = wish.on ? `On the wishlist (${tag})` : wish.full ? `Wishlist is full (${tag})` : `Add to wishlist (${tag})`;

  const clickWish = () => {
    const el = wishRef.current;
    if (el && !wish.on && !prefersReducedMotion()) {
      el.classList.remove('pop');
      void el.offsetWidth; // restart the animation
      el.classList.add('pop');
    }
    onToggleWish(r.id);
  };

  return (
    <>
      <Tile recipe={r} large>
        <button type="button" className="close" ref={closeRef} onClick={onClose} aria-label="Close recipe"><CloseIcon /></button>
      </Tile>
      <div className="sheet-in">
        <div className="head">
          <h2 id="sheet-title">{r.name}</h2>
          {r.blurb ? <p className="lead">{r.blurb}</p> : null}
          {r.tags.length || diet ? (
            <div className="tags">
              {r.tags.map(t => <span className="tag" key={t}>{t}</span>)}
              {diet ? <span className="badge" style={{ alignSelf: 'center' }}>{diet}</span> : null}
            </div>
          ) : null}
        </div>
        <div className="facts">
          {r.time ? <div className="fact"><b>{r.time} min</b><small>Ready in</small></div> : null}
          <div className="fact"><b>{r.serves}</b><small>Serves</small></div>
          <div className="fact"><b>{r.level}</b><small>Level</small></div>
          <div className="fact"><b>{HEAT[r.heat] ?? HEAT[0]}</b><small>Spice</small></div>
        </div>
        {r.ing.length ? (
          <div className="sec">
            <h4>What you need</h4>
            <p className="hint">Tap to tick things off as you find them.</p>
            <ul className="ing-grid">
              {r.ing.map(([em, t], i) => (
                <li key={i}>
                  <label htmlFor={`ing-${r.id}-${i}`}>
                    <input type="checkbox" id={`ing-${r.id}-${i}`} checked={ticked.has(i)}
                      onChange={() => setTicked(s => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; })} />
                    <span className="emo" aria-hidden="true">{em}</span>
                    <span>{t}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {hasKids || hasGrown ? (
          <div className="jobs">
            {hasKids ? (
              <div className="job kids">
                <h5>Little helpers can&hellip;</h5>
                <ul>{r.kids!.map(k => <li key={k}><StarIcon /><span>{k}</span></li>)}</ul>
              </div>
            ) : null}
            {hasGrown ? (
              <div className="job grown">
                <h5>Grown-up jobs</h5>
                {r.grown!.length
                  ? <ul>{r.grown!.map(k => <li key={k}><HandIcon /><span>{k}</span></li>)}</ul>
                  : <p>Nothing hot or sharp in this one. Everyone can join in.</p>}
              </div>
            ) : null}
          </div>
        ) : null}
        {r.steps.length ? (
          <div className="sec">
            <h4>How to make it</h4>
            <ol className="steps">{r.steps.map((s, i) => <li key={i}><span>{s}</span></li>)}</ol>
          </div>
        ) : null}
        <div className="allergy">
          {hits.length ? <b>Heads up: contains {hits.join(', ').toLowerCase()}, which you avoid</b> : null}
          <b>{allergenText(r)}</b>
          <span>Always check the labels on shop-bought items, as brands differ.</span>
        </div>
        <div className="sheet-actions">
          <button type="button" className="btn primary" onClick={() => onToggleSave(r.id)}>{saved ? 'On my picks' : 'I want this!'}</button>
          <button type="button" className="btn wish-btn" ref={wishRef} aria-pressed={wish.on} disabled={wish.disabled} onClick={clickWish}>
            <PlusTickIcon />
            <span>{wishLabel}</span>
          </button>
          <button type="button" className="btn" onClick={onClose}>Back to recipes</button>
        </div>
      </div>
    </>
  );
}
