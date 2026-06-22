import { describe, expect, it } from "vitest";
import type { Person, Translation } from "../src/lib/people";
import {
  absoluteUrl,
  alternateLinks,
  canonicalUrl,
  jsonLdScript,
  personDescription,
  personJsonLd,
} from "../src/lib/seo";

const person = {
  id: "avdikadija",
  data: {
    name: "Avdo Ribic -- Avdikadija",
    nickname: "Avdikadija",
    maidenName: "Ribic",
    sex: "m",
    born: "1775",
    died: "1852",
    birthplace: "Jezero",
    parents: ["omer"],
    spouses: [],
    tagline: "Jezerski kadija i procelnik porodice",
  },
} as unknown as Person;

const translation = {
  id: "avdikadija",
  data: {
    tagline: "Kadi of Jezero and the family forefather",
  },
} as unknown as Translation;

describe("seo helpers", () => {
  it("builds canonical and absolute URLs for the language domains", () => {
    expect(canonicalUrl("/people/avdikadija/", "bs")).toBe(
      "https://stablo.ribic.ba/people/avdikadija/",
    );
    expect(canonicalUrl("/people/avdikadija/", "en")).toBe(
      "https://tree.ribic.ba/en/people/avdikadija/",
    );
    expect(absoluteUrl("/og/avdikadija.png", "en")).toBe(
      "https://tree.ribic.ba/og/avdikadija.png",
    );
  });

  it("returns complete hreflang alternates for a localized path", () => {
    expect(alternateLinks("/en/people/avdikadija/")).toEqual([
      {
        hreflang: "bs",
        href: "https://stablo.ribic.ba/people/avdikadija/",
      },
      {
        hreflang: "en",
        href: "https://tree.ribic.ba/en/people/avdikadija/",
      },
      {
        hreflang: "x-default",
        href: "https://stablo.ribic.ba/people/avdikadija/",
      },
    ]);
  });

  it("creates concise localized person descriptions", () => {
    const translations = new Map([[translation.id, translation]]);

    expect(personDescription(person, translations, "bs")).toBe(
      "Avdo Ribic -- Avdikadija (1775 - 1852), Jezero. Jezerski kadija i procelnik porodice.",
    );
    expect(personDescription(person, translations, "en")).toBe(
      "Avdo Ribic -- Avdikadija (1775 - 1852), Jezero. Kadi of Jezero and the family forefather.",
    );
  });

  it("serializes JSON-LD safely for inline script tags", () => {
    const script = jsonLdScript({ "@context": "https://schema.org", name: "<Avdo>" });
    expect(script).toContain("\\u003cAvdo>");
    expect(script).not.toContain("<Avdo>");
  });

  it("builds person JSON-LD with family relations and dates", () => {
    const translations = new Map([[translation.id, translation]]);
    const jsonLd = personJsonLd({
      person,
      people: [person],
      translations,
      locale: "en",
      url: "https://tree.ribic.ba/en/people/avdikadija/",
    });

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Avdo Ribic -- Avdikadija",
      alternateName: ["Avdikadija", "Ribic"],
      gender: "Male",
      birthDate: "1775",
      deathDate: "1852",
      mainEntityOfPage: "https://tree.ribic.ba/en/people/avdikadija/",
      birthPlace: { "@type": "Place", name: "Jezero" },
      description:
        "Avdo Ribic -- Avdikadija (1775 - 1852), Jezero. Kadi of Jezero and the family forefather.",
      url: "https://tree.ribic.ba/en/people/avdikadija/",
    });
  });
});
