// Two languages: Bosnian (default, served at the site root) and English
// (served under /en). Domains map: stablo.ribic.ba → bs, tree.ribic.ba → en.

export type Locale = "bs" | "en";
export const locales: Locale[] = ["bs", "en"];
export const defaultLocale: Locale = "bs";

export const ui = {
  bs: {
    "site.title": "Porodično stablo Ribića – Kifića",
    "site.short": "Ribić – Kifić",
    "site.description":
      "Živi zapis o porodici Ribić – Kifić iz Jezera, koji zajedno održavamo.",

    "nav.home": "Početna",
    "nav.tree": "Stablo",
    "nav.directory": "Imenik",
    "nav.about": "O stablu",
    "nav.add": "Dodaj osobu",
    "nav.langName": "English",

    "add.title": "Dodaj osobu",
    "add.intro":
      "Popuni što znaš — ne mora sve. Mi ćemo provjeriti i dodati osobu u stablo. Ne treba ti nikakav nalog.",
    "add.name": "Ime i prezime",
    "add.maiden": "Djevojačko prezime",
    "add.nickname": "Nadimak",
    "add.born": "Godina rođenja",
    "add.died": "Godina smrti",
    "add.birthplace": "Mjesto rođenja",
    "add.parent1": "Roditelj 1",
    "add.parent2": "Roditelj 2",
    "add.spouse": "Supružnik",
    "add.married": "Godina vjenčanja",
    "add.divorced": "Godina razvoda",
    "add.bio": "Biografija / priča",
    "add.yourName": "Tvoje ime (da znamo ko je dopunio)",
    "add.yourEmail": "Tvoj email (ako želiš da te kontaktiramo)",
    "add.submit": "Pošalji",
    "add.optional": "neobavezno",
    "add.none": "— odaberi —",
    "add.success":
      "Hvala! Tvoj prijedlog je poslan. Pregledat ćemo ga i uskoro dodati u stablo.",

    "home.eyebrow": "{n} članova porodice — i raste",
    "home.title": "Stablo Rasima Ribića – Kifića",
    "home.intro":
      "Živi zapis o tome ko smo i odakle smo — od jezerskog kadije Avdikadije do danas, koji svi zajedno pišemo i dopunjavamo.",
    "home.ctaTree": "Otvori stablo",
    "home.ctaDirectory": "Pregledaj sve članove",
    "home.oldest": "Najstariji preci",
    "home.recent": "Najmlađa generacija",

    "home.f1.title": "Svako može doprinijeti",
    "home.f1.body":
      "Dodaj rođaka, ispravi datum ili zapiši priču otvaranjem pull requesta. Nije potreban poseban pristup.",
    "home.f2.title": "Jedan fajl po osobi",
    "home.f2.body":
      "Svaki član porodice je jednostavan tekstualni fajl s podacima i kratkom biografijom. Dodati nekoga znači dodati jedan fajl.",
    "home.f3.title": "Uvijek usklađeno",
    "home.f3.body":
      "Stablo i svaki profil generišu se iz fajlova, pa stranica nikad ne zaostaje za zapisima.",

    "tree.title": "Porodično stablo",
    "tree.subtitle":
      "Od Avdikadije (1775) do danas. Povuci za pomjeranje, skrolaj za zumiranje, klikni na osobu.",
    "tree.hint": "Povuci za pomjeranje · skrolaj za zumiranje · klikni na osobu",
    "tree.zoomIn": "Uvećaj",
    "tree.zoomOut": "Umanji",
    "tree.reset": "Vrati prikaz",
    "tree.expandAll": "Proširi sve",
    "tree.collapseAll": "Skupi grane",
    "tree.living": "Živi",
    "tree.deceased": "Preminuli",
    "tree.showMore": "još {n}",
    "tree.poster": "Preuzmi poster (SVG)",

    "dir.title": "Imenik",
    "dir.subtitle": "Svi članovi stabla, po abecedi.",
    "dir.search": "Pretraži po imenu…",
    "dir.empty": "Niko ne odgovara pretrazi.",

    "person.back": "Imenik",
    "person.nee": "rođ.",
    "person.parents": "Roditelji",
    "person.spouse": "Supružnik",
    "person.children": "Djeca",
    "person.siblings": "Braća i sestre",
    "person.living": "Živ/živa",
    "person.generation": "{n}. koljeno",
    "person.viewInTree": "Prikaži u stablu →",
    "person.married": "vjenč.",
    "person.divorced": "razv.",

    "footer.tagline": "Porodicu zajedno bilježimo i dopunjavamo.",
    "footer.cta": "Nešto nedostaje ili nije tačno?",
    "footer.ctaLink": "Otvori pull request →",

    "about.title": "O ovom stablu",

    "stats.title": "Brojke",
    "stats.subtitle": "Stablo u brojkama.",
    "stats.people": "Osoba",
    "stats.generations": "Generacija",
    "stats.living": "Živih",
    "stats.span": "Raspon godina",
    "stats.surnames": "Prezimena",
    "stats.places": "Mjesta rođenja",
    "stats.map": "Mjesta na karti",
  },
  en: {
    "site.title": "Ribić – Kifić Family Tree",
    "site.short": "Ribić – Kifić",
    "site.description":
      "A living record of the Ribić – Kifić family from Jezero, kept by all of us.",

    "nav.home": "Home",
    "nav.tree": "Tree",
    "nav.directory": "Directory",
    "nav.about": "About",
    "nav.add": "Add a person",
    "nav.langName": "Bosanski",

    "add.title": "Add a person",
    "add.intro":
      "Fill in what you know — it doesn't have to be everything. We'll review it and add the person to the tree. No account needed.",
    "add.name": "Full name",
    "add.maiden": "Maiden name",
    "add.nickname": "Nickname",
    "add.born": "Year of birth",
    "add.died": "Year of death",
    "add.birthplace": "Place of birth",
    "add.parent1": "Parent 1",
    "add.parent2": "Parent 2",
    "add.spouse": "Spouse",
    "add.married": "Year married",
    "add.divorced": "Year divorced",
    "add.bio": "Biography / story",
    "add.yourName": "Your name (so we know who contributed)",
    "add.yourEmail": "Your email (if you'd like us to follow up)",
    "add.submit": "Submit",
    "add.optional": "optional",
    "add.none": "— choose —",
    "add.success":
      "Thank you! Your suggestion has been sent. We'll review it and add it to the tree soon.",

    "home.eyebrow": "{n} relatives — and growing",
    "home.title": "The Ribić – Kifić Family Tree",
    "home.intro":
      "A living record of who we are and where we come from — from Avdo “Avdikadija”, the kadi of Jezero, down to today — written and kept up to date by all of us.",
    "home.ctaTree": "Open the tree",
    "home.ctaDirectory": "Browse everyone",
    "home.oldest": "Oldest ancestors",
    "home.recent": "Youngest generation",

    "home.f1.title": "Everyone can contribute",
    "home.f1.body":
      "Add a relative, fix a date, or write a story by opening a pull request. No special access needed.",
    "home.f2.title": "One file per person",
    "home.f2.body":
      "Each relative is a simple text file with their details and a short bio. Adding someone is adding one file.",
    "home.f3.title": "Always in sync",
    "home.f3.body":
      "The tree and every profile are generated from the files, so the site is never out of date with the records.",

    "tree.title": "Family tree",
    "tree.subtitle":
      "From Avdikadija (1775) to today. Drag to pan, scroll to zoom, click a person.",
    "tree.hint": "Drag to pan · scroll to zoom · click a person",
    "tree.zoomIn": "Zoom in",
    "tree.zoomOut": "Zoom out",
    "tree.reset": "Reset view",
    "tree.expandAll": "Expand all",
    "tree.collapseAll": "Collapse branches",
    "tree.living": "Living",
    "tree.deceased": "Deceased",
    "tree.showMore": "+{n} more",
    "tree.poster": "Download poster (SVG)",

    "dir.title": "Directory",
    "dir.subtitle": "Everyone in the tree, A to Z.",
    "dir.search": "Search by name…",
    "dir.empty": "No one matches that.",

    "person.back": "Directory",
    "person.nee": "née",
    "person.parents": "Parents",
    "person.spouse": "Spouse",
    "person.children": "Children",
    "person.siblings": "Siblings",
    "person.living": "Living",
    "person.generation": "Generation {n}",
    "person.viewInTree": "Show in tree →",
    "person.married": "m.",
    "person.divorced": "div.",

    "footer.tagline": "We record and grow the family together.",
    "footer.cta": "Something missing or wrong?",
    "footer.ctaLink": "Open a pull request →",

    "about.title": "About this tree",

    "stats.title": "By the numbers",
    "stats.subtitle": "The tree in numbers.",
    "stats.people": "People",
    "stats.generations": "Generations",
    "stats.living": "Living",
    "stats.span": "Year span",
    "stats.surnames": "Surnames",
    "stats.places": "Birthplaces",
    "stats.map": "Places on the map",
  },
} as const;

export type UIKey = keyof (typeof ui)["bs"];

/** Translator bound to a locale, with simple {n} interpolation. */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey, vars?: Record<string, string | number>): string {
    let s: string = ui[locale][key] ?? ui[defaultLocale][key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
    return s;
  };
}

/** Detect the locale from a URL/pathname. */
export function getLocale(url: URL | string): Locale {
  const path = typeof url === "string" ? url : url.pathname;
  return path === "/en" || path.startsWith("/en/") ? "en" : "bs";
}

/** Prefix a root-relative path for the given locale ("/tree" → "/en/tree"). */
export function localize(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean === "/" ? "/en/" : `/en${clean}`;
  return clean;
}

export const otherLocale = (l: Locale): Locale => (l === "bs" ? "en" : "bs");

/** The same page in the other language (for the language switcher). */
export function switchLocalePath(pathname: string, to: Locale): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return localize(stripped, to);
}
