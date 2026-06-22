import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const peopleLib = readFileSync("src/lib/people.ts", "utf8");
const treeCard = readFileSync("src/components/tree/TreePersonCard.tsx", "utf8");
const treeStyles = readFileSync("src/styles/tree.css", "utf8");

describe("tree family membership styling", () => {
  it("serializes Ribic-Kific membership into tree data", () => {
    expect(peopleLib).toContain("ribicFamily: boolean");
    expect(peopleLib).toContain("ribicFamily: isRibicFamilyMember(p)");
  });

  it("marks married-in people with a distinct tree class", () => {
    expect(treeCard).toContain("tree-person-married-in");
    expect(treeStyles).toContain(".tree-person-card.tree-person-married-in");
    expect(treeStyles).toContain(".tree-person-avatar.tree-person-married-in");
  });
});
