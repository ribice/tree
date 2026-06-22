import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("extended family view routes", () => {
  it("adds static extended routes for tree, directory, stats, and tree data", () => {
    for (const file of [
      "src/pages/extended/tree.astro",
      "src/pages/extended/people/index.astro",
      "src/pages/extended/people/[id].astro",
      "src/pages/extended/stats.astro",
      "src/pages/extended/tree-data.json.ts",
      "src/pages/en/extended/tree.astro",
      "src/pages/en/extended/people/index.astro",
      "src/pages/en/extended/people/[id].astro",
      "src/pages/en/extended/stats.astro",
      "src/pages/en/extended/tree-data.json.ts",
    ]) {
      expect(existsSync(file), `${file} should exist`).toBe(true);
    }
  });

  it("wires a localized core/extended switch into the main data views", () => {
    const ui = readFileSync("src/i18n/ui.ts", "utf8");
    const tree = readFileSync("src/components/views/TreeView.astro", "utf8");
    const directory = readFileSync("src/components/views/DirectoryView.astro", "utf8");
    const stats = readFileSync("src/components/views/StatsView.astro", "utf8");

    expect(ui).toContain('"view.core"');
    expect(ui).toContain('"view.extended"');
    expect(tree).toContain("ViewModeToggle");
    expect(directory).toContain("ViewModeToggle");
    expect(stats).toContain("ViewModeToggle");
  });

  it("keeps profile links inside the selected extended context", () => {
    const tree = readFileSync("src/components/views/TreeView.astro", "utf8");
    const directory = readFileSync("src/components/views/DirectoryView.astro", "utf8");
    const profile = readFileSync("src/components/views/ProfileView.astro", "utf8");

    expect(tree).toContain('view === "extended" ? "/extended/people" : "/people"');
    expect(directory).toContain('view === "extended" ? "/extended/people" : "/people"');
    expect(profile).toContain('view = "core"');
    expect(profile).toContain('isExtendedProfile ? await getAllPeople() : await getPeople()');
  });
});
