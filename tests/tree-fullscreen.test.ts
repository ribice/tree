import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const familyTree = readFileSync("src/components/FamilyTree.tsx", "utf8");
const treeControls = readFileSync("src/components/tree/TreeControls.tsx", "utf8");
const treeView = readFileSync("src/components/views/TreeView.astro", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");

describe("tree fullscreen control", () => {
  it("wires a localized Fullscreen API control into the tree view", () => {
    expect(treeView).toContain('fullscreen: t("tree.fullscreen")');
    expect(treeView).toContain('exitFullscreen: t("tree.exitFullscreen")');

    expect(familyTree).toContain("requestFullscreen");
    expect(familyTree).toContain("exitFullscreen");
    expect(familyTree).toContain("fullscreenchange");
    expect(treeControls).toContain("labels.fullscreen");
    expect(treeControls).toContain("labels.exitFullscreen");

    expect(ui).toContain('"tree.fullscreen": "Cijeli ekran"');
    expect(ui).toContain('"tree.exitFullscreen": "Izađi iz cijelog ekrana"');
    expect(ui).toContain('"tree.fullscreen": "Full screen"');
    expect(ui).toContain('"tree.exitFullscreen": "Exit full screen"');
  });
});
