import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("page shell", () => {
  it("centralizes simple localized page layout wrappers", () => {
    expect(existsSync("src/components/PageShell.astro")).toBe(true);

    const pageShell = readFileSync("src/components/PageShell.astro", "utf8");
    expect(pageShell).toContain("Layout");
    expect(pageShell).toContain("titleKey");
    expect(pageShell).toContain("descriptionKey");

    for (const page of [
      "src/pages/add.astro",
      "src/pages/en/add.astro",
      "src/pages/stats.astro",
      "src/pages/en/stats.astro",
      "src/pages/quality.astro",
      "src/pages/en/quality.astro",
    ]) {
      expect(readFileSync(page, "utf8"), page).toContain("PageShell");
    }
  });
});
