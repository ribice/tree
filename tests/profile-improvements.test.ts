import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const profileView = readFileSync("src/components/views/ProfileView.astro", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");
const styles = readFileSync("src/styles/global.css", "utf8");

describe("profile improvements", () => {
  it("renders a scannable family snapshot", () => {
    expect(profileView).toContain("profile-snapshot");
    expect(profileView).toContain("snapshotCards");
    expect(ui).toContain('"person.snapshot"');
    expect(styles).toContain(".profile-snapshot");
  });

  it("surfaces missing data without hiding the profile", () => {
    expect(profileView).toContain("missingFacts");
    expect(profileView).toContain("data-quality-badge");
    expect(ui).toContain('"person.needsDetails"');
    expect(ui).toContain('"person.unknownBirth"');
  });
});
