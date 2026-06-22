import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const layout = readFileSync("src/layouts/Layout.astro", "utf8");
const sitemap = readFileSync("src/pages/sitemap.xml.ts", "utf8");

describe("family data changelog", () => {
  it("has localized pages linked from the footer and sitemap", () => {
    expect(existsSync("src/pages/changelog.astro")).toBe(true);
    expect(existsSync("src/pages/en/changelog.astro")).toBe(true);
    expect(layout).toContain('localize("/changelog", lang)');
    expect(sitemap).toContain('"/changelog/"');
  });

  it("records the GEDCOM import as a data changelog entry", () => {
    expect(existsSync("src/lib/changelog.ts")).toBe(true);
    const changelog = readFileSync("src/lib/changelog.ts", "utf8");

    expect(changelog).toContain('kind: "data"');
    expect(changelog).toContain("GEDCOM");
    expect(changelog).toContain("Ribic Family Tree.ged");
  });
});
