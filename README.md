# jalenchen.me

Personal site for Jalen Chen, built with [Astro](https://astro.build). The look is specified in [`design.md`](./design.md) (Option C: graph + grid).

## Run it locally

Needs Node 22.23 or newer.

```sh
npm install       # also creates package-lock.json; commit it
npm run dev       # http://localhost:4321, drafts visible
npm run build     # production build into dist/, drafts left out
npm run preview   # serve dist/ locally
```

## Before launch (TODO)

Everything below is hidden on the site until it's filled in, so nothing half-finished shows.

- [ ] `src/site.config.ts`: `email`, `linkedin`, `lookingFor`
- [ ] Resume: put `resume.pdf` in `public/` and set `resume: "/resume.pdf"`
- [ ] Photo: add `src/assets/photo.jpg` (grayscale, 4:5, head and shoulders)
- [ ] ubg Studio: add game names and player numbers to `src/content/projects/ubg-studio.md`
- [ ] Read, edit and publish the two draft posts (or delete them)

## Writing a post

Add a Markdown file to `src/content/posts/`. The file name becomes the URL (`my-post.md` → `/writing/my-post/`).

```md
---
title: My post
description: One line that shows under the title.
date: 2026-12-01
tags: [guide, hooke]
draft: true
---

Write here. Use `## Headings`; they become the "On this page" list.
```

- `draft: true` posts show up in `npm run dev` only. They are never built, listed or added to RSS. Set `draft: false` to publish.
- The homepage Writing section and the "writing" nav link appear once **2** posts are published (`MIN_POSTS` in `src/lib/content.ts`).
- Tags are lowercase; each one gets a page at `/tags/<tag>/`.
- Charts in posts: wrap them in `<figure>` and they sit on graph paper automatically. See the Hooke draft for an SVG example using the `chart` classes.

## Projects and the graph

Each file in `src/content/projects/` is a node on the hero graph, and (unless `card: false`) a card in the Work section.

- `node: { x, y, label }` places it on the graph (viewBox is 640 × 480; the center "JC" node is at 300, 250).
- `tags` are the small grey nodes hanging off a project.
- `links` draw dashed edges between projects.
- **Give a project its own page** by writing a body under its frontmatter. Its card and graph node then link to `/projects/<id>/`. Without a body, the node jumps to the card.

## Deploying (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.

One-time setup in the GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**, and keep **Enforce HTTPS** on. `public/CNAME` keeps the `jalenchen.me` domain attached on every deploy.
