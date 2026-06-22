import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const addView = readFileSync("src/components/views/AddPersonView.astro", "utf8");
const ui = readFileSync("src/i18n/ui.ts", "utf8");

describe("Netlify add-person form", () => {
  it("posts a static Netlify form to localized success pages", () => {
    expect(addView).toContain('data-netlify="true"');
    expect(addView).toContain('netlify-honeypot="bot-field"');
    expect(addView).toContain('name="form-name" value="add-person"');
    expect(addView).toContain('localize("/thanks", lang)');
    expect(addView).not.toContain("?ok=1");

    expect(existsSync("src/pages/thanks.astro")).toBe(true);
    expect(existsSync("src/pages/en/thanks.astro")).toBe(true);
  });

  it("has localized success-page copy", () => {
    expect(ui).toContain('"add.successTitle"');
    expect(ui).toContain('"add.successBody"');
  });
});
