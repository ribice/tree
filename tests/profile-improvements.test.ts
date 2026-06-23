import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const profileView = readFileSync("src/components/views/ProfileView.astro", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");
const styles = readFileSync("src/styles/profile.css", "utf8");

describe("profile improvements", () => {
  it("keeps core profile facts in one compact header row", () => {
    expect(profileView).toContain("profile-meta-list");
    expect(profileView).toContain("heroMeta");
    expect(profileView).toContain("📅");
    expect(profileView).toContain("📍");
    expect(profileView).not.toContain("profile-ribbon");
    expect(profileView).not.toContain("profile-snapshot");
    expect(profileView).not.toContain("snapshotCards");
    expect(profileView).not.toContain("fact-panel");
    expect(styles).toContain(".profile-meta-list");
    expect(styles).not.toContain(".profile-snapshot");
  });

  it("surfaces missing data without hiding the profile", () => {
    expect(profileView).toContain("missingFacts");
    expect(profileView).toContain("data-quality-badge");
    expect(ui).toContain('"person.needsDetails"');
    expect(ui).toContain('"person.unknownBirth"');
  });

  it("shows the family map beside the hero, above the biography", () => {
    expect(profileView).toContain("profile-top");
    expect(profileView).toContain("profile-bio-section");
    // Family map now sits in the top grid next to the hero, before the bio.
    expect(profileView.indexOf("family-mini-map")).toBeLessThan(
      profileView.indexOf("profile-bio-section"),
    );
    expect(profileView).not.toContain("kin-panel");
  });
});
