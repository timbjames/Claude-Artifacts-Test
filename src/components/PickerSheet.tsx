import { useEffect, useRef } from 'react';
import { weekRange } from '../lib/week';
import { WISH_MAX } from '../wishlist/types';
import type { Recipe } from '../types';
import { hueStyle, Thumb } from './Dish';
import { TickIcon } from './icons';

interface Props {
  title: string;
  recipes: Recipe[];
  selected: string[];
  now: Date;
  weekOffset: number;
  onToggle: (id: string) => void;
  onClose: () => void;
}

export function PickerSheet({ title, recipes, selected, now, weekOffset, onToggle, onClose }: Props) {
  const full = selected.length >= WISH_MAX;
  const doneRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { doneRef.current?.focus(); }, []);
  return (
    <>
      <div className="pick-head">
        <div>
          <h2 id="sheet-title">{title}</h2>
          <small>{selected.length} of {WISH_MAX} chosen for {weekRange(now, weekOffset)}</small>
        </div>
        <button type="button" className="btn primary" ref={doneRef} onClick={onClose}>Done</button>
      </div>
      <div className="pick-list">
        {recipes.map(r => {
          const on = selected.includes(r.id);
          return (
            <button type="button" className="pick-row" key={r.id} style={hueStyle(r.h)} aria-pressed={on} disabled={full && !on} onClick={() => onToggle(r.id)}>
              <Thumb recipe={r} />
              <span>
                <b>{r.name}</b>
                <small>{r.time ? r.time + ' min' : ''}{r.time && r.tags.length ? ' · ' : ''}{r.tags.slice(0, 2).join(', ')}</small>
              </span>
              <span className="tick" aria-hidden="true"><TickIcon /></span>
            </button>
          );
        })}
      </div>
    </>
  );
}
