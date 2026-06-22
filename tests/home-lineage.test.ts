import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeView = readFileSync("src/components/views/HomeView.astro", "utf8");
const styles = readFileSync("src/styles/global.css", "utf8");

describe("home lineage timeline", () => {
  it("uses Avdikadija's named ancestor line", () => {
    expect(homeView).toContain("lineageIds");
    expect(homeView).toContain('"enes-predak"');
    expect(homeView).toContain('"omer"');
    expect(homeView).toContain('"avdikadija"');
    expect(homeView).toContain('"akif"');
  });

  it("has a dedicated visual treatment for the lineage section", () => {
    expect(homeView).toContain("lineage-panel");
    expect(styles).toContain(".lineage-panel");
    expect(styles).toContain(".lineage-card");
  });
});
