import { describe, expect, it } from "vitest";
import { foldSearchText } from "../src/lib/search";

describe("foldSearchText", () => {
  it("matches names typed without Bosnian diacritics", () => {
    expect(foldSearchText("Ribić")).toBe(foldSearchText("ribic"));
    expect(foldSearchText("Šemso Žunić")).toBe(foldSearchText("semso zunic"));
  });

  it("treats đ, d and dj as the same letter", () => {
    expect(foldSearchText("Đorđe")).toBe(foldSearchText("Dorde"));
    expect(foldSearchText("Đorđe")).toBe(foldSearchText("Djordje"));
  });
});
