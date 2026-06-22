export interface TreeTooltipPerson {
  name: string;
  treeName?: string;
  birthDate?: string;
  deathDate?: string;
  birthplace?: string;
  tagline?: string;
}

export interface TreeTooltipLabels {
  born: string;
  died: string;
  birthplace: string;
}

function isRibicSurname(value: string | undefined): boolean {
  return Boolean(value?.trim().toLocaleLowerCase().match(/^ribić$|^ribic$/));
}

export function treeDisplayName(name: string, maidenName: string | undefined): string {
  const maiden = maidenName?.trim();
  if (!isRibicSurname(maiden)) return name;
  if (name.toLocaleLowerCase().includes(maiden!.toLocaleLowerCase())) return name;
  return name.trim().includes(" ")
    ? name.trim().replace(/\s+\S+$/, ` ${maiden}`)
    : `${name.trim()} ${maiden}`;
}

export function treePersonTooltip(
  person: TreeTooltipPerson,
  labels: TreeTooltipLabels,
): string {
  const displayName = person.treeName || person.name;
  const lines = [displayName];
  if (displayName !== person.name) lines.push(person.name);
  if (person.birthDate) lines.push(`${labels.born}: ${person.birthDate}`);
  if (person.deathDate) lines.push(`${labels.died}: ${person.deathDate}`);
  if (person.birthplace) lines.push(`${labels.birthplace}: ${person.birthplace}`);
  if (person.tagline) lines.push(person.tagline);
  return lines.join("\n");
}
