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
