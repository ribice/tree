import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { OGImageRoute } from "astro-og-canvas";

// Read person frontmatter synchronously (no top-level await, which Astro's
// route validation rejects). Runs in Node at build time.
const DIR = "src/content/people";
const pages = Object.fromEntries(
  readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data } = matter(readFileSync(join(DIR, f), "utf8"));
      const id = f.replace(/\.md$/, "");
      const { born, died, tagline, name } = data;
      const span = born && died ? `${born} – ${died}` : born ? `r. ${born}` : died ? `u. ${died}` : "";
      const description = [span, tagline].filter(Boolean).join(" · ");
      return [`${id}.png`, { title: name, description }];
    }),
);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [
      [15, 29, 58],
      [30, 58, 115],
    ],
    border: { color: [79, 107, 208], width: 12, side: "inline-start" },
    padding: 80,
    // Vendored DejaVu Sans — full Bosnian coverage (č, š, ž, đ) in one file per
    // weight, so no build-time network dependency or glyph-fallback gaps.
    fonts: [
      "./assets/fonts/DejaVuSans-Bold.ttf",
      "./assets/fonts/DejaVuSans.ttf",
    ],
    font: {
      title: { families: ["DejaVu Sans"], weight: "Bold" },
      description: { families: ["DejaVu Sans"] },
    },
  }),
});
