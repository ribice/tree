import { describe, expect, it } from "vitest";
import { displayTaglineFor } from "../src/lib/display";
import { treeDisplayName } from "../src/components/tree/tree-person-details";

const person = (over: Record<string, unknown>) =>
  ({
    id: over.id ?? "person",
    body: over.body ?? "",
    data: {
      name: over.name ?? "Person",
      parents: over.parents ?? [],
      spouses: over.spouses ?? [],
      tagline: over.tagline,
      ...((over.data as Record<string, unknown>) ?? {}),
    },
  }) as any;

describe("displayTaglineFor", () => {
  it("replaces generated Bosnian child wording with relationship labels", () => {
    const child = person({
      id: "child",
      name: "Dijete",
      parents: ["father", "mother"],
      tagline: "Sin Husnijaa",
    });
    const people = [
      child,
      person({ id: "father", name: "Husnija Šuškić" }),
      person({ id: "mother", name: "Hafa Ribić" }),
    ];

    expect(displayTaglineFor(child, people, new Map(), "bs")).toBe(
      "Sin: Husnija Šuškić i Hafa Ribić",
    );
  });

  it("can resolve generated child wording with tree display names", () => {
    const child = person({
      id: "child",
      name: "Dijete",
      parents: ["father", "mother"],
      tagline: "Kćerka roditelja",
    });
    const people = [
      child,
      person({ id: "father", name: "Mersid Ribić" }),
      person({
        id: "mother",
        name: "Selma Ribić",
        data: { maidenName: "Paldum" },
      }),
    ];

    expect(
      displayTaglineFor(child, people, new Map(), "bs", (p) =>
        treeDisplayName(p.data.name, p.data.maidenName),
      ),
    ).toBe("Kćerka: Mersid Ribić i Selma Paldum");
  });

  it("replaces generated spouse wording with resolved spouse names", () => {
    const husband = person({
      id: "husband",
      name: "Muž",
      spouses: ["wife"],
      tagline: "Muž Eminin",
    });
    const people = [husband, person({ id: "wife", name: "Emina Musić" })];

    expect(displayTaglineFor(husband, people, new Map(), "bs")).toBe(
      "Muž: Emina Musić",
    );
  });

  it("keeps authored taglines intact", () => {
    const authored = person({
      id: "akif",
      tagline: "Po njemu su nas prozvali Kifići",
    });

    expect(displayTaglineFor(authored, [authored], new Map(), "bs")).toBe(
      "Po njemu su nas prozvali Kifići",
    );
  });
});
