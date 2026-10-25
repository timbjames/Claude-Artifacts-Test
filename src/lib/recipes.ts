import type { Filters, Profile, RawRecipe, Recipe } from '../types';

export const MEALS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];
export const AVOID_LIST = ['Egg', 'Dairy', 'Gluten', 'Nuts', 'Fish', 'Soy', 'Sesame'];
export const HUES: Array<[number, string]> = [[140, 'Green'], [200, 'Blue'], [275, 'Purple'], [345, 'Pink'], [28, 'Orange'], [50, 'Yellow']];
export const MOODS: Array<[string, string]> = [['Sweet', '🍓'], ['Savoury', '🍳'], ['Cheesy', '🧀'], ['Creamy', '🥛'], ['Crunchy', '🥒'], ['Fresh', '🥬'], ['Fruity', '🥭'], ['Hearty', '🍲']];
export const HEAT = ['No heat', 'Mild heat', 'Medium heat'];

export const DEFAULT_FILTERS: Filters = { meal: 'All', mood: '', veg: false, vegan: false, quick: false, q: '' };

/** Fills defaults so partial records from an API still render. */
export function normalise(raw: RawRecipe): Recipe {
  const h = raw.h ?? [...String(raw.id)].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) % 360, 7);
  return {
    meal: '', level: 'Easy', diet: 'none', serves: 4, heat: 0, blurb: '',
    ...raw,
    h,
    ing: (raw.ing ?? []).map((i): [string, string] => (Array.isArray(i) ? i : ['🥄', String(i)])),
    tags: raw.tags ?? [],
    steps: raw.steps ?? [],
  };
}

export function dietLabel(d: Recipe['diet']): string {
  return d === 'vegan' ? 'Vegan' : d === 'veg' ? 'Vegetarian' : '';
}

/** Up to n distinct ingredient emoji, skipping generic ones. */
export function pics(r: Recipe, n: number): string[] {
  const seen: string[] = [];
  r.ing.forEach(([em]) => {
    if (em !== '🥄' && em !== '🧂' && !seen.includes(em)) seen.push(em);
  });
  return seen.slice(0, n);
}

/** Never presents unknown allergen info as "none". */
export function allergenText(r: Recipe): string {
  if (!Array.isArray(r.allergens)) return 'Allergen information not supplied';
  if (!r.allergens.length) return 'No common allergens in the main ingredients';
  return 'Contains: ' + r.allergens.join(', ').toLowerCase();
}

/** Allergens in this recipe that the person avoids. */
export function avoidHit(r: Recipe, profile: Pick<Profile, 'avoid'>): string[] {
  return Array.isArray(r.allergens) ? r.allergens.filter(a => profile.avoid.includes(a)) : [];
}

export function filterRecipes(recipes: Recipe[], f: Filters, profile: Pick<Profile, 'avoid'>): Recipe[] {
  const q = f.q.trim().toLowerCase();
  return recipes.filter(r => {
    if (avoidHit(r, profile).length) return false;
    if (f.meal !== 'All' && r.meal !== f.meal) return false;
    if (f.mood && !r.tags.includes(f.mood)) return false;
    if (f.vegan && r.diet !== 'vegan') return false;
    if (f.veg && r.diet === 'none') return false;
    if (f.quick && !(r.time !== undefined && r.time <= 30)) return false;
    if (q && !(r.name + ' ' + r.blurb + ' ' + r.tags.join(' ') + ' ' + r.ing.map(i => i[1]).join(' ')).toLowerCase().includes(q)) return false;
    return true;
  });
}
