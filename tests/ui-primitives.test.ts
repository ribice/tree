import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("shared UI primitives", () => {
  it("uses small reusable Astro primitives for panels, stats, and mini person cards", () => {
    const expectedFiles = [
      "src/components/ui/Panel.astro",
      "src/components/ui/StatTile.astro",
      "src/components/ui/SectionHeader.astro",
      "src/components/ui/PersonMiniCard.astro",
    ];

    for (const file of expectedFiles) {
      expect(existsSync(file), file).toBe(true);
    }

    const stats = readFileSync("src/components/views/StatsView.astro", "utf8");
    const profile = readFileSync("src/components/views/ProfileView.astro", "utf8");
    const quality = readFileSync("src/components/views/DataQualityView.astro", "utf8");

    expect(stats).toContain("StatTile");
    expect(profile).toContain("PersonMiniCard");
    expect(quality).toContain("Panel");
  });
});
