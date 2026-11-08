import { describe, it, expect } from "vitest";
import { computeLayout } from "../src/lib/tree-layout";
import type { TreeNodePerson } from "../src/lib/people";

const person = (over: Partial<TreeNodePerson> & { id: string }): TreeNodePerson => ({
  name: over.id.toUpperCase(),
  lifespan: "",
  initials: over.id[0]!.toUpperCase(),
  living: false,
  parents: [],
  spouses: [],
  spouseLinks: [],
  ...over,
});

const data: TreeNodePerson[] = [
  person({ id: "a", spouses: ["b"], spouseLinks: [{ id: "b", married: "1940", divorced: "1950" }] }),
  person({ id: "b", spouses: ["a"], spouseLinks: [{ id: "a" }] }),
  person({ id: "c", parents: ["a", "b"] }),
  person({ id: "d", parents: ["a", "b"] }),
];

describe("computeLayout", () => {
  it("places every person once", () => {
    const lay = computeLayout(data);
    expect(lay.nodes.map((n) => n.person.id).sort()).toEqual(["a", "b", "c", "d"]);
  });

  it("draws a marriage and marks divorce", () => {
    const lay = computeLayout(data);
    expect(lay.marriages).toHaveLength(1);
    expect(lay.marriages[0].divorced).toBe(true);
    expect(lay.marriages[0].married).toBe("1940");
    expect(lay.marriages[0].divorcedDate).toBe("1950");
  });

  it("connects parents to children", () => {
    const lay = computeLayout(data);
    expect(lay.links.length).toBe(2); // a+b -> c, a+b -> d
  });

  it("collapses a branch and reports the hidden count", () => {
    const lay = computeLayout(data, new Set(["a"]));
    const ids = lay.nodes.map((n) => n.person.id).sort();
    expect(ids).toEqual(["a", "b"]); // c and d hidden
    const toggle = lay.toggles.find((t) => t.anchorId === "a");
    expect(toggle?.collapsed).toBe(true);
    expect(toggle?.count).toBe(2);
  });

  it("produces a positive canvas size", () => {
    const lay = computeLayout(data);
    expect(lay.width).toBeGreaterThan(0);
    expect(lay.height).toBeGreaterThan(0);
  });
});

describe("computeLayout with two partners", () => {
  const family: TreeNodePerson[] = [
    person({ id: "a", spouses: ["b", "c"] }),
    person({ id: "b", spouses: ["a"] }),
    person({ id: "c", spouses: ["a"] }),
    person({ id: "first", parents: ["a", "b"] }),
    person({ id: "second", parents: ["a", "c"] }),
  ];

  it("draws both partnerships and places everyone once", () => {
    const lay = computeLayout(family);
    expect(lay.nodes.map((n) => n.person.id).sort()).toEqual(["a", "b", "c", "first", "second"]);
    expect(lay.marriages.map((m) => [m.aId, m.bId].sort().join("-")).sort()).toEqual(["a-b", "a-c"]);
  });

  it("hangs each child from the partnership they belong to", () => {
    const lay = computeLayout(family);
    const midpoint = (id: string) => {
      const m = lay.marriages.find((x) => x.aId === id || x.bId === id)!;
      return (m.x1 + m.x2) / 2;
    };
    const linkTo = (id: string) => lay.links.find((l) => l.toId === id)!;
    expect(linkTo("first").parentX).toBeCloseTo(midpoint("b"));
    expect(linkTo("second").parentX).toBeCloseTo(midpoint("c"));
  });

  it("does not place cards on top of each other", () => {
    const lay = computeLayout(family);
    const xs = lay.nodes.filter((n) => n.y === lay.nodes[0]!.y).map((n) => n.x).sort((p, q) => p - q);
    for (let i = 1; i < xs.length; i++) expect(xs[i]! - xs[i - 1]!).toBeGreaterThanOrEqual(216);
  });
});
