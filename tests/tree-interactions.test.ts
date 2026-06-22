import { describe, expect, it } from "vitest";
import {
  isInteractiveTreeTarget,
  shouldSuppressTreeClick,
} from "../src/components/tree/tree-interactions";

const target = (matchesInteractive: boolean): Element =>
  ({
    closest: (selector: string) =>
      matchesInteractive && selector.includes("button") ? {} : null,
  }) as Element;

describe("tree interactions", () => {
  it("does not suppress clicks on tree controls because of a previous drag", () => {
    expect(isInteractiveTreeTarget(target(true))).toBe(true);
    expect(shouldSuppressTreeClick(12, target(true))).toBe(false);
  });

  it("still suppresses accidental node clicks after dragging the canvas", () => {
    expect(isInteractiveTreeTarget(target(false))).toBe(false);
    expect(shouldSuppressTreeClick(12, target(false))).toBe(true);
    expect(shouldSuppressTreeClick(2, target(false))).toBe(false);
  });
});
