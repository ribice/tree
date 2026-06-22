import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeView = readFileSync("src/components/views/HomeView.astro", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");

describe("home page copy", () => {
  it("does not show contribution or implementation-process panels", () => {
    const obsoleteKeys = [
      "home.archive",
      "home.archiveTitle",
      "home.archiveBody",
      "home.f1.title",
      "home.f1.body",
      "home.f2.title",
      "home.f2.body",
      "home.f3.title",
      "home.f3.body",
    ];

    for (const key of obsoleteKeys) {
      expect(homeView).not.toContain(key);
    }

    expect(ui).not.toContain("Svako može doprinijeti");
    expect(ui).not.toContain("Jedan fajl po osobi");
    expect(ui).not.toContain("Uvijek usklađeno");
    expect(ui).not.toContain("A searchable family archive");
  });
});
