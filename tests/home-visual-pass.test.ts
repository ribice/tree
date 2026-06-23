import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeView = readFileSync("src/components/views/HomeView.astro", "utf8");
const styles = readFileSync("src/styles/home.css", "utf8");

describe("home page visual pass", () => {
  it("uses a dedicated homepage hero grid and stat strip", () => {
    expect(homeView).toContain("home-hero-grid");
    expect(homeView).toContain("home-hero-main");
    expect(homeView).toContain("home-stat-strip");
    expect(homeView).toContain("home-stat-card");

    expect(styles).toContain(".home-hero-grid");
    expect(styles).toContain(".home-hero-main");
    expect(styles).toContain(".home-stat-strip");
    expect(styles).toContain(".home-stat-card");
  });

  it("gives the lower people lists a richer home-specific treatment", () => {
    expect(homeView).toContain("home-featured-people");
    expect(homeView).toContain("home-person-section");
    expect(homeView).toContain("home-person-section-head");
    expect(homeView).toContain("home-person-card");

    expect(styles).toContain(".home-featured-people");
    expect(styles).toContain(".home-person-section");
    expect(styles).toContain(".home-person-section-head");
    expect(styles).toContain(".home-person-card");
  });
});
