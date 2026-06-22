import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("data quality screen", () => {
  it("has localized pages and footer links", () => {
    expect(existsSync("src/pages/quality.astro")).toBe(true);
    expect(existsSync("src/pages/en/quality.astro")).toBe(true);

    const layout = readFileSync("src/layouts/Layout.astro", "utf8");
    expect(layout).toContain('localize("/quality", lang)');
  });

  it("summarizes missing and suspicious family data", () => {
    const view = readFileSync("src/components/views/DataQualityView.astro", "utf8");
    const helper = readFileSync("src/lib/data-quality.ts", "utf8");
    const ui = readFileSync("src/i18n/ui.ts", "utf8");

    expect(view).toContain("collectDataQuality");
    expect(helper).toContain("missingBirth");
    expect(helper).toContain("oneWaySpouse");
    expect(helper).toContain("suspiciousTagline");
    expect(ui).toContain('"quality.title"');
  });
});
