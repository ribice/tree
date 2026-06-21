# Porodično stablo Ribića – Kifića

Živi, git-zasnovan zapis o porodici Ribić – Kifić iz Jezera — od jezerskog
kadije Avde »Avdikadije« (1775–1852) do danas. Svako može doprinijeti otvaranjem
pull requesta.

Stranicu pokreće [Astro](https://astro.build); svaka osoba je jedan Markdown
fajl, a interaktivno stablo i profili se generišu iz tih fajlova.

**Dvojezično:** bosanski na `stablo.ribic.ba`, engleski na `tree.ribic.ba`
(engleski prijevodi su u `src/content/translations/`). Stablo je na zasebnoj
stranici `/tree` i podržava sklapanje grana te razlikuje žive i preminule.

## Doprinos

Pogledaj [CONTRIBUTING.md](./CONTRIBUTING.md) — ukratko: dodaj jedan `.md` fajl
po osobi u `src/content/people/`, eventualno fotografiju u `public/photos/`, i
otvori pull request.

## Pokretanje lokalno

```bash
npm install
npm run dev        # razvojni server na http://localhost:4321
npm run validate   # provjeri ispravnost svih podataka
npm run build      # izgradi statičku stranicu u dist/
```

## Struktura

| Putanja                     | Sadržaj                                              |
| --------------------------- | --------------------------------------------------- |
| `src/content/people/*.md`       | Po jedan fajl za svaku osobu (podaci + bosanska biografija) |
| `src/content/translations/*.md` | Engleski prijevodi biografija                       |
| `src/content.config.ts`         | Šema koja provjerava podatke svake osobe            |
| `src/i18n/ui.ts`                | Prijevodi UI teksta (bs/en)                         |
| `src/lib/`                      | Učitavanje podataka i izračun rasporeda stabla      |
| `src/components/FamilyTree.tsx` | Interaktivno stablo (zoom, pomjeranje, sklapanje)   |
| `src/components/views/`         | Dijeljene stranice (početna, stablo, imenik, profil) |
| `src/pages/` i `src/pages/en/`  | Bosanske i engleske rute                            |
| `public/photos/`                | Fotografije                                         |
| `scripts/validate.mjs`          | Provjera podataka (pokreće se i na svakom PR-u)     |

Izvorna građa (originalni tekstovi i podaci iz starog programa GenDesigner)
čuva se u folderu `tree/`.

## Hosting

Stranica je statička i postavlja se na [Netlify](https://www.netlify.com).
Konfiguracija je u [`netlify.toml`](./netlify.toml).
