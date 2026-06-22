import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const profileView = readFileSync("src/components/views/ProfileView.astro", "utf8");
const styles = readFileSync("src/styles/global.css", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");

describe("profile family map", () => {
  it("renders a compact parents-person-children map", () => {
    expect(profileView).toContain("family-mini-map");
    expect(profileView).toContain("miniMapGroups");
    expect(styles).toContain(".family-mini-map");
    expect(ui).toContain('"person.familyMap"');
  });
});
