import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts: Record<string, string>;
};

describe("family data change workflow", () => {
  it("exposes a script that reports family-data changes and changelog reminders", () => {
    expect(existsSync("scripts/report-data-changes.mjs")).toBe(true);
    expect(pkg.scripts["data:changes"]).toBe("node scripts/report-data-changes.mjs");

    const script = readFileSync("scripts/report-data-changes.mjs", "utf8");
    expect(script).toContain("src/content/people");
    expect(script).toContain("src/lib/changelog.ts");
    expect(script).toContain("git diff");
  });
});
