import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeView = readFileSync("src/components/views/HomeView.astro", "utf8");
const layout = readFileSync("src/layouts/Layout.astro", "utf8");
const sitemap = readFileSync("src/pages/sitemap.xml.ts", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");

describe("about content on the home page", () => {
  it("removes the standalone about route from navigation and sitemap", () => {
    expect(existsSync("src/pages/about.astro")).toBe(false);
    expect(existsSync("src/pages/en/about.astro")).toBe(false);
    expect(layout).not.toContain('localize("/about", lang)');
    expect(sitemap).not.toContain('"/about/"');
  });

  it("shows the family story on the home page without implementation details", () => {
    expect(homeView).toContain("home.aboutTitle");
    expect(ui).toContain("Ovo je živi zapis o porodici Ribić");
    expect(ui).not.toContain("tekstualni fajl");
    expect(ui).not.toContain("one text file");
  });
});
