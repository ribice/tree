import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const qualityView = readFileSync("src/components/views/DataQualityView.astro", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");

describe("data quality improvements", () => {
  it("groups issues into useful categories with GitHub edit actions", () => {
    expect(qualityView).toContain("qualityCategories");
    expect(qualityView).toContain("quality-filter-nav");
    expect(qualityView).toContain("githubEditUrl");
    expect(qualityView).toContain("quality.openFile");

    for (const key of [
      "quality.categoryCritical",
      "quality.categoryBasics",
      "quality.categoryPhotos",
      "quality.categoryRelationships",
      "quality.categoryWording",
    ]) {
      expect(ui).toContain(`"${key}"`);
    }
  });
});
