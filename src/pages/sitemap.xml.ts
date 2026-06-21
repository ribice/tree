import type { APIRoute } from "astro";
import { getPeople } from "../lib/people";
import { localize } from "../i18n/ui";

const ORIGIN = { bs: "https://stablo.ribic.ba", en: "https://tree.ribic.ba" };

export const GET: APIRoute = async () => {
  const people = await getPeople();
  const basePaths = [
    "/",
    "/tree",
    "/people",
    "/about",
    ...people.map((p) => `/people/${p.id}`),
  ];

  const urls = basePaths
    .map((bp) => {
      const bsHref = ORIGIN.bs + localize(bp, "bs");
      const enHref = ORIGIN.en + localize(bp, "en");
      const alts = [
        `<xhtml:link rel="alternate" hreflang="bs" href="${bsHref}"/>`,
        `<xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>`,
        `<xhtml:link rel="alternate" hreflang="x-default" href="${bsHref}"/>`,
      ].join("");
      // One entry per language, each carrying the full alternate set.
      return [
        `<url><loc>${bsHref}</loc>${alts}</url>`,
        `<url><loc>${enHref}</loc>${alts}</url>`,
      ].join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
