// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://jalenchen.me",
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  markdown: {
    // Code blocks stay monochrome (design.md §6, prose styles).
    syntaxHighlight: false,
  },
});
