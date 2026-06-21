import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/ui";

export type Person = CollectionEntry<"people">;
export type Translation = CollectionEntry<"translations">;

export interface SpouseLink {
  id: string;
  married?: string;
  divorced?: string;
}

/** Normalize the spouses field (strings or objects) to SpouseLink objects. */
export function spouseLinks(p: Person): SpouseLink[] {
  return (p.data.spouses ?? []).map((s) =>
    typeof s === "string" ? { id: s } : s,
  );
}

export function spouseIds(p: Person): string[] {
  return spouseLinks(p).map((s) => s.id);
}

/** All people, sorted by name. */
export async function getPeople(): Promise<Person[]> {
  const people = await getCollection("people");
  return people.sort((a, b) => a.data.name.localeCompare(b.data.name));
}

/** English translations keyed by person id. */
export async function getTranslations(): Promise<Map<string, Translation>> {
  const entries = await getCollection("translations");
  return new Map(entries.map((e) => [e.id, e]));
}

/** Localized tagline, falling back to the canonical (Bosnian) one. */
export function taglineFor(
  p: Person,
  translations: Map<string, Translation>,
  locale: Locale,
): string | undefined {
  if (locale === "en") return translations.get(p.id)?.data.tagline ?? p.data.tagline;
  return p.data.tagline;
}

/** Whether the person is (probably) still living: no recorded death and born
 * within roughly the last century. Unknown birth → treated as historical. */
export function isLiving(p: Person): boolean {
  if (p.data.died) return false;
  const y = birthYear(p);
  if (y === null) return false;
  return y >= new Date().getFullYear() - 105;
}

/** Lookup map keyed by person id (the file name without .md). */
export function indexById(people: Person[]): Map<string, Person> {
  return new Map(people.map((p) => [p.id, p]));
}

export interface Relationships {
  parents: Person[];
  spouses: Person[];
  children: Person[];
  siblings: Person[];
}

/** Resolve a person's immediate relatives from the full collection. */
export function relationships(person: Person, people: Person[]): Relationships {
  const byId = indexById(people);
  const resolve = (ids: string[]) =>
    ids.map((id) => byId.get(id)).filter((p): p is Person => Boolean(p));

  const parents = resolve(person.data.parents);
  const spouses = resolve(spouseIds(person));
  const children = people
    .filter((p) => p.data.parents.includes(person.id))
    .sort(byBirth);

  const parentIds = new Set(person.data.parents);
  const siblings = people
    .filter(
      (p) =>
        p.id !== person.id &&
        p.data.parents.some((pid) => parentIds.has(pid)),
    )
    .sort(byBirth);

  return { parents, spouses, children, siblings };
}

function byBirth(a: Person, b: Person): number {
  const ay = birthYear(a) ?? Infinity;
  const by = birthYear(b) ?? Infinity;
  if (ay !== by) return ay - by;
  return a.data.name.localeCompare(b.data.name);
}

/** 1-based generation depth, counting up to the earliest known ancestor. */
export function generation(p: Person, people: Person[]): number {
  const byId = indexById(people);
  let cur: Person | undefined = p;
  let depth = 1;
  let guard = 0;
  while (cur && cur.data.parents.length && guard++ < 50) {
    cur = cur.data.parents.map((id) => byId.get(id)).find(Boolean);
    if (cur) depth++;
  }
  return depth;
}

/** Best-effort numeric birth year for sorting ("c. 1890" -> 1890). */
export function birthYear(p: Person): number | null {
  const match = p.data.born?.match(/\d{4}/);
  return match ? Number(match[0]) : null;
}

/** Compact lifespan label, e.g. "1945 – 2018", "r. 1980" / "b. 1980". */
export function lifespan(p: Person, locale: Locale = "bs"): string {
  const { born, died } = p.data;
  const bornPrefix = locale === "en" ? "b. " : "r. ";
  const diedPrefix = locale === "en" ? "d. " : "u. ";
  if (born && died) return `${born} – ${died}`;
  if (born) return `${bornPrefix}${born}`;
  if (died) return `${diedPrefix}${died}`;
  return "";
}

/** Initials for the monogram avatar fallback. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/** Plain serializable shape handed to the React tree island. */
export interface TreeNodePerson {
  id: string;
  name: string;
  tagline?: string;
  lifespan: string;
  photo?: string;
  initials: string;
  living: boolean;
  parents: string[];
  spouses: string[];
  spouseLinks: SpouseLink[];
}

export function toTreeData(
  people: Person[],
  translations: Map<string, Translation>,
  locale: Locale,
): TreeNodePerson[] {
  return people.map((p) => ({
    id: p.id,
    name: p.data.name,
    tagline: taglineFor(p, translations, locale),
    lifespan: lifespan(p, locale),
    photo: p.data.photo,
    initials: initials(p.data.name),
    living: isLiving(p),
    parents: p.data.parents,
    spouses: spouseIds(p),
    spouseLinks: spouseLinks(p),
  }));
}
