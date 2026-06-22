import type { Locale } from "../i18n/ui";
import type { Person, Translation } from "./people";

type PersonLike = Pick<Person, "id" | "data">;

const childStarts = /^(sin|kćerka|kcerka|daughter|son|child)(?=\s|:|$)/i;
const spouseStarts = /^(muž|muz|žena|zena|supruga|suprug|wife|husband|spouse)(?=\s|:|$)/i;

function spouseIds(person: PersonLike): string[] {
  return (person.data.spouses ?? []).map((spouse) =>
    typeof spouse === "string" ? spouse : spouse.id,
  );
}

function joinNames(names: string[], locale: Locale): string {
  const separator = locale === "en" ? " and " : " i ";
  return names.join(separator);
}

function inferredChildSex(raw: string): "m" | "f" | undefined {
  if (/^(sin|son)(?=\s|:|$)/i.test(raw)) return "m";
  if (/^(kćerka|kcerka|daughter)(?=\s|:|$)/i.test(raw)) return "f";
  return undefined;
}

function inferredSpouseSex(raw: string): "m" | "f" | undefined {
  if (/^(muž|muz|suprug|husband)(?=\s|:|$)/i.test(raw)) return "m";
  if (/^(žena|zena|supruga|wife)(?=\s|:|$)/i.test(raw)) return "f";
  return undefined;
}

function childLabel(person: PersonLike, locale: Locale, raw: string): string {
  const sex = person.data.sex ?? inferredChildSex(raw);
  if (locale === "en") {
    if (sex === "f") return "Daughter";
    if (sex === "m") return "Son";
    return "Child";
  }
  if (sex === "f") return "Kćerka";
  if (sex === "m") return "Sin";
  return "Dijete";
}

function spouseLabel(person: PersonLike, locale: Locale, raw: string): string {
  const sex = person.data.sex ?? inferredSpouseSex(raw);
  if (locale === "en") {
    if (sex === "f") return "Wife";
    if (sex === "m") return "Husband";
    return "Spouse";
  }
  if (sex === "f") return "Supruga";
  if (sex === "m") return "Muž";
  return "Supružnik";
}

function localizedRawTagline(
  person: PersonLike,
  translations: Map<string, Translation>,
  locale: Locale,
): string | undefined {
  if (locale === "en") {
    return translations.get(person.id)?.data.tagline ?? person.data.tagline;
  }
  return person.data.tagline;
}

export function displayTaglineFor(
  person: PersonLike,
  people: PersonLike[],
  translations: Map<string, Translation>,
  locale: Locale,
): string | undefined {
  const raw = localizedRawTagline(person, translations, locale);
  if (!raw) return undefined;

  const byId = new Map(people.map((p) => [p.id, p]));
  if (childStarts.test(raw) && person.data.parents?.length) {
    const names = person.data.parents
      .map((id) => byId.get(id)?.data.name)
      .filter((name): name is string => Boolean(name));
    if (names.length) return `${childLabel(person, locale, raw)}: ${joinNames(names, locale)}`;
  }

  if (spouseStarts.test(raw) && spouseIds(person).length) {
    const names = spouseIds(person)
      .map((id) => byId.get(id)?.data.name)
      .filter((name): name is string => Boolean(name));
    if (names.length) return `${spouseLabel(person, locale, raw)}: ${joinNames(names, locale)}`;
  }

  return raw;
}

export function hasGeneratedRelationshipTagline(value: string | undefined): boolean {
  if (!value) return false;
  return childStarts.test(value) || spouseStarts.test(value);
}

export function hasSuspiciousText(value: string | undefined): boolean {
  if (!value) return false;
  return /[ðÐ]|\? \?|nepoznatia|husnijaa|mehmedovo|dževadovo|džemilino/i.test(
    value,
  );
}
