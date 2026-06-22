import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const treeView = readFileSync("src/components/views/TreeView.astro", "utf8");
const familyTree = readFileSync("src/components/FamilyTree.tsx", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");

describe("tree data loading and branch mode", () => {
  it("loads tree people from static JSON routes instead of serializing into HTML", () => {
    expect(existsSync("src/pages/tree-data.json.ts")).toBe(true);
    expect(existsSync("src/pages/en/tree-data.json.ts")).toBe(true);
    expect(treeView).toContain("dataUrl");
    expect(treeView).not.toContain("people={treeData}");
  });

  it("supports a focused branch query mode", () => {
    expect(familyTree).toContain("branchTarget");
    expect(familyTree).toContain("branchSet");
    expect(familyTree).toContain('new URLSearchParams(window.location.search).get("branch")');
    expect(ui).toContain('"tree.showAll"');
  });
});
