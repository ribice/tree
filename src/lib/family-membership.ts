export interface FamilyNameRecord {
  data: {
    name: string;
    maidenName?: string;
  };
}

const FAMILY_TOKENS = new Set(["ribic", "kific", "kifin"]);

function nameTokens(value: string): string[] {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export function isRibicFamilyMember(person: FamilyNameRecord): boolean {
  return [person.data.name, person.data.maidenName]
    .filter((value): value is string => Boolean(value))
    .some((value) => nameTokens(value).some((token) => FAMILY_TOKENS.has(token)));
}

export interface LineageRecord {
  id: string;
  data: { parents: string[]; sex?: "m" | "f" };
}

/** Oldest forebear of the Ribić/Kifić line known by name. */
export const BLOODLINE_FOUNDER = "enes-predak";

/**
 * Ids of the Ribić/Kifić blood line: the founder plus everyone descended
 * through the male line (a person joins when their father is in the line).
 * Daughters born into the name count; married-in spouses and separate
 * branches that married in (e.g. Ilijaz's Ribić line) do not.
 */
export function bloodlineIds<T extends LineageRecord>(people: T[]): Set<string> {
  const byId = new Map(people.map((p) => [p.id, p]));
  const fatherOf = (p: T): T | undefined => {
    for (const id of p.data.parents) {
      const parent = byId.get(id);
      if (parent && parent.data.sex === "m") return parent;
    }
    return undefined;
  };
  const line = new Set<string>();
  if (byId.has(BLOODLINE_FOUNDER)) line.add(BLOODLINE_FOUNDER);
  let added = true;
  while (added) {
    added = false;
    for (const p of people) {
      if (line.has(p.id)) continue;
      const father = fatherOf(p);
      if (father && line.has(father.id)) {
        line.add(p.id);
        added = true;
      }
    }
  }
  return line;
}
