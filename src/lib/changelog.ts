import type { Locale } from "../i18n/ui";

type Localized<T> = Record<Locale, T>;

export interface ChangelogEntry {
  date: string;
  kind: "data";
  title: Localized<string>;
  summary: Localized<string>;
  changes: Localized<string[]>;
}

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-06-22",
    kind: "data",
    title: {
      bs: "Uvezeni GEDCOM podaci",
      en: "GEDCOM data imported",
    },
    summary: {
      bs: "Ribic Family Tree.ged je iskorišten kao izvor istine za veći unos i usklađivanje porodičnih podataka.",
      en: "Ribic Family Tree.ged was used as the source of truth for a larger family-data import and reconciliation.",
    },
    changes: {
      bs: [
        "Imenik je proširen novim osobama iz GEDCOM fajla i povezanim prevodima.",
        "Dopunjene su grane Lunja, Paldum, Pekmez, Dizdar, Bašić, Gradečak, Šuman, Hasić, Šuškić, Krpo i druge povezane porodice.",
        "Kod neslaganja su prednost dobili datumi, roditeljske veze i bračne veze iz GEDCOM izvora.",
        "GEDCOM fajl je nakon uvoza uklonjen iz repozitorija.",
      ],
      en: [
        "The directory was expanded with new people from the GEDCOM file and matching translations.",
        "The Lunja, Paldum, Pekmez, Dizdar, Bašić, Gradečak, Šuman, Hasić, Šuškić, Krpo, and other connected branches were filled out.",
        "Where records disagreed, dates, parent links, and marriage links from the GEDCOM source were preferred.",
        "The GEDCOM file was removed from the repository after import.",
      ],
    },
  },
];
