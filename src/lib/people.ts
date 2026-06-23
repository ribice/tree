import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/ui";
import { displayTaglineFor } from "./display";
import {
  filterPeopleForView,
  filterRelationshipIds,
  type PeopleView,
} from "./people-visibility";
import { isLikelyLivingDateSpan, publicDate, publicLifespan } from "./privacy";
import { treeDisplayName } from "../components/tree/tree-person-details";
import { isRibicFamilyMember, bloodlineIds } from "./family-membership";

export { bloodlineIds };

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

/** People for a public view, sorted by name. Defaults to the compact core tree. */
export async function getPeople(view: PeopleView = "core"): Promise<Person[]> {
  const people = await getCollection("people");
  return filterPeopleForView(people, view).sort((a, b) =>
    a.data.name.localeCompare(b.data.name),
  );
}

/** Every public profile, including records that only appear in extended views. */
export async function getAllPeople(): Promise<Person[]> {
  return getPeople("extended");
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
  return isLikelyLivingDateSpan(p.data);
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

/** 1-based generation depth: 1 + the depth of the deepest known parent line.
 * Taking the deepest line (not the first-listed parent) keeps a person counted
 * against their oldest traceable ancestor even when a married-in parent with no
 * ancestry here is listed first — e.g. a child of [married-in father, Ribić
 * mother] is placed by the mother's line, not stranded near the root. */
export function generation(p: Person, people: Person[]): number {
  const byId = indexById(people);
  const memo = new Map<string, number>();
  const depthOf = (person: Person, seen: Set<string>): number => {
    const cached = memo.get(person.id);
    if (cached !== undefined) return cached;
    if (seen.has(person.id)) return 1; // guard against parent cycles
    seen.add(person.id);
    let depth = 1;
    for (const id of person.data.parents) {
      const parent = byId.get(id);
      if (parent) depth = Math.max(depth, depthOf(parent, seen) + 1);
    }
    seen.delete(person.id);
    memo.set(person.id, depth);
    return depth;
  };
  return depthOf(p, new Set());
}

/** Best-effort numeric birth year for sorting ("c. 1890" -> 1890). */
export function birthYear(p: Person): number | null {
  const match = p.data.born?.match(/\d{4}/);
  return match ? Number(match[0]) : null;
}

/** Compact lifespan label, e.g. "1945 – 2018", "r. 1980" / "b. 1980". */
export function lifespan(p: Person, locale: Locale = "bs"): string {
  return publicLifespan(p.data, isLiving(p), locale);
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
  treeName?: string;
  sex?: "m" | "f";
  tagline?: string;
  lifespan: string;
  birthDate?: string;
  deathDate?: string;
  birthplace?: string;
  photo?: string;
  initials: string;
  living: boolean;
  ribicFamily: boolean;
  parents: string[];
  spouses: string[];
  spouseLinks: SpouseLink[];
}

export function toTreeData(
  people: Person[],
  translations: Map<string, Translation>,
  locale: Locale,
): TreeNodePerson[] {
  const visibleIds = new Set(people.map((p) => p.id));
  const treeNameFor = (person: Person) =>
    treeDisplayName(person.data.name, person.data.maidenName);

  return people.map((p) => {
    const living = isLiving(p);
    const treeName = treeNameFor(p);
    return {
      id: p.id,
      name: p.data.name,
      treeName,
      sex: p.data.sex,
      tagline: displayTaglineFor(p, people, translations, locale, treeNameFor),
      lifespan: lifespan(p, locale),
      birthDate: p.data.born ? publicDate(p.data.born, living) : undefined,
      deathDate: p.data.died ? publicDate(p.data.died, false) : undefined,
      birthplace: p.data.birthplace,
      photo: p.data.photo,
      initials: initials(p.data.name),
      living,
      ribicFamily: isRibicFamilyMember(p),
      parents: filterRelationshipIds(p.data.parents, visibleIds),
      spouses: filterRelationshipIds(spouseIds(p), visibleIds),
      spouseLinks: spouseLinks(p).filter((link) => visibleIds.has(link.id)),
    };
  });
}

export type { PeopleView } from "./people-visibility";
