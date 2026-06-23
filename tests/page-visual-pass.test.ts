import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const addView = readFileSync("src/components/views/AddPersonView.astro", "utf8");
const directoryView = readFileSync("src/components/views/DirectoryView.astro", "utf8");
const qualityView = readFileSync("src/components/views/DataQualityView.astro", "utf8");
const changelogView = readFileSync("src/components/views/ChangelogView.astro", "utf8");
const thanksView = readFileSync("src/components/views/ThanksView.astro", "utf8");
const componentsCss = readFileSync("src/styles/components.css", "utf8");
const formsCss = readFileSync("src/styles/forms.css", "utf8");

describe("page visual pass", () => {
  it("groups the add-person form into scannable visual sections", () => {
    expect(addView).toContain("add-form-shell");
    expect(addView).toContain("form-section");
    expect(addView).toContain("form-section-head");
    expect(addView).toContain("add-form-actions");
    expect(formsCss).toContain(".add-form-shell");
    expect(formsCss).toContain(".form-section");
    expect(formsCss).toContain(".form-section-head");
    expect(formsCss).toContain(".add-form-actions");
  });

  it("adds stronger count and section affordances to directory lists", () => {
    expect(directoryView).toContain("directory-summary-strip");
    expect(directoryView).toContain("directory-count-badge");
    expect(directoryView).toContain("letter-section-head");
    expect(componentsCss).toContain(".directory-summary-strip");
    expect(componentsCss).toContain(".directory-count-badge");
    expect(componentsCss).toContain(".letter-section-head");
  });

  it("surfaces page-level status on quality, changelog, and thanks pages", () => {
    expect(qualityView).toContain("quality-hero-meter");
    expect(changelogView).toContain("changelog-count");
    expect(thanksView).toContain("thanks-actions");
    expect(componentsCss).toContain(".quality-hero");
    expect(componentsCss).toContain(".quality-hero-meter");
    expect(componentsCss).toContain(".changelog-count");
    expect(componentsCss).toContain(".thanks-actions");
  });
});
