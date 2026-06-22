import type { Person, Translation } from "./people";
import {
  hasGeneratedRelationshipTagline,
  hasSuspiciousText,
} from "./display";

export type DataQualityKind =
  | "missingBirth"
  | "missingBirthplace"
  | "missingParents"
  | "missingBio"
  | "missingSex"
  | "missingPhoto"
  | "duplicateName"
  | "oneWaySpouse"
  | "unknownPlaceholder"
  | "suspiciousTagline";

export interface DataQualityIssue {
  kind: DataQualityKind;
  personId: string;
  personName: string;
  detail?: string;
}

export interface DataQualityGroup {
  kind: DataQualityKind;
  issues: DataQualityIssue[];
}

const orderedKinds: DataQualityKind[] = [
  "suspiciousTagline",
  "oneWaySpouse",
  "duplicateName",
  "unknownPlaceholder",
  "missingBirth",
  "missingBirthplace",
  "missingParents",
  "missingBio",
  "missingSex",
  "missingPhoto",
];

function spouseIds(person: Person): string[] {
  return (person.data.spouses ?? []).map((spouse) =>
    typeof spouse === "string" ? spouse : spouse.id,
  );
}

function add(
  issues: DataQualityIssue[],
  person: Person,
  kind: DataQualityKind,
  detail?: string,
) {
  issues.push({
    kind,
    personId: person.id,
    personName: person.data.name,
    detail,
  });
}

export function collectDataQuality(
  people: Person[],
  translations: Map<string, Translation> = new Map(),
): DataQualityGroup[] {
  const issues: DataQualityIssue[] = [];
  const byId = new Map(people.map((person) => [person.id, person]));
  const byName = new Map<string, Person[]>();

  for (const person of people) {
    byName.set(person.data.name, [...(byName.get(person.data.name) ?? []), person]);

    if (!person.data.born) add(issues, person, "missingBirth");
    if (!person.data.birthplace) add(issues, person, "missingBirthplace");
    if (!person.data.parents?.length) add(issues, person, "missingParents");
    if (!person.body?.trim()) add(issues, person, "missingBio");
    if (!person.data.sex) add(issues, person, "missingSex");
    if (!person.data.photo) add(issues, person, "missingPhoto");
    if (/[?]|^nepoznat/i.test(person.data.name)) {
      add(issues, person, "unknownPlaceholder", person.data.name);
    }

    const taglines = [
      person.data.tagline,
      translations.get(person.id)?.data.tagline,
    ].filter(Boolean) as string[];
    if (
      taglines.some(
        (tagline) =>
          hasSuspiciousText(tagline) ||
          (hasGeneratedRelationshipTagline(tagline) &&
            (hasSuspiciousText(person.data.name) || /\b[a-zčćžšđ]+(aa|ovo|ino)\b/i.test(tagline))),
      )
    ) {
      add(issues, person, "suspiciousTagline", taglines.join(" / "));
    }

    for (const spouseId of spouseIds(person)) {
      const spouse = byId.get(spouseId);
      if (!spouse) continue;
      if (!spouseIds(spouse).includes(person.id)) {
        add(issues, person, "oneWaySpouse", spouse.data.name);
      }
    }
  }

  for (const sameNamePeople of byName.values()) {
    if (sameNamePeople.length < 2) continue;
    const detail = sameNamePeople.map((person) => person.id).join(", ");
    for (const person of sameNamePeople) {
      add(issues, person, "duplicateName", detail);
    }
  }

  return orderedKinds
    .map((kind) => ({
      kind,
      issues: issues
        .filter((issue) => issue.kind === kind)
        .sort((a, b) => a.personName.localeCompare(b.personName)),
    }))
    .filter((group) => group.issues.length > 0);
}
