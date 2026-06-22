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
