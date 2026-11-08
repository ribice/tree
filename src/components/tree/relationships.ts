import type { TreeNodePerson } from "../../lib/people";

export function ancestorsOf(id: string, people: TreeNodePerson[]): string[] {
  const byId = new Map(people.map((person) => [person.id, person]));
  const out = new Set<string>();

  const walk = (personId: string) => {
    const person = byId.get(personId);
    if (!person) return;
    for (const parent of person.parents) {
      if (!out.has(parent)) {
        out.add(parent);
        walk(parent);
      }
    }
  };

  walk(id);
  return [...out];
}

/**
 * Everyone whose branch must be open for `id` to appear. A married-in spouse
 * has no ancestors of their own here: they sit in their partner's unit, so the
 * partner's line has to open as well.
 */
export function revealPathOf(id: string, people: TreeNodePerson[]): string[] {
  const byId = new Map(people.map((person) => [person.id, person]));
  const ancestors = ancestorsOf(id, people);
  const out = new Set(ancestors);
  for (const personId of [id, ...ancestors]) {
    for (const partner of byId.get(personId)?.spouses ?? []) {
      if (personId !== id) out.add(partner);
      for (const ancestor of ancestorsOf(partner, people)) out.add(ancestor);
    }
  }
  return [...out];
}

export function descendantsOf(id: string, people: TreeNodePerson[]): string[] {
  const out = new Set<string>();

  const walk = (personId: string) => {
    for (const person of people) {
      if (person.parents.includes(personId) && !out.has(person.id)) {
        out.add(person.id);
        walk(person.id);
      }
    }
  };

  walk(id);
  return [...out];
}
