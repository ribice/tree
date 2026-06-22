import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const statsView = readFileSync("src/components/views/StatsView.astro", "utf8");
const styles = readFileSync("src/styles/global.css", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");

describe("stats improvements", () => {
  it("shows data completeness and generation distribution", () => {
    expect(statsView).toContain("completenessCards");
    expect(statsView).toContain("generationRows");
    expect(statsView).toContain("decadeRows");
    expect(styles).toContain(".stats-insight-grid");
    expect(ui).toContain('"stats.completeness"');
    expect(ui).toContain('"stats.generationsChart"');
  });
});
