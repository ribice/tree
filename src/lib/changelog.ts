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
      bs: "Skraćene sporedne porodične grane",
      en: "Side family branches trimmed",
    },
    summary: {
      bs: "Stablo je skraćeno na Ribić/Kifić liniju, supružnike, roditelje supružnika i prvu generaciju djece s drugim prezimenom.",
      en: "The tree was trimmed to the Ribić/Kifić line, spouses, spouses' parents, and the first generation of children with another surname.",
    },
    changes: {
      bs: [
        "Pekmez/Paldum grana je uklonjena izvan Selme Ribić i njenih roditelja, Hafe Pekmez i Mustafe Palduma.",
        "Uklonjene su preduboke sporedne grane preko Šuškić, Hasić, Dizdar/Borić, Gradečak, Zejnilagić, Alić i Krpo veza.",
        "Zadržani su supružnici, roditelji supružnika i direktna djeca Ribić potomaka s drugim prezimenom; uklonjeni su njihovi dalji potomci i supružnici.",
        "Dopunjena su mjesta rođenja: Hafa Dizdar je rođena u Glamoču, a Adis Gradečak u Rotterdamu.",
      ],
      en: [
        "Removed the Pekmez/Paldum branch beyond Selma Ribić and her parents, Hafa Pekmez and Mustafa Paldum.",
        "Removed overly deep side branches through the Šuškić, Hasić, Dizdar/Borić, Gradečak, Zejnilagić, Alić, and Krpo connections.",
        "Kept spouses, spouses' parents, and direct children of Ribić descendants with another surname; removed their later descendants and spouses.",
        "Added birthplaces: Hafa Dizdar was born in Glamoč, and Adis Gradečak in Rotterdam.",
      ],
    },
  },
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
