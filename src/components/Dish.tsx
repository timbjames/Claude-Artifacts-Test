import type { CSSProperties, ReactNode } from 'react';
import { ART } from '../data/art';
import type { Recipe } from '../types';
import { ClockIcon } from './icons';

export const hueStyle = (h: number): CSSProperties => ({ ['--h' as string]: h });

/** The recipe illustration. The SVG markup comes from our own drawing helpers, never from user input. */
export function Illustration({ id }: { id: string }) {
  const inner = (ART[id] ?? ART._default)();
  return <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: inner }} />;
}

/** A small square picture used in lists: the photo if there is one, otherwise the illustration. */
export function Thumb({ recipe }: { recipe: Recipe }) {
  return (
    <span className="thumb">
      {recipe.image ? <img src={recipe.image} alt="" /> : <Illustration id={recipe.id} />}
    </span>
  );
}

export function Tile({ recipe, large, children }: { recipe: Recipe; large?: boolean; children?: ReactNode }) {
  return (
    <div className="tile">
      {recipe.image
        ? <img className="photo" src={recipe.image} alt="" />
        : <span className="plate"><Illustration id={recipe.id} /></span>}
      <span className="meal">{recipe.meal}</span>
      {!large && recipe.time ? <span className="time"><ClockIcon />{recipe.time} min</span> : null}
      {children}
    </div>
  );
}
