export type Diet = 'none' | 'veg' | 'vegan';

/** What an API (or the seed list) may supply. Only id and name are required. */
export interface RawRecipe {
  id: string;
  name: string;
  meal?: string;
  time?: number;
  level?: string;
  diet?: Diet;
  serves?: number;
  /** Hue (0-360) used to tint the recipe tile. Derived from the id when missing. */
  h?: number;
  /** 0 none, 1 mild, 2 medium */
  heat?: number;
  blurb?: string;
  tags?: string[];
  /** [] means none in the main ingredients. Leave undefined when unknown. */
  allergens?: string[];
  /** [emoji, text] pairs, or plain strings */
  ing?: Array<string | [string, string]>;
  kids?: string[];
  grown?: string[];
  steps?: string[];
  /** Photo URL or data URI. Replaces the illustration. */
  image?: string;
}

export interface Recipe {
  id: string;
  name: string;
  meal: string;
  time?: number;
  level: string;
  diet: Diet;
  serves: number;
  h: number;
  heat: number;
  blurb: string;
  tags: string[];
  allergens?: string[];
  ing: Array<[string, string]>;
  kids?: string[];
  grown?: string[];
  steps: string[];
  image?: string;
}

export interface Profile {
  name: string;
  hue: number;
  avoid: string[];
}

export type ViewId = 'home' | 'week' | 'fav' | 'account';

export interface Filters {
  meal: string;
  mood: string;
  veg: boolean;
  vegan: boolean;
  quick: boolean;
  q: string;
}
