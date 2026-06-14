# BLACK MERIDIAN V3.1 CHANGELOG

## Purpose

V3.1 turns the project from a page-turning archive into an unlock-gated interactive story path.

## Added

- Gate-status strip below the toolbar.
- `NEXT LOCKED` behavior until the current page/spread is complete.
- Evidence-board archive navigation for all unsealed pages.
- `audioLog.required` support for required playback gates.
- `autoUnlock` support for pages that should verify when viewed.
- V3.1-specific localStorage keys using `bm.v31.*`.
- Legacy V3 progress import support.
- Lock-denied glitch animation when a visitor tries to advance too early.
- Better page status language: verified vs action required.

## Changed

- Non-puzzle collectible pages now require **SECURE EVIDENCE** before progression.
- Puzzle-page collectibles stay sealed until the puzzle is solved.
- Veyr and Rook Null pages require audio-log playback.
- The evidence board no longer acts as a passive list only; it is also the unlocked archive map.

## Visitor flow

1. Begin at root domain.
2. Enter archive.
3. Complete required page action.
4. Next file unlocks.
5. Evidence board stores unlocked file navigation.
6. Final choice unlocks the post-game Dead Drop node.

## No backend required

Still works as a static website on GitHub Pages, Netlify, Cloudflare Pages, or any normal web host.
