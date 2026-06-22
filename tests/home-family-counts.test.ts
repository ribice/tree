import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeView = readFileSync("src/components/views/HomeView.astro", "utf8");
const treeView = readFileSync("src/components/views/TreeView.astro", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");

describe("family member counts", () => {
  it("uses Ribic-Kific counts instead of raw people totals on the home page", () => {
    expect(homeView).toContain("isRibicFamilyMember");
    expect(homeView).toContain('getPeople("extended")');
    expect(homeView).toContain("coreFamilyCount");
    expect(homeView).toContain("extendedPeopleCount");
    expect(homeView).not.toContain("String(people.length)");
  });

  it("has separate localized labels for core and extended family counts", () => {
    expect(ui).toContain('"home.statCorePeople"');
    expect(ui).toContain('"home.statExtendedPeople"');
    expect(homeView).toContain('t("home.statCorePeople")');
    expect(homeView).toContain('t("home.statExtendedPeople")');
  });

  it("keeps tree page eyebrow counts aligned with family membership", () => {
    expect(treeView).toContain("isRibicFamilyMember");
    expect(treeView).toContain("familyCount");
    expect(treeView).toContain('t("home.eyebrow", { n: familyCount })');
  });
});
