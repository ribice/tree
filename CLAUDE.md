# Project Instructions

- When changing family-tree data, add a new entry to `src/lib/changelog.ts`.
- Family-tree data includes people files, translated biographies, names, dates, places, parent links, spouse links, children implied by parent links, GEDCOM imports, and major corrections to existing records.
- Do not add changelog entries for CSS-only, layout-only, copy-only, dependency-only, build/config, or refactor-only changes.
- If a change mixes data and presentation work, the changelog entry should describe only the family-tree data change.
- Keep changelog entries localized in Bosnian and English.
- Before pushing data changes, run `npm run validate`, `npm run test`, and `npm run build`.
