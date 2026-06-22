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
      "Digitalno porodično stablo Ribića – Kifića iz Jezera: biografije, veze, mjesta i generacije od Avdikadije do danas.",

    "meta.tree":
      "Interaktivno porodično stablo Ribića – Kifića s generacijama, supružnicima, potomcima i istaknutim lozama.",
    "meta.directory":
      "Pretraži sve članove porodičnog stabla Ribića – Kifića po imenu, prezimenu, nadimku i kratkom opisu.",
    "meta.about":
      "Kako je nastalo porodično stablo Ribića – Kifića, od starih zapisa Rasima i Enesa Ribića do današnje digitalne arhive.",
    "meta.add":
      "Dodaj novu osobu, ispravi podatak ili pošalji porodičnu priču za porodično stablo Ribića – Kifića.",
    "meta.stats":
      "Brojke porodičnog stabla Ribića – Kifića: članovi, generacije, prezimena, godine i mjesta rođenja.",

    "nav.home": "Početna",
    "nav.tree": "Stablo",
    "nav.directory": "Imenik",
    "nav.about": "O stablu",
    "nav.add": "Dodaj osobu",
    "nav.langName": "English",
    "nav.skip": "Preskoči na sadržaj",

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
    "home.timeline": "Loza kroz vrijeme",
    "home.statPeople": "članova",
    "home.statGenerations": "koljena",
    "home.statYears": "godina zapisa",

    "tree.title": "Porodično stablo",
    "tree.subtitle":
      "Od Avdikadije (1775) do danas. Povuci za pomjeranje, skrolaj za zumiranje, klikni na osobu.",
    "tree.hint": "Povuci za pomjeranje · skrolaj za zumiranje · klikni na osobu",
    "tree.zoomIn": "Uvećaj",
    "tree.zoomOut": "Umanji",
    "tree.reset": "Vrati prikaz",
    "tree.fullscreen": "Cijeli ekran",
    "tree.exitFullscreen": "Izađi iz cijelog ekrana",
    "tree.expandAll": "Proširi sve",
    "tree.collapseAll": "Skupi grane",
    "tree.living": "Živi",
    "tree.deceased": "Preminuli",
    "tree.female": "Žene",
    "tree.male": "Muškarci",
    "tree.showMore": "još {n}",
    "tree.poster": "Preuzmi poster (SVG)",

    "dir.title": "Imenik",
    "dir.subtitle": "Svi članovi stabla, po abecedi.",
    "dir.search": "Pretraži po imenu…",
    "dir.empty": "Niko ne odgovara pretrazi.",
    "dir.count": "{n} osoba u imeniku",
    "dir.results": "{n} rezultata",
    "dir.jump": "Preskoči na slovo",

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
    "person.facts": "Podaci",
    "person.bio": "Biografija",
    "person.family": "Porodične veze",
    "person.born": "Rođen/a",
    "person.died": "Umro/la",
    "person.birthplace": "Mjesto rođenja",

    "footer.tagline": "Porodicu zajedno bilježimo i dopunjavamo.",
    "footer.github": "Cijelo stablo i svi podaci dostupni su na GitHubu →",

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
      "The digital Ribić – Kifić family tree from Jezero: biographies, relationships, places, and generations from Avdikadija to today.",

    "meta.tree":
      "Explore the interactive Ribić – Kifić family tree with generations, spouses, descendants, and highlighted bloodlines.",
    "meta.directory":
      "Search every person in the Ribić – Kifić family tree by name, surname, nickname, and short description.",
    "meta.about":
      "How the Ribić – Kifić family tree grew from Rasim and Enes Ribić's records into today's digital archive.",
    "meta.add":
      "Add a person, correct a detail, or send a family story for the Ribić – Kifić family tree.",
    "meta.stats":
      "Numbers behind the Ribić – Kifić family tree: relatives, generations, surnames, years, and birthplaces.",

    "nav.home": "Home",
    "nav.tree": "Tree",
    "nav.directory": "Directory",
    "nav.about": "About",
    "nav.add": "Add a person",
    "nav.langName": "Bosanski",
    "nav.skip": "Skip to content",

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
    "home.timeline": "The line through time",
    "home.statPeople": "relatives",
    "home.statGenerations": "generations",
    "home.statYears": "years recorded",

    "tree.title": "Family tree",
    "tree.subtitle":
      "From Avdikadija (1775) to today. Drag to pan, scroll to zoom, click a person.",
    "tree.hint": "Drag to pan · scroll to zoom · click a person",
    "tree.zoomIn": "Zoom in",
    "tree.zoomOut": "Zoom out",
    "tree.reset": "Reset view",
    "tree.fullscreen": "Full screen",
    "tree.exitFullscreen": "Exit full screen",
    "tree.expandAll": "Expand all",
    "tree.collapseAll": "Collapse branches",
    "tree.living": "Living",
    "tree.deceased": "Deceased",
    "tree.female": "Female",
    "tree.male": "Male",
    "tree.showMore": "+{n} more",
    "tree.poster": "Download poster (SVG)",

    "dir.title": "Directory",
    "dir.subtitle": "Everyone in the tree, A to Z.",
    "dir.search": "Search by name…",
    "dir.empty": "No one matches that.",
    "dir.count": "{n} people in the directory",
    "dir.results": "{n} results",
    "dir.jump": "Jump to letter",

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
    "person.facts": "Facts",
    "person.bio": "Biography",
    "person.family": "Family links",
    "person.born": "Born",
    "person.died": "Died",
    "person.birthplace": "Birthplace",

    "footer.tagline": "We record and grow the family together.",
    "footer.github": "The whole tree and all its data are on GitHub →",

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
