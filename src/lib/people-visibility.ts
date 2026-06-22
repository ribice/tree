export type PeopleView = "core" | "extended";

export interface VisiblePersonLike {
  data: {
    visibility?: "extended";
  };
}

export function isExtendedPerson(person: VisiblePersonLike): boolean {
  return person.data.visibility === "extended";
}

export function filterPeopleForView<T extends VisiblePersonLike>(
  people: T[],
  view: PeopleView = "core",
): T[] {
  if (view === "extended") return people;
  return people.filter((person) => !isExtendedPerson(person));
}

export function filterRelationshipIds(ids: string[], visibleIds: Set<string>): string[] {
  return ids.filter((id) => visibleIds.has(id));
}
