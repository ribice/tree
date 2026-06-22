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

  it("documents that only family-tree data changes need changelog entries", () => {
    expect(existsSync("CLAUDE.md")).toBe(true);
    const claude = readFileSync("CLAUDE.md", "utf8");

    expect(claude).toContain("src/lib/changelog.ts");
    expect(claude).toContain("family-tree data");
    expect(claude).toContain("CSS-only");
  });

  it("records the GEDCOM import as a data changelog entry", () => {
    expect(existsSync("src/lib/changelog.ts")).toBe(true);
    const changelog = readFileSync("src/lib/changelog.ts", "utf8");

    expect(changelog).toContain('kind: "data"');
    expect(changelog).toContain("GEDCOM");
    expect(changelog).toContain("Ribic Family Tree.ged");
  });
});
