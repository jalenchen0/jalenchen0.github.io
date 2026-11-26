import { getCollection, type CollectionEntry } from "astro:content";

/** The Writing section and nav link appear once this many posts are published. */
export const MIN_POSTS = 2;

export type Post = CollectionEntry<"posts">;
export type Project = CollectionEntry<"projects">;

/** Published posts, newest first. Drafts appear only in `astro dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects");
  return projects.sort((a, b) => a.data.order - b.data.order);
}

/** A project gets its own page once its Markdown file has a body. */
export function hasPage(project: Project): boolean {
  return Boolean(project.body && project.body.trim().length > 0);
}

/** Where a project's graph node and card should point, if anywhere. */
export function projectHref(project: Project): string | undefined {
  if (hasPage(project)) return `/projects/${project.id}/`;
  if (project.data.card) return `/#project-${project.id}`;
  return undefined;
}

export function tagSlug(tag: string): string {
  return tag.toLowerCase().trim().replace(/\s+/g, "-");
}

export function formatDate(date: Date, style: "month" | "day" = "day"): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return style === "month" ? `${y}.${m}` : `${y}.${m}.${d}`;
}
