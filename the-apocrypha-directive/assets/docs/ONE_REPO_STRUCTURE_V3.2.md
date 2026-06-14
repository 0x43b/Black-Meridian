# One Repo Structure // Recommended Canon Approach

Use **one repo** for the full BLACK MERIDIAN experience.

Reason: the site is not a collection of normal pages. It is an archive system. Visitors should not need subdomains, hidden paths, or direct URLs. All navigation should happen inside the unlockable dossier.

## Recommended root

```txt
black-meridian/
├─ index.html
├─ style.css
├─ app.js
├─ story.js
├─ VERSION.txt
├─ README.md
└─ assets/
   ├─ audio/
   ├─ docs/
   └─ images/
```

## Future expansion

Do not make new repos for Book II or side chapters unless there is a technical reason.

Instead, add future content inside the same repo:

```txt
assets/
  docs/
    BOOK_II_STORY_BIBLE.md
  images/
    book-two-seal.svg
  audio/
    narration/
    logs/
```

And add new nodes to `story.js`.

## How to keep commits clean

- Make content changes in batches by act.
- Keep `story.js` as the main chapter database.
- Do not edit `app.js` unless the engine needs a new mechanic.
- Do not create separate folders for hidden chapters unless you want direct public URLs.

## Suggested release naming

```txt
V3.1 — Episode 0 / The Unsealed Archive
V3.2 — Book I Starter Repo
V3.3 — Act I Full Prose Expansion
V3.4 — Act II Full Prose Expansion
V3.5 — Act III Full Prose Expansion
V3.6 — Act IV Full Prose Expansion
V3.7 — Act V Full Prose Expansion
V4.0 — Full Book I Interactive Novel Release
```
