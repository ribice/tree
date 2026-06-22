import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const familyTree = readFileSync("src/components/FamilyTree.tsx", "utf8");
const viewportHook = readFileSync("src/components/tree/useTreeViewport.ts", "utf8");

describe("tree wheel listener", () => {
  it("uses a non-passive native wheel listener so zoom can prevent page scroll", () => {
    expect(viewportHook).toContain('addEventListener("wheel"');
    expect(viewportHook).toContain("passive: false");
    expect(viewportHook).toContain("wheelTargetRef");
    expect(familyTree).not.toContain("onWheel={");
  });
});
