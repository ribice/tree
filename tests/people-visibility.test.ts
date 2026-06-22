import { describe, expect, it } from "vitest";
import {
  filterRelationshipIds,
  filterPeopleForView,
  isExtendedPerson,
} from "../src/lib/people-visibility";

const person = (id: string, data: Record<string, unknown> = {}) =>
  ({
    id,
    body: "",
    collection: "people",
    data: {
      name: id,
      parents: [],
      spouses: [],
      ...data,
    },
  }) as any;

describe("people visibility", () => {
  it("keeps extended people out of the core view", () => {
    const core = person("core");
    const extended = person("extended", { visibility: "extended" });

    expect(isExtendedPerson(extended)).toBe(true);
    expect(filterPeopleForView([core, extended], "core").map((p) => p.id)).toEqual([
      "core",
    ]);
    expect(filterPeopleForView([core, extended], "extended").map((p) => p.id)).toEqual([
      "core",
      "extended",
    ]);
  });

  it("omits hidden relationship ids from tree data", () => {
    const ids = new Set(["core"]);

    expect(filterRelationshipIds(["core", "extended-parent"], ids)).toEqual(["core"]);
  });
});
