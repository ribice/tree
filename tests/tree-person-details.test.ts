import { describe, expect, it } from "vitest";
import {
  treeDisplayName,
  treePersonTooltip,
} from "../src/components/tree/tree-person-details";

describe("tree person details", () => {
  it("shows original Ribić surnames on tree cards for born Ribić people", () => {
    expect(treeDisplayName("Emina Musić", "Ribić")).toBe("Emina Ribić");
    expect(treeDisplayName("Naida Gradečak", "Ribić")).toBe("Naida Ribić");
    expect(treeDisplayName("Rasim Ribić — Kifić", undefined)).toBe("Rasim Ribić — Kifić");
  });

  it("builds a hover tooltip from public vital facts", () => {
    expect(
      treePersonTooltip(
        {
          name: "Emina Musić",
          treeName: "Emina Ribić",
          birthDate: "1988",
          deathDate: "",
          birthplace: "Jajce",
          tagline: "Kćerka Esada i Dženane",
        },
        {
          born: "Rođena",
          died: "Umrla",
          birthplace: "Mjesto rođenja",
        },
      ),
    ).toBe(
      [
        "Emina Ribić",
        "Emina Musić",
        "Rođena: 1988",
        "Mjesto rođenja: Jajce",
        "Kćerka Esada i Dženane",
      ].join("\n"),
    );
  });
});
