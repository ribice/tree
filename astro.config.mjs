// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import rehypeLinkPeople from "./plugins/rehype-link-people.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://stablo.ribic.ba",
  integrations: [react()],
  markdown: {
    rehypePlugins: [rehypeLinkPeople],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
