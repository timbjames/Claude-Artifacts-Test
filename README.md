# Sprig

A recipe-ideas app for families. Kids browse tempting dishes, heart their favourites, and everyone picks up to three dishes for the coming week. React, TypeScript and Vite.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then build to dist/
npm run preview    # serve the production build
```

Needs Node 20 or newer.

## Structure

```
src/
  App.tsx              state, navigation, which sheet is open
  components/          Home, Favourites, Account, Week, RecipeSheet, PickerSheet, HelpSheet, ...
  data/recipes.ts      the seed recipes (own recipes, no third-party content)
  data/art.ts          original SVG dish illustrations, keyed by recipe id
  lib/recipes.ts       normalise(), filters, allergen helpers
  lib/week.ts          Monday-to-Sunday week maths
  wishlist/            the weekly wishlist: types, store interface, local store, React hook
  styles.css           all styling, with light and dark theme tokens
docs/
  firestore-wishlist.md  how to share the wishlist between phones
```

## Replacing the recipes

Recipes go through `normalise()` in `src/lib/recipes.ts`, so a partial record from an API still renders. Only `id` and `name` are required. In `src/App.tsx`, fetch your list and map it through `normalise` instead of `SEED`. A recipe's `image` field (URL or data URI) replaces the illustration.

Allergen data is handled carefully: `allergens: []` means "none in the main ingredients", while leaving it out means "Allergen information not supplied". Unknown is never shown as none.

## The weekly wishlist

The UI talks to a `WishStore` (`src/wishlist/types.ts`). Today `createWishStore()` returns a store that keeps picks on one device. To share picks between family members' phones, implement `WishStore` against a backend and return it from `src/wishlist/index.ts`. See [docs/firestore-wishlist.md](docs/firestore-wishlist.md).

## Status

- Verified: the app bundles, runs in a browser, and the browse, favourites, avoid-foods and wishlist flows work with the on-device store.
- Not done yet: the shared (multi-phone) wishlist, sign-in, a recipe API, deployment. Nothing here has been deployed.
