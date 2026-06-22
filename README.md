# Porodično stablo Ribića – Kifića

Živi, git-zasnovan zapis o porodici Ribić – Kifić iz Jezera — od jezerskog
kadije Avde »Avdikadije« (1775–1852) do danas. Cijelo stablo i svi podaci
otvoreno su dostupni u ovom repozitoriju.

Stranicu pokreće [Astro](https://astro.build); svaka osoba je jedan Markdown
fajl, a interaktivno stablo i profili se generišu iz tih fajlova.

**Dvojezično:** bosanski na `stablo.ribic.ba`, engleski na `tree.ribic.ba`
(engleski prijevodi su u `src/content/translations/`). Stablo je na zasebnoj
stranici `/tree` i podržava sklapanje grana te razlikuje žive i preminule.

## Doprinos

Najlakše je popuniti formu **„Dodaj osobu“** na stranici (`/add`) — podatak
stiže nama na pregled i potom ga uvrstimo u stablo. Ko želi raditi direktno s
podacima: svaka osoba je jedan `.md` fajl u `src/content/people/`, a fotografije
idu u `public/photos/`.

Za fotografiju profila dodaj optimizovanu sliku u `public/photos/`, po mogućnosti
imenovanu prema id-u osobe, npr. `public/photos/avdikadija.jpg`, pa u frontmatter
osobe upiši `photo: "/photos/avdikadija.jpg"`. Ako slika dolazi kroz formu,
pošalji link u polje za fotografiju i kratko napiši izvor.

Urednički pregled nepotpunih zapisa nalazi se na `/quality`; tu se vide osobe
kojima nedostaju datumi, mjesta, biografije, spol, fotografije ili veze za
provjeru.

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
| `scripts/validate.mjs`          | Provjera ispravnosti podataka (`npm run validate`) |

Izvorna građa (originalni tekstovi i podaci iz starog programa GenDesigner)
čuva se u folderu `tree/`.

## Hosting

Stranica je statička i postavlja se na [Netlify](https://www.netlify.com).
Konfiguracija je u [`netlify.toml`](./netlify.toml).
