import rss from "@astrojs/rss";
import { getPosts } from "../lib/content";
import { site } from "../site.config";

export async function GET(context) {
  const posts = await getPosts(); // drafts are already filtered out in production
  return rss({
    title: `${site.name} — writing`,
    description: "Notes, guides and opinions by Jalen Chen.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
      categories: post.data.tags,
      content: post.rendered?.html,
    })),
  });
}
