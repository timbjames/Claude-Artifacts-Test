import { LocalWishStore } from './LocalWishStore';
import type { WishStore } from './types';

/**
 * Picks the wishlist backend. Today that is the on-device store. To share the wishlist between
 * phones, return a store backed by Firestore (and sign-in) here. See docs/firestore-wishlist.md.
 */
export function createWishStore(): WishStore {
  return new LocalWishStore();
}

export * from './types';
