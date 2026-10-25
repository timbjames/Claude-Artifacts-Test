# Sharing the wishlist with Firestore

Status: a design sketch. None of this has been built or tested. The app currently uses `LocalWishStore`, which keeps picks on one device.

## Data model

The UI already uses one document per signed-in person, which maps directly onto Firestore:

```
households/{householdId}
  members: [uid, ...]
households/{householdId}/wishes/{uid}      <- a WishDoc
  eaters: [{ k, name }]
  picks: { "2026-10-26": { me: [recipeId], <eaterKey>: [recipeId] } }
```

`WishDoc` is defined in `src/wishlist/types.ts`. A person edits only their own document. Children without a phone are "eaters" inside a parent's document.

## Steps

1. Create a Firebase project. Turn on Authentication (Google or email) and Firestore.
2. `npm install firebase`.
3. Add `src/wishlist/FirestoreWishStore.ts` implementing `WishStore`:
   - `myId`: the Firebase auth uid.
   - `subscribe`: `onSnapshot` on `households/{id}/wishes`, mapping the documents to `WishSnapshot.docs`. Fill `names` from a `members` map or from the auth display names.
   - `saveMine`: `setDoc(doc(db, 'households', id, 'wishes', uid), wishDoc)`. Throw `new WishWriteError('denied')` on `permission-denied` and `new WishWriteError('failed')` on other errors, so the UI shows the right notice.
   - `canWrite`: true once signed in as a household member.
4. Return it from `createWishStore()` in `src/wishlist/index.ts` once the person is signed in.
5. Add a way to join a household, for example an invite code that adds a uid to `members`.

## Security rules (sketch)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isMember(h) {
      return request.auth != null && request.auth.uid in get(/databases/$(database)/documents/households/$(h)).data.members;
    }
    match /households/{h} {
      allow read: if isMember(h);
      match /wishes/{uid} {
        allow read: if isMember(h);
        allow write: if isMember(h) && request.auth.uid == uid;
      }
    }
  }
}
```

Review these before use. Joining a household needs its own safe path, for example a Cloud Function that checks an invite code, because members must not be able to add themselves.
