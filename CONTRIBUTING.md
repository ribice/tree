# Kako dopuniti porodično stablo

Hvala što želiš doprinijeti! Svako može dodati rođaka, ispraviti podatak,
napisati priču ili dodati fotografiju. Ne treba ti nikakav poseban pristup —
samo GitHub nalog.

## Kratko objašnjenje

- **Svaka osoba je jedan fajl** u `src/content/people/`, npr. `avdo-kifin.md`.
- Ime fajla (bez `.md`) je **id** te osobe — npr. `avdo-kifin`. Taj id koristiš
  kad nekoga povezuješ kao roditelja ili supružnika.
- Fotografije idu u `public/photos/` i upisuju se kao `/photos/<id>.jpg`.

## Dodavanje nove osobe

1. Kopiraj neki postojeći fajl iz `src/content/people/` i preimenuj ga u
   `ime-prezime.md` (mala slova, bez kvačica, riječi spojene crticom).
2. Izmijeni podatke na vrhu fajla i napiši biografiju ispod.

Primjer (`src/content/people/avdo-kifin.md`):

```markdown
---
name: Avdo Ribić — Kifin       # obavezno: puno ime
nickname: Avdo Kifin           # opcionalno: nadimak
maidenName: Šuškić             # opcionalno: djevojačko prezime
born: "1848"                   # opcionalno: godina ili datum
died: "1919"                   # opcionalno
birthplace: Jezero             # opcionalno
parents: [akif, hanumica]      # id-evi roditelja
spouses: [hava]                # id-evi supružnika
photo: /photos/avdo-kifin.jpg  # opcionalno
tagline: Trgovac; vlasnik hana i mlina   # kratak opis ispod imena
---

Ovdje ide biografija. Možeš pisati u više pasusa, koristiti **podebljano**
i sve ostalo iz Markdowna.
```

### Pravila za veze

- `parents` i `spouses` su liste **id-eva** (imena fajlova bez `.md`).
- Veze trebaju postojati u oba smjera: ako Avdi upišeš `spouses: [hava]`, onda
  i Havi treba `spouses: [avdo-kifin]`. Djecu ne treba upisivati ručno — ona se
  pojave automatski jer u svom fajlu navedu roditelje.

### Engleski prijevod (opcionalno)

Stranica postoji na bosanskom (`stablo.ribic.ba`) i engleskom (`tree.ribic.ba`).
Bosanski fajl u `src/content/people/` je izvor istine. Engleski prijevod
biografije je opcionalan i ide u zaseban fajl s istim imenom:

```markdown
<!-- src/content/translations/avdo-kifin.md -->
---
tagline: Merchant; owner of an inn and a mill
---

English version of the biography goes here…
```

Ako prijevod ne postoji, engleska stranica prikaže bosanski tekst.

## Provjera prije slanja

Ako želiš, lokalno pokreni provjeru:

```bash
npm install
npm run validate     # provjeri da su sve veze i fotografije ispravne
npm run dev          # pogledaj stranicu na http://localhost:4321
```

Ne moraš — ista provjera se automatski izvrši kad otvoriš pull request.

## Slanje izmjene

1. Otvori pull request s opisom šta si dodao/izmijenio.
2. Automatska provjera potvrdi da su podaci ispravni i da se stranica gradi.
3. Kad se pregleda i prihvati, izmjena se odmah pojavi na stranici.
