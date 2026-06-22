import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const globalCss = readFileSync("src/styles/global.css", "utf8");

describe("style structure", () => {
  it("keeps global.css as an import hub for focused style files", () => {
    const expectedFiles = [
      "src/styles/base.css",
      "src/styles/components.css",
      "src/styles/home.css",
      "src/styles/profile.css",
      "src/styles/tree.css",
      "src/styles/stats.css",
      "src/styles/forms.css",
    ];

    for (const file of expectedFiles) {
      expect(existsSync(file), file).toBe(true);
      expect(globalCss).toContain(file.replace("src/styles/", "./"));
    }

    expect(globalCss.split("\n").length).toBeLessThan(80);
  });
});
