import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeView = readFileSync("src/components/views/HomeView.astro", "utf8");
const treeView = readFileSync("src/components/views/TreeView.astro", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");

describe("family member counts", () => {
  it("leads with the Ribić/Kifić blood-line count, not raw people totals", () => {
    expect(homeView).toContain("bloodlineIds");
    expect(homeView).toContain('getPeople("extended")');
    expect(homeView).toContain("bloodlineCount");
    expect(homeView).toContain("extendedPeopleCount");
    expect(homeView).not.toContain("String(people.length)");
  });

  it("labels the blood-line and extended family counts", () => {
    expect(ui).toContain('"stats.bloodline"');
    expect(ui).toContain('"home.statExtendedPeople"');
    expect(homeView).toContain('t("stats.bloodline")');
    expect(homeView).toContain('t("home.statExtendedPeople")');
  });

  it("uses the same blood-line count on the tree page as on the home page", () => {
    expect(treeView).toContain('bloodlineIds(await getPeople("extended"))');
    expect(treeView).toContain("familyCount");
    expect(treeView).toContain('t("home.eyebrow", { n: familyCount })');
  });
});
