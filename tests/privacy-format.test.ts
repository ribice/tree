import { describe, expect, it } from "vitest";
import {
  isLikelyLivingDateSpan,
  publicDate,
  publicLifespan,
  publicLifespanFor,
} from "../src/lib/privacy";

describe("public date formatting", () => {
  it("shows only birth years for living people", () => {
    expect(publicDate("15.11.1991", true)).toBe("1991");
    expect(publicLifespan({ born: "15.11.1991" }, true, "bs")).toBe("r. 1991");
    expect(publicLifespan({ born: "10.12.2018" }, true, "en")).toBe("b. 2018");
  });

  it("keeps full dates for historical records", () => {
    expect(publicDate("20.12.1900", false)).toBe("20.12.1900");
    expect(publicLifespan({ born: "20.12.1900", died: "05.06.1986" }, false, "bs")).toBe(
      "20.12.1900 – 05.06.1986",
    );
  });

  it("does not treat old records without a death date as living", () => {
    expect(isLikelyLivingDateSpan({ born: "1775" }, 2026)).toBe(false);
    expect(isLikelyLivingDateSpan({ born: "1930" }, 2026)).toBe(true);
    expect(isLikelyLivingDateSpan({ born: "1930", died: "2010" }, 2026)).toBe(false);
  });
});

describe("publicLifespanFor", () => {
  it("keeps only the birth year for a living person", () => {
    expect(publicLifespanFor({ born: "12.03.1990" }, "bs")).toBe("r. 1990");
  });

  it("keeps full dates for someone who has died", () => {
    expect(publicLifespanFor({ born: "12.03.1900", died: "01.02.1980" }, "en")).toBe(
      "12.03.1900 – 01.02.1980",
    );
  });
});

describe("birth values without a readable year", () => {
  it("are treated as possibly living and never published", () => {
    expect(isLikelyLivingDateSpan({ born: "15.11" })).toBe(true);
    expect(publicDate("15.11", true)).toBe("");
  });
});
