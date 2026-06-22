import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const familyTree = readFileSync("src/components/FamilyTree.tsx", "utf8");

describe("FamilyTree structure", () => {
  it("extracts tree state hooks and presentational subcomponents", () => {
    const expectedFiles = [
      "src/components/tree/TreeSearch.tsx",
      "src/components/tree/TreeControls.tsx",
      "src/components/tree/TreePersonCard.tsx",
      "src/components/tree/useTreeData.ts",
      "src/components/tree/useBranchMode.ts",
      "src/components/tree/useTreeViewport.ts",
      "src/components/tree/relationships.ts",
    ];

    for (const file of expectedFiles) {
      expect(existsSync(file), file).toBe(true);
    }

    expect(familyTree).toContain('from "./tree/TreeSearch"');
    expect(familyTree).toContain('from "./tree/TreeControls"');
    expect(familyTree).toContain('from "./tree/TreePersonCard"');
    expect(familyTree).not.toContain("function PersonCard(");
    expect(familyTree).not.toContain("function PillButton(");
  });

  it("reveals marriage date labels only when the connector is hovered", () => {
    const treeStyles = readFileSync("src/styles/tree.css", "utf8");

    expect(familyTree).toContain("marriageLabel");
    expect(familyTree).toContain('className="tree-marriage-link"');
    expect(familyTree).toContain('className="tree-marriage-hitbox"');
    expect(familyTree).toContain("<text");
    expect(treeStyles).toContain(".tree-marriage-link:hover .tree-marriage-label");
    expect(treeStyles).toContain("opacity: 0");
  });
});
