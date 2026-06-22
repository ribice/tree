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
    "meta.add":
      "Dodaj novu osobu, ispravi podatak ili pošalji porodičnu priču za porodično stablo Ribića – Kifića.",
    "meta.stats":
      "Brojke porodičnog stabla Ribića – Kifića: članovi, generacije, prezimena, godine i mjesta rođenja.",
    "meta.changelog":
      "Pregled promjena u podacima porodičnog stabla Ribića – Kifića: novi članovi, ispravke veza, datumi i izvori.",
    "meta.quality":
      "Pregled nepotpunih i sumnjivih podataka u porodičnom stablu Ribića – Kifića.",

    "nav.home": "Početna",
    "nav.tree": "Stablo",
    "nav.directory": "Imenik",
    "nav.add": "Dodaj osobu",
    "nav.changelog": "Promjene",
    "nav.langName": "English",
    "nav.skip": "Preskoči na sadržaj",

    "add.title": "Dodaj osobu",
    "add.intro":
      "Popuni što znaš — ne mora sve. Mi ćemo provjeriti i dodati osobu u stablo. Ne treba ti nikakav nalog.",
    "add.name": "Ime i prezime",
    "add.maiden": "Djevojačko prezime",
    "add.nickname": "Nadimak",
    "add.sex": "Spol",
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
    "add.relationshipToFamily": "Kako je osoba povezana s porodicom",
    "add.photoLink": "Link do fotografije",
    "add.sourceNotes": "Izvor podataka / napomene",
    "add.privacyConsent":
      "Potvrđujem da ove podatke mogu podijeliti za porodičnu arhivu.",
    "add.submit": "Pošalji",
    "add.optional": "neobavezno",
    "add.none": "— odaberi —",
    "add.unknown": "Ne znam",
    "add.success":
      "Hvala! Tvoj prijedlog je poslan. Pregledat ćemo ga i uskoro dodati u stablo.",
    "add.successEyebrow": "Prijedlog poslan",
    "add.successTitle": "Hvala, prijedlog je zaprimljen",
    "add.successBody":
      "Poruka je poslana putem Netlify forme. Pregledat ćemo podatke i uvrstiti ih u stablo nakon provjere.",

    "home.eyebrow": "{n} članova porodice — i raste",
    "home.title": "Stablo Rasima Ribića – Kifića",
    "home.intro":
      "Živi zapis o tome ko smo i odakle smo — od jezerskog kadije Avdikadije do danas, koji svi zajedno pišemo i dopunjavamo.",
    "home.ctaTree": "Otvori stablo",
    "home.ctaDirectory": "Pregledaj sve članove",
    "home.oldest": "Najstariji preci",
    "home.recent": "Najmlađa generacija",
    "home.timeline": "Loza kroz vrijeme",
    "home.lineageKicker": "Od prvog zapisanog imena",
    "home.lineageBody":
      "Najstarija poznata linija počinje s Enesom i Omerom, vodi do Avdikadije, a zatim preko Kifića do današnjih potomaka.",
    "home.lineageStep": "{n}. koljeno",
    "home.aboutKicker": "O stablu",
    "home.aboutTitle": "Živi zapis porodice Ribić – Kifić",
    "home.aboutP1":
      "Ovo je živi zapis o porodici Ribić – Kifić iz Jezera, koji svi zajedno čuvamo. Loza seže od jezerskog kadije Avde »Avdikadije« (1775–1852) pa sve do danas.",
    "home.aboutP2":
      "Najveći dio ove građe zabilježili su Rasim Ribić i njegov sin Enes — tekstove o Avdikadiji, Akifu, Avdi Kifinu, amidži Esedu i drugima. Ovdje su sačuvani u izvornom obliku.",
    "home.aboutP3":
      "Ako znaš nešto što mi ne znamo — datum, priču, rođaka kojeg smo propustili — najlakše je popuniti formu Dodaj osobu. Pregledat ćemo i uvrstiti u stablo.",
    "home.aboutP4": "Cijelo stablo i svi podaci dostupni su otvoreno na GitHubu.",
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
    "tree.search": "Pronađi osobu",
    "tree.searchPlaceholder": "Ime, prezime ili nadimak…",
    "tree.searchEmpty": "Nema rezultata u stablu.",
    "tree.center": "Centriraj",
    "tree.loading": "Učitavanje stabla…",
    "tree.branchMode": "Prikazana grana: {name}",
    "tree.showAll": "Prikaži cijelo stablo",

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
    "person.snapshot": "Kratki pregled",
    "person.needsDetails": "Potrebna dopuna",
    "person.knownData": "Zabilježeno",
    "person.missingData": "Nedostaje",
    "person.unknownBirth": "Datum rođenja",
    "person.unknownBirthplace": "Mjesto rođenja",
    "person.unknownParents": "Roditelji",
    "person.unknownBio": "Biografija",
    "person.familyMap": "Mala mapa porodice",
    "person.self": "Osoba",
    "person.openBranch": "Otvori granu →",

    "footer.tagline": "Porodicu zajedno bilježimo i dopunjavamo.",
    "footer.github": "Cijelo stablo i svi podaci dostupni su na GitHubu →",

    "changelog.title": "Promjene u stablu",
    "changelog.eyebrow": "Dnevnik porodičnih podataka",
    "changelog.subtitle":
      "Ovdje se bilježe samo promjene u porodičnim podacima: nove osobe, veze, datumi, mjesta i veće ispravke. Vizuelne i tehničke izmjene nisu dio ovog dnevnika.",
    "changelog.kindData": "Podaci",

    "quality.title": "Kvalitet podataka",
    "quality.eyebrow": "Urednički pregled",
    "quality.subtitle":
      "Mjesta u stablu kojima treba provjera, dopuna ili fotografija.",
    "quality.totalIssues": "Stavki",
    "quality.peopleChecked": "Osoba pregledano",
    "quality.groups": "Grupa",
    "quality.more": "Još {n} stavki",
    "quality.missingBirth": "Nedostaje rođenje",
    "quality.missingBirthplace": "Nedostaje mjesto rođenja",
    "quality.missingParents": "Nedostaju roditelji",
    "quality.missingBio": "Nedostaje biografija",
    "quality.missingSex": "Nedostaje spol",
    "quality.missingPhoto": "Nedostaje fotografija",
    "quality.duplicateName": "Duplo ime",
    "quality.oneWaySpouse": "Jednosmjerna supružnička veza",
    "quality.unknownPlaceholder": "Nepoznata osoba / placeholder",
    "quality.suspiciousTagline": "Sumnjiv kratki opis",

    "stats.title": "Brojke",
    "stats.subtitle": "Stablo u brojkama.",
    "stats.people": "Osoba",
    "stats.generations": "Generacija",
    "stats.living": "Živih",
    "stats.span": "Raspon godina",
    "stats.surnames": "Prezimena",
    "stats.places": "Mjesta rođenja",
    "stats.map": "Mjesta na karti",
    "stats.completeness": "Popunjenost podataka",
    "stats.generationsChart": "Osobe po koljenu",
    "stats.decades": "Rođenja po deceniji",
    "stats.dataIssues": "Stavki za provjeru",
    "stats.withBirth": "Ima datum rođenja",
    "stats.withBirthplace": "Ima mjesto rođenja",
    "stats.withParents": "Ima roditelje",
    "stats.withBio": "Ima biografiju",
    "stats.withPhoto": "Ima fotografiju",
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
    "meta.add":
      "Add a person, correct a detail, or send a family story for the Ribić – Kifić family tree.",
    "meta.stats":
      "Numbers behind the Ribić – Kifić family tree: relatives, generations, surnames, years, and birthplaces.",
    "meta.changelog":
      "A record of family-tree data changes in the Ribić – Kifić tree: new relatives, corrected relationships, dates, and sources.",
    "meta.quality":
      "A review of incomplete and suspicious data in the Ribić – Kifić family tree.",

    "nav.home": "Home",
    "nav.tree": "Tree",
    "nav.directory": "Directory",
    "nav.add": "Add a person",
    "nav.changelog": "Changes",
    "nav.langName": "Bosanski",
    "nav.skip": "Skip to content",

    "add.title": "Add a person",
    "add.intro":
      "Fill in what you know — it doesn't have to be everything. We'll review it and add the person to the tree. No account needed.",
    "add.name": "Full name",
    "add.maiden": "Maiden name",
    "add.nickname": "Nickname",
    "add.sex": "Sex",
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
    "add.relationshipToFamily": "How this person connects to the family",
    "add.photoLink": "Photo link",
    "add.sourceNotes": "Source notes",
    "add.privacyConsent":
      "I confirm these details can be shared in the family archive.",
    "add.submit": "Submit",
    "add.optional": "optional",
    "add.none": "— choose —",
    "add.unknown": "I don't know",
    "add.success":
      "Thank you! Your suggestion has been sent. We'll review it and add it to the tree soon.",
    "add.successEyebrow": "Suggestion sent",
    "add.successTitle": "Thank you, your suggestion was received",
    "add.successBody":
      "The message was submitted through Netlify Forms. We will review the details and add them to the tree after checking them.",

    "home.eyebrow": "{n} relatives — and growing",
    "home.title": "The Ribić – Kifić Family Tree",
    "home.intro":
      "A living record of who we are and where we come from — from Avdo “Avdikadija”, the kadi of Jezero, down to today — written and kept up to date by all of us.",
    "home.ctaTree": "Open the tree",
    "home.ctaDirectory": "Browse everyone",
    "home.oldest": "Oldest ancestors",
    "home.recent": "Youngest generation",
    "home.timeline": "The line through time",
    "home.lineageKicker": "From the first recorded name",
    "home.lineageBody":
      "The oldest known line starts with Enes and Omer, reaches Avdikadija, and continues through the Kifić branch to today's descendants.",
    "home.lineageStep": "Generation {n}",
    "home.aboutKicker": "About the tree",
    "home.aboutTitle": "A living record of the Ribić – Kifić family",
    "home.aboutP1":
      "This is a living record of the Ribić – Kifić family from Jezero, preserved by all of us together. The line runs from Avdo “Avdikadija” (1775–1852), the kadi of Jezero, to today.",
    "home.aboutP2":
      "Most of this material was recorded by Rasim Ribić and his son Enes: the texts about Avdikadija, Akif, Avdo Kifin, uncle Esed, and others. They are preserved here in their original form.",
    "home.aboutP3":
      "If you know something we do not — a date, a story, or a relative we missed — the easiest path is the Add a person form. We will review it and add it to the tree.",
    "home.aboutP4": "The full tree and all data are openly available on GitHub.",
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
    "tree.search": "Find a person",
    "tree.searchPlaceholder": "Name, surname, or nickname…",
    "tree.searchEmpty": "No results in the tree.",
    "tree.center": "Center",
    "tree.loading": "Loading tree…",
    "tree.branchMode": "Showing branch: {name}",
    "tree.showAll": "Show full tree",

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
    "person.snapshot": "Snapshot",
    "person.needsDetails": "Needs details",
    "person.knownData": "Recorded",
    "person.missingData": "Missing",
    "person.unknownBirth": "Birth date",
    "person.unknownBirthplace": "Birthplace",
    "person.unknownParents": "Parents",
    "person.unknownBio": "Biography",
    "person.familyMap": "Mini family map",
    "person.self": "Person",
    "person.openBranch": "Open branch →",

    "footer.tagline": "We record and grow the family together.",
    "footer.github": "The whole tree and all its data are on GitHub →",

    "changelog.title": "Tree changes",
    "changelog.eyebrow": "Family data log",
    "changelog.subtitle":
      "This page records family-data changes only: new people, relationships, dates, places, and major corrections. Visual and technical work is intentionally left out.",
    "changelog.kindData": "Data",

    "quality.title": "Data quality",
    "quality.eyebrow": "Editorial review",
    "quality.subtitle":
      "People and records that need checking, completion, or a photo.",
    "quality.totalIssues": "Items",
    "quality.peopleChecked": "People checked",
    "quality.groups": "Groups",
    "quality.more": "{n} more items",
    "quality.missingBirth": "Missing birth",
    "quality.missingBirthplace": "Missing birthplace",
    "quality.missingParents": "Missing parents",
    "quality.missingBio": "Missing biography",
    "quality.missingSex": "Missing sex",
    "quality.missingPhoto": "Missing photo",
    "quality.duplicateName": "Duplicate name",
    "quality.oneWaySpouse": "One-way spouse link",
    "quality.unknownPlaceholder": "Unknown person / placeholder",
    "quality.suspiciousTagline": "Suspicious tagline",

    "stats.title": "By the numbers",
    "stats.subtitle": "The tree in numbers.",
    "stats.people": "People",
    "stats.generations": "Generations",
    "stats.living": "Living",
    "stats.span": "Year span",
    "stats.surnames": "Surnames",
    "stats.places": "Birthplaces",
    "stats.map": "Places on the map",
    "stats.completeness": "Data completeness",
    "stats.generationsChart": "People by generation",
    "stats.decades": "Births by decade",
    "stats.dataIssues": "Items to review",
    "stats.withBirth": "Has birth date",
    "stats.withBirthplace": "Has birthplace",
    "stats.withParents": "Has parents",
    "stats.withBio": "Has biography",
    "stats.withPhoto": "Has photo",
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
