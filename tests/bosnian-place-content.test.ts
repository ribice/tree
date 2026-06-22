import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const peopleDir = "src/content/people";
const personFiles = readdirSync(peopleDir)
  .filter((file) => file.endsWith(".md"))
  .map((file) => join(peopleDir, file));
const englishPlaceFragments =
  /\b(Belgium|Netherlands|Federation of Bosnia and Herzegovina|Bosnia and Herzegovina|Serb Republic|Republic of Srpska)\b/;

describe("Bosnian place content", () => {
  it("does not leave English country or region names in Bosnian person records", () => {
    for (const file of personFiles) {
      const content = readFileSync(file, "utf8");
      expect(content, file).not.toMatch(englishPlaceFragments);
    }
  });

  it("uses Bosnian country forms in birthplaces and prose", () => {
    expect(readFileSync("src/content/people/asja.md", "utf8")).toContain("Belgiji");
    expect(readFileSync("src/content/people/tarik-hamza.md", "utf8")).toContain("Nizozemskoj");
    expect(readFileSync("src/content/people/selma-paldum.md", "utf8")).toContain("Bosni i Hercegovini");
  });
});
