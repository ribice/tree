import { describe, expect, it } from "vitest";
import { isRibicFamilyMember } from "../src/lib/family-membership";

const person = (data: { name: string; maidenName?: string }) => ({ data });

describe("Ribic family membership", () => {
  it("counts people born into the Ribic-Kific line", () => {
    expect(isRibicFamilyMember(person({ name: "Emina Musić", maidenName: "Ribić" }))).toBe(true);
    expect(isRibicFamilyMember(person({ name: "Emir Ribić" }))).toBe(true);
    expect(isRibicFamilyMember(person({ name: "Avdo Ribić — Kifin" }))).toBe(true);
  });

  it("does not count married-in spouses as Ribic-Kific family members", () => {
    expect(isRibicFamilyMember(person({ name: "Amir Musić" }))).toBe(false);
    expect(isRibicFamilyMember(person({ name: "Nejra Čerenić" }))).toBe(false);
  });
});
