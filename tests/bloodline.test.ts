import { describe, expect, it } from "vitest";
import { bloodlineIds } from "../src/lib/family-membership";

const rec = (id: string, sex: "m" | "f", parents: string[] = []) => ({
  id,
  data: { sex, parents },
});

describe("bloodlineIds", () => {
  it("counts the male line and daughters, not spouses or married-in branches", () => {
    const people = [
      rec("enes-predak", "m"), // founder (seed)
      rec("son", "m", ["enes-predak"]), // son — in line
      rec("daughter", "f", ["enes-predak"]), // daughter — born into the name
      rec("wife", "f", []), // married-in spouse — excluded
      rec("grandson", "m", ["son", "wife"]), // father in line — in line
      rec("ilijaz", "m", []), // a separate Ribić branch that married in
      rec("ilijaz-kid", "m", ["ilijaz", "daughter"]), // father married-in — excluded
    ];
    const line = bloodlineIds(people);

    expect(line.has("enes-predak")).toBe(true);
    expect(line.has("son")).toBe(true);
    expect(line.has("daughter")).toBe(true);
    expect(line.has("grandson")).toBe(true);
    expect(line.has("wife")).toBe(false);
    expect(line.has("ilijaz")).toBe(false);
    expect(line.has("ilijaz-kid")).toBe(false);
    expect(line.size).toBe(4);
  });

  it("returns an empty set when the founder is absent", () => {
    expect(bloodlineIds([rec("someone", "m")]).size).toBe(0);
  });
});
