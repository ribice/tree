import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const netlify = readFileSync("netlify.toml", "utf8");
const layout = readFileSync("src/layouts/Layout.astro", "utf8");

describe("domain language routing", () => {
  it("routes English-domain content paths to /en before HTML loads", () => {
    expect(netlify).toContain('from = "https://tree.ribic.ba/people/*"');
    expect(netlify).toContain('to = "https://tree.ribic.ba/en/people/:splat"');
    expect(netlify).toContain('from = "https://tree.ribic.ba/tree"');
    expect(netlify).toContain('from = "https://tree.ribic.ba/poster.svg"');
  });

  it("routes Bosnian-domain /en paths back to canonical Bosnian paths", () => {
    expect(netlify).toContain('from = "https://stablo.ribic.ba/en/people/*"');
    expect(netlify).toContain('to = "https://stablo.ribic.ba/people/:splat"');
    expect(netlify).toContain('from = "https://stablo.ribic.ba/en/tree"');
  });

  it("does not rely on client-side domain redirects", () => {
    expect(layout).not.toContain("Keep each domain on its language");
    expect(layout).not.toContain('location.replace("/en"');
  });
});
