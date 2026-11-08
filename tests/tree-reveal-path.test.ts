import { describe, expect, it } from "vitest";
import { revealPathOf } from "../src/components/tree/relationships";
import type { TreeNodePerson } from "../src/lib/people";

const person = (id: string, parents: string[] = [], spouses: string[] = []) =>
  ({ id, parents, spouses }) as unknown as TreeNodePerson;

describe("revealPathOf", () => {
  const people = [
    person("root"),
    person("anchor", ["root"], ["spouse"]),
    person("spouse", [], ["anchor"]),
    person("child", ["spouse"]),
  ];

  it("opens a partner's line for a married-in spouse with no parents", () => {
    expect(revealPathOf("spouse", people)).toEqual(["root"]);
  });

  it("opens the line of a parent's partner, who anchors the family unit", () => {
    expect(revealPathOf("child", people).sort()).toEqual(["anchor", "root", "spouse"]);
  });
});
