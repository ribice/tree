import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Each person is one Markdown file in src/content/people/<id>.md
// The frontmatter below is validated at build time, so a malformed
// contribution fails CI instead of silently breaking the site.
const people = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/people" }),
  schema: z.object({
    // Display name, e.g. "Jane Smith"
    name: z.string(),
    // Optional maiden name, shown in profile and search
    maidenName: z.string().optional(),
    // Optional nickname
    nickname: z.string().optional(),
    // Year or full date of birth (string keeps "c. 1890" possible)
    born: z.string().optional(),
    // Year or full date of death; omit if living
    died: z.string().optional(),
    // Where they were born / lived
    birthplace: z.string().optional(),
    // List of parent ids (the file name without .md of each parent)
    parents: z.array(z.string()).default([]),
    // Spouse / partner relations. Either a plain id, or an object with optional
    // marriage and divorce years: { id: "hava", married: "1971", divorced: "1990" }
    spouses: z
      .array(
        z.union([
          z.string(),
          z.object({
            id: z.string(),
            married: z.string().optional(),
            divorced: z.string().optional(),
          }),
        ]),
      )
      .default([]),
    // Path to a photo under /public, e.g. "/photos/jane-smith.jpg"
    photo: z.string().optional(),
    // Short one-line descriptor shown under the name, e.g. "Carpenter, gardener"
    tagline: z.string().optional(),
  }),
});

// English translations, keyed by the same id as the person file. Holds the
// English bio (body) and an optional English tagline / name override. Adding a
// translation is optional — pages fall back to the Bosnian text if it is absent.
const translations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/translations" }),
  schema: z.object({
    name: z.string().optional(),
    tagline: z.string().optional(),
  }),
});

export const collections = { people, translations };
