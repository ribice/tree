import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("search engine indexing", () => {
  it("marks every page noindex through the shared layout", () => {
    const layout = readFileSync("src/layouts/Layout.astro", "utf8");
    expect(layout).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(layout).not.toContain("{noindex &&");
  });

  it("sends noindex for non-HTML files such as photos and tree data", () => {
    expect(readFileSync("netlify.toml", "utf8")).toContain('X-Robots-Tag = "noindex, nofollow"');
  });

  it("does not advertise URLs, and does not block crawlers from seeing noindex", () => {
    const robots = readFileSync("public/robots.txt", "utf8");
    expect(existsSync("src/pages/sitemap.xml.ts")).toBe(false);
    expect(robots).not.toMatch(/^Sitemap:/m);
    expect(robots).not.toMatch(/^Disallow: \/$/m);
  });
});
