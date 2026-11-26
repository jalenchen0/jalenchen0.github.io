import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    description: z.string(),
    status: z.enum(["building", "planned", "live"]),
    // Show a card in the Work section. The site itself is a graph node but not a card.
    card: z.boolean().default(true),
    // Position on the hero graph, in viewBox units (640 × 480).
    node: z.object({
      x: z.number(),
      y: z.number(),
      label: z.enum(["right", "left", "below-right"]).default("right"),
    }),
    // Small grey nodes hanging off this project on the graph.
    tags: z
      .array(
        z.object({
          name: z.string(),
          x: z.number(),
          y: z.number(),
          labelX: z.number(),
          labelY: z.number(),
          anchor: z.enum(["start", "end"]).default("start"),
        }),
      )
      .default([]),
    // Dashed project-to-project edges (a real dependency between projects).
    links: z
      .array(
        z.object({
          to: z.string(),
          label: z.string().optional(),
          labelX: z.number().optional(),
          labelY: z.number().optional(),
        }),
      )
      .default([]),
    // The "→ …" line at the bottom of the card.
    connections: z.array(z.string()).default([]),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    // Drafts are visible in `npm run dev` only. They are never built, listed or put in RSS.
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, posts };
