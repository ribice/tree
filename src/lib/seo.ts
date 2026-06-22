import { localize, type Locale } from "../i18n/ui";
import type { Person, Translation } from "./people";

export const ORIGIN: Record<Locale, string> = {
  bs: "https://stablo.ribic.ba",
  en: "https://tree.ribic.ba",
};

export interface AlternateLink {
  hreflang: "bs" | "en" | "x-default";
  href: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

const stripEnglishPrefix = (pathname: string) =>
  (pathname || "/").replace(/^\/en(?=\/|$)/, "") || "/";

export function pathForLocale(pathname: string, locale: Locale): string {
  return localize(stripEnglishPrefix(pathname), locale);
}

export function canonicalUrl(pathname: string, locale: Locale): string {
  return ORIGIN[locale] + pathForLocale(pathname, locale);
}

export function absoluteUrl(path: string, locale: Locale): string {
  if (/^https?:\/\//.test(path)) return path;
  return ORIGIN[locale] + (path.startsWith("/") ? path : `/${path}`);
}

export function alternateLinks(pathname: string): AlternateLink[] {
  const bsPath = pathForLocale(pathname, "bs");
  const enPath = pathForLocale(pathname, "en");
  return [
    { hreflang: "bs", href: ORIGIN.bs + bsPath },
    { hreflang: "en", href: ORIGIN.en + enPath },
    { hreflang: "x-default", href: ORIGIN.bs + bsPath },
  ];
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function normalizeSpan(span: string): string {
  return span.replace(/\s+–\s+/g, " - ");
}

function yearLike(value: string | undefined): string | undefined {
  return value?.match(/\d{4}/)?.[0];
}

function localizedTagline(
  person: Person,
  translations: Map<string, Translation>,
  locale: Locale,
): string | undefined {
  if (locale === "en") {
    return translations.get(person.id)?.data.tagline ?? person.data.tagline;
  }
  return person.data.tagline;
}

function localizedLifespan(person: Person, locale: Locale): string {
  const { born, died } = person.data;
  const bornPrefix = locale === "en" ? "b. " : "r. ";
  const diedPrefix = locale === "en" ? "d. " : "u. ";
  if (born && died) return `${born} - ${died}`;
  if (born) return `${bornPrefix}${born}`;
  if (died) return `${diedPrefix}${died}`;
  return "";
}

function spouseIds(person: Person): string[] {
  return (person.data.spouses ?? []).map((spouse) =>
    typeof spouse === "string" ? spouse : spouse.id,
  );
}

function resolveRelationships(person: Person, people: Person[]) {
  const byId = new Map(people.map((p) => [p.id, p]));
  const resolve = (ids: string[]) =>
    ids.map((id) => byId.get(id)).filter((p): p is Person => Boolean(p));
  return {
    parents: resolve(person.data.parents ?? []),
    spouses: resolve(spouseIds(person)),
    children: people.filter((p) => (p.data.parents ?? []).includes(person.id)),
  };
}

export function personDescription(
  person: Person,
  translations: Map<string, Translation>,
  locale: Locale,
): string {
  const span = normalizeSpan(localizedLifespan(person, locale));
  const place = person.data.birthplace ? `, ${person.data.birthplace}` : "";
  const tagline = localizedTagline(person, translations, locale);
  const factText = span ? ` (${span})${place}` : place.replace(/^, /, ", ");
  const body = tagline ? `. ${tagline}.` : ".";
  return `${person.data.name}${factText}${body}`;
}

export function websiteJsonLd({
  locale,
  title,
  description,
  url,
}: {
  locale: Locale;
  title: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: title,
    description,
    url: ORIGIN[locale],
    inLanguage: locale === "bs" ? "bs-BA" : "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: `${ORIGIN[locale]}${localize("/people/", locale)}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    mainEntityOfPage: url,
  };
}

function personUrl(locale: Locale, id: string): string {
  return `${ORIGIN[locale]}${localize(`/people/${id}/`, locale)}`;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function personJsonLd({
  person,
  people,
  translations,
  locale,
  url,
}: {
  person: Person;
  people: Person[];
  translations: Map<string, Translation>;
  locale: Locale;
  url: string;
}) {
  const rels = resolveRelationships(person, people);
  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.data.name,
    description: personDescription(person, translations, locale),
    url,
  };

  const birthDate = yearLike(person.data.born);
  const deathDate = yearLike(person.data.died);
  if (birthDate) json.birthDate = birthDate;
  if (deathDate) json.deathDate = deathDate;
  if (person.data.birthplace) {
    json.birthPlace = { "@type": "Place", name: person.data.birthplace };
  }
  if (person.data.photo) json.image = absoluteUrl(person.data.photo, locale);

  if (rels.parents.length) {
    json.parent = rels.parents.map((p) => ({
      "@type": "Person",
      name: p.data.name,
      url: personUrl(locale, p.id),
    }));
  }
  if (rels.spouses.length) {
    json.spouse = rels.spouses.map((p) => ({
      "@type": "Person",
      name: p.data.name,
      url: personUrl(locale, p.id),
    }));
  }
  if (rels.children.length) {
    json.children = rels.children.map((p) => ({
      "@type": "Person",
      name: p.data.name,
      url: personUrl(locale, p.id),
    }));
  }

  return json;
}
