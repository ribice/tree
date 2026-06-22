import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const familyTree = readFileSync("src/components/FamilyTree.tsx", "utf8");
const treeView = readFileSync("src/components/views/TreeView.astro", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");
const styles = readFileSync("src/styles/global.css", "utf8");

describe("tree search", () => {
  it("wires localized search labels into the React tree", () => {
    expect(treeView).toContain('search: t("tree.search")');
    expect(treeView).toContain('searchPlaceholder: t("tree.searchPlaceholder")');
    expect(treeView).toContain('searchEmpty: t("tree.searchEmpty")');
    expect(ui).toContain('"tree.search": "Pronađi osobu"');
    expect(ui).toContain('"tree.search": "Find a person"');
    expect(ui).toContain('"tree.searchEmpty": "Nema rezultata u stablu."');
    expect(ui).toContain('"tree.searchEmpty": "No results in the tree."');
  });

  it("can focus a selected person from the search UI", () => {
    expect(familyTree).toContain("searchQuery");
    expect(familyTree).toContain("focusPerson");
    expect(familyTree).toContain("tree-search-panel");
    expect(styles).toContain(".tree-search-panel");
  });
});
