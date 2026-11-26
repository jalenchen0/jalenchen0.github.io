# jalenchen.me — Design spec (Option C: Graph + grid)

Personal portfolio for Jalen Chen. Black and white, technical, "graphy." The site works like a figure in an engineering notebook: a graph of the projects drawn on graph paper, with the grid showing up in a few places instead of everywhere.

Reference mockups: Option C (light) and Option C (dark) on the design canvas.

---

## 1. Principles

1. **Only black, white and gray.** No accent color, no gradients, no glass effects, no emoji.
2. **The grid is decoration, used sparingly.** It appears in four places: behind the hero graph, in the corner of each work card, behind figures inside posts, and at the bottom of the footer. It always fades out, and it never sits at full strength behind body text.
3. **The graph is the signature.** The hero diagram is built from the real projects and the real connections between them. Every node on the graph has a matching card below it.
4. **Motion is one idea.** Things blur into focus once, when they appear. Nothing loops. All motion turns off when the visitor's device asks for reduced motion.
5. **Content beats chrome.** Cut a decorative detail before you cut a project description.

---

## 2. Color tokens

```css
:root {
  --ink: #0a0a0a;            /* text, borders, filled nodes */
  --paper: #ffffff;          /* background */
  --paper-rgb: 255,255,255;  /* for translucent paper-colored effects (hover smear) */
  --muted: #555555;          /* secondary text, captions (7.4:1 on paper) */
  --divider: rgba(0,0,0,.15);/* quiet hairlines (footer rule) */
  --grid-rgb: 0,0,0;         /* grid line color, alpha set separately */
  --grid-alpha: .075;        /* see §5 */
}

@media (prefers-color-scheme: dark) {
  :root {
    --ink: #ffffff;
    --paper: #0a0a0a;
    --paper-rgb: 10,10,10;
    --muted: #a3a3a3;        /* 8.1:1 on #0a0a0a */
    --divider: rgba(255,255,255,.15);
    --grid-rgb: 255,255,255;
    --grid-alpha: .055;      /* white lines read stronger on black: start one step lighter */
  }
}
```

Rules:
- Dark mode swaps ink and paper exactly. Every component uses tokens, never hard-coded hex values.
- Lower-emphasis text uses opacity on `--ink`, not a new color: card descriptions 0.75, node coordinate labels 0.66.
- Hover states invert: an `--ink` background with `--paper` text.

---

## 3. Typography

Fonts: **Geist** for text and **Geist Mono** for labels and metadata (Google Fonts, or the `geist` npm package).

| Role | Font | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|
| Hero name | Geist | 104px (56px under 760px) | 600 | 0.95 | -0.045em |
| Contact email | Geist | 72px (36px under 760px) | 600 | 1.05 | -0.04em |
| Card title | Geist | 40px (36px under 760px) | 600 | 1.1 | -0.03em |
| Section heading (h2) | Geist | 32px | 600 | 1.1 | -0.02em |
| About paragraph | Geist | 28px | 400 | 1.4 | -0.015em |
| Hero intro | Geist | 20px | 400 | 1.5 | 0 |
| Body / card description | Geist | 16px | 400 | 1.5 | 0 |
| Header name | Geist | 15px | 600 | — | 0 |
| Nav, buttons, card links | Geist Mono | 13px | 400 | — | 0 |
| Contact links | Geist Mono | 14px | 400 | — | 0 |
| Captions, footer | Geist Mono | 12px | 400 | — | 0 |
| Figure / node labels | Geist Mono | 11px | 400 | — | 0.06em, UPPERCASE |

- Mono text is lowercase everywhere except the small uppercase figure and node labels.
- Keep intro and description lines under about 70 characters (`max-width: 440px` on the intro, `420px` on card descriptions).

---

## 4. Layout

- Container: `max-width: 1200px; margin: 0 auto; padding-inline: 40px` (20px under 760px).
- Layout grid: 12 columns, `column-gap: 24px`. Under 760px every column spans the full width.
- Vertical rhythm: sections are spaced 72px above and 96px below. The header has 20px vertical padding.
- Homepage sections, in order: **Header → Hero → Work → Writing → About → Contact (footer)**.

| Section | Desktop layout |
|---|---|
| Hero | Text in columns 1–5, graph figure in columns 6–12, vertically centered, `row-gap: 48px` |
| Work | Heading row + ruler, then a 2-column card grid with `gap: 16px` |
| Writing | Heading row (with `rss ↗` and `all posts →`) + ruler, then the 3 latest posts as rows |
| About | h2 and photo in columns 1–3, paragraph in columns 5–12 |
| Footer | Full-width band with the grid layer; content in the container |

Under 760px the hero stacks as name → intro → buttons → graph, the cards become one column, post rows stack (date, title, tags), and the photo sits above the About paragraph.

---

## 5. The grid system (decorative)

One reusable layer, `GridLayer`, absolutely positioned (`inset: 0; pointer-events: none`) inside its parent, which has `position: relative` (and `overflow: hidden` for cards). Content sits above it with `position: relative`.

```css
.grid {
  --gc: rgba(var(--grid-rgb), var(--grid-alpha));
  background-image:
    linear-gradient(var(--gc) 1px, transparent 1px),
    linear-gradient(90deg, var(--gc) 1px, transparent 1px),
    linear-gradient(var(--gc) 1px, transparent 1px),
    linear-gradient(90deg, var(--gc) 1px, transparent 1px);
  background-size: 24px 24px, 24px 24px, 120px 120px, 120px 120px;
}
```

- **Minor cells are 24px and major cells are 120px.** Major lines look heavier because both layers draw there.
- **Strength:** light `.045`, medium `.075` (default), heavy `.12`. In dark mode use `.055` as the default.
- **Where it appears, and its fade mask:**

| Placement | Mask |
|---|---|
| Hero (full-bleed, centered on the graph) | `radial-gradient(ellipse 55% 75% at 72% 50%, #000 35%, transparent 78%)` |
| Work card (bottom-right corner) | `linear-gradient(135deg, transparent 30%, #000 85%)` |
| Footer (rises from the bottom) | `linear-gradient(to top, #000 10%, transparent 90%)` |
| Post figure (inside its 1px ink frame) | none: full grid, so the chart reads like graph paper |

  Include `-webkit-mask-image` with the same value for Safari.
- **Card hover:** grid lines switch to the paper color at `alpha × 2.2` so they show on the inverted card.

### Ruler divider

Replaces plain section rules above Work and About.

```css
.ruler {
  height: 8px;
  border-bottom: 1px solid var(--ink);
  background-image:
    linear-gradient(90deg, var(--ink) 1px, transparent 1px),
    linear-gradient(90deg, var(--ink) 1px, transparent 1px);
  background-size: 24px 4px, 120px 8px;   /* short tick every 24px, tall tick every 120px */
  background-repeat: repeat-x;
  background-position: 0 100%, 0 100%;
}
```

The tick spacing matches the grid on purpose.

---

## 6. Components

### Header
- Left: a filled 12px circle followed by "Jalen Chen" (15px, 600). Links to `#top`.
- Right: mono nav (`work`, `writing`, `about`, `contact`, 28px gap) and a **primary button** "resume ↗". On a post page, `writing` is underlined to show the current section.
- Wraps onto two lines on narrow screens. It is not sticky.

### Buttons
- **Primary:** `--ink` background, `--paper` text, Geist Mono 13px, `min-height: 44px`, `padding: 0 18px`, square corners.
- **Secondary:** 1px `--ink` border, `--paper` background, same type and size.
- Hero buttons: primary "see the work →" and secondary "github ↗".

### Project graph (hero figure)
Inline SVG, `viewBox="0 0 640 480"`, `width: 100%`, with `role="img"` and an `aria-label` that names every project.

- **Center node:** a circle at (300,250) with r=30, filled `--ink`, and "JC" in `--paper`, 14px mono.
- **Project nodes:** circles with r=7, `--paper` fill and a 1.5px `--ink` stroke. Labels are 15px mono in `--ink`.
- **Tag nodes:** circles with r=3, filled `--ink`. Labels are 12px mono in `--muted`.
- **Edges:** 1.2px `--ink` lines.
  - center → project: solid
  - project → tag: solid at 45% opacity
  - project ↔ project (a real dependency): dashed `4 4`, with a 12px muted label
- **Label halos:** every label gets `stroke: var(--paper); stroke-width: 5 (4 for tags); paint-order: stroke` so it stays readable over the grid.
- **Frame:** 20px padding, "+" crop marks at the four corners (Geist Mono 14px), a top row with `FIG. 02` on the left and `5 projects / 10 edges` on the right, and a caption below: "What I'm building, and how the pieces connect."
- **Generate the graph from data** (§8). The edge count in the frame label is computed, not typed.

Current node positions in viewBox units:

| Node | x, y | Label side |
|---|---|---|
| JC (center) | 300, 250 | — |
| Hooke | 500, 120 | right |
| openGym fork | 500, 340 | right |
| ubg Studio | 120, 130 | left |
| Whiteboard | 130, 370 | left |
| jalenchen.me | 320, 430 | right, below |
| tag: computer vision → Hooke | 600, 60 | above, left |
| tag: roblox / luau → ubg Studio | 130, 40 | right |
| tag: realtime / auth → Whiteboard | 60, 450 | right |
| edge label "integrates" (Hooke ↔ openGym) | 510, 234 | — |
| edge label "gym.jalenchen.me" (site ↔ openGym) | 436, 404 | — |

### Work card
- A full-card `<a>`: 1px `--ink` border, `padding: 28px`, `min-height: 280px`, a flex column with `gap: 14px`, `GridLayer` in the bottom-right corner.
- **Top row:** a small node glyph on the left (56×16 SVG: filled dot, line, hollow dot; the line is dashed for openGym), and the node label on the right (`NODE 01 · X500 Y120`, 11px mono uppercase, 0.66 opacity), using that project's graph coordinates.
- **Title:** 40px. **Description:** 16px at 0.75 opacity. **Connections line** pinned to the bottom (`margin-top: auto`): `→ openGym fork · computer vision` in 13px mono.
- **Hover/focus:** the card inverts (ink background, paper text, glyph strokes and fills in paper, grid in paper). The title slides `translateX(8px)` and gets a motion-smear text shadow (§7).

### Writing list (homepage)
- Heading row: h2 "Writing" on the left; `rss ↗` and `all posts →` in 13px mono on the right.
- Ruler, then the **3 latest posts** as full-row links: `grid-template-columns: 96px minmax(0,1fr) auto`, `padding: 24px 0`, `--divider` hairline under each.
  - Column 1: date as `YYYY.MM`, 13px mono, muted.
  - Column 2: title (24px, 600, -0.02em) with a one-line description under it (16px, 0.75 opacity).
  - Column 3: tag chips.
- **Tag chip:** 12px mono, `padding: 4px 10px`, 1px `--ink` border, square corners, lowercase, hyphenated (`computer-vision`). Chips link to `/tags/<tag>`.
- **Hover:** no inversion, just the title smear in `--ink` (`translateX(8px)`, ink-colored text shadow at 18% / 8%). The list stays calm compared to the work cards.
- **Only show this section once there are at least 2 published posts.** Until then, leave it out entirely. Don't show an empty state.

### About + photo
- Left column (1–3): h2 "About", then the photo figure 32px below.
- Right column (5–12): the paragraph at 28px, then a muted mono line for what you're looking for.

### Photo
- **One photo**, head and shoulders, plain background, **4:5**, `max-width: 240px`, square corners.
- **Treatment:** grayscale and slightly higher contrast. Do it once when you export the file, not with CSS filters, so it looks the same everywhere. A halftone or dither texture is optional; if used, keep the dots fine (about 4–5px) so the face stays recognizable.
- **The photo is not inverted in dark mode.** A photo stays a photo. It sits on the dark background unchanged.
- **Frame:** "+" crop marks at the top two corners, and a caption below in 11px uppercase mono: `FIG. 03 — JALEN CHEN`.
- Real `alt` text, for example "Jalen Chen".
- Never put it in the hero. The graph is the hero image.

### Post page
- **Header:** same as the homepage.
- **Title block** (container width):
  - `← writing` back link (13px mono, 44px tall).
  - Meta row: full date `YYYY.MM.DD` in muted mono, then tag chips.
  - Title: 64px (36px under 760px), 600, -0.04em, line height 1.02, `max-width: 900px`.
  - Description: 20px, muted, `max-width: 680px`.
  - Ruler.
- **Body:** 12-column grid.
  - Columns 1–3: "ON THIS PAGE" (11px uppercase mono, muted) and a numbered list of the post's h2s (`01 Hooke's law`), 13px mono. It is not sticky. Hide it on posts with fewer than two h2s.
  - Columns 4–10 (about 640px, roughly 70 characters a line): the article.
- **Prose styles:**
  - Paragraphs: 18px, line height 1.7, 24px apart.
  - h2: 26px, 600, -0.02em, 48px above, 16px below.
  - Links underlined with a 3px offset.
  - Inline code: Geist Mono 16px, no background.
  - Code blocks: Geist Mono 14px, line height 1.6, 1px `--ink` border, `padding: 16px 20px`, horizontal scroll, no syntax colors (or a monochrome theme).
  - Figures: 1px `--ink` frame, 20px padding, full grid behind (§5), and a caption in 12px muted mono starting with `FIG. n —`. Charts follow the graph's rules: 1.2px lines, mono labels with paper halos, solid for measured data, dashed for models.
- **After the article:** previous/next boxes in two columns (1px border, 24px padding, a 12px mono label over a 20px title). They invert on hover like the work cards.
- **Footer:** a shorter version of the homepage footer, with `subscribe via rss ↗`, github and email links, and the grid fading up from the bottom.
- **Motion:** only the meta row, title and description blur in. The article body never animates.

### Footer / contact
- Full-bleed band with a 1px `--ink` top border and `GridLayer` fading up from the bottom.
- The email address is the largest element (72px), led by a 64×16 "edge" glyph (a line ending in a filled dot).
- Mono links: `github ↗`, `linkedin ↗`, `resume.pdf ↗`, each at least 44px tall.
- Bottom bar: `© 2026 Jalen Chen` on the left and `jalenchen.me` on the right, in 12px muted mono, above a `--divider` hairline.

---

## 7. Motion

All motion lives in CSS. The global level is set by a class on `<html>`: `motion-subtle` (default) or `motion-strong` (for testing only).

```css
.motion-subtle { --b: 6px;  --t: -24px; }
.motion-strong { --b: 18px; --t: -90px; }

.blur-in { animation: blur-in .75s cubic-bezier(.2,.7,.2,1) both; }
@keyframes blur-in {
  from { opacity: 0; filter: blur(var(--b)); transform: translateX(var(--t)); }
  to   { opacity: 1; filter: blur(0);        transform: none; }
}

.edge-draw { stroke-dasharray: 1; stroke-dashoffset: 1;   /* with pathLength="1" on the <line> */
             animation: draw 1s cubic-bezier(.6,0,.2,1) forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }

@media (prefers-reduced-motion: reduce) {
  .blur-in, .edge-draw { animation: none; stroke-dashoffset: 0; }
}
```

Sequence when the page loads:

| Element | Effect | Delay |
|---|---|---|
| Hero name | blur-in | 0s |
| Hero intro | blur-in | 0.15s |
| Hero buttons | blur-in | 0.25s |
| Graph center node | blur-in | 0.2s |
| Center → project edges | draw | 0.35s, then +0.1s each |
| Project nodes | blur-in | 0.6s |
| Project labels | blur-in | 0.8s |
| Tag edges | draw | 0.95–1.05s |
| Dashed edges + tag labels | blur-in | 1.1–1.15s |
| Work cards | blur-in | 0.3s, then +0.08s each (start when scrolled into view) |

Hover smear on card titles (0.35s):
```css
transform: translateX(8px);
text-shadow: -10px 0 6px rgba(var(--paper-rgb), .35), -22px 0 12px rgba(var(--paper-rgb), .15);
```

Never blur body text after it has appeared. Never loop an animation.

---

## 8. Content and data

One source of truth drives both the graph and the cards (for example, an Astro content collection `src/content/projects/*.md`):

```yaml
id: hooke
order: 1
title: Hooke
description: Measures resistance-band load from how far the band stretches, using computer vision.
node: { x: 500, y: 120 }
tags: [computer vision]
links:
  - { to: opengym, label: integrates }
status: building   # building | planned | live
url: /projects/hooke
```

Current projects:

| # | Project | Description | Connections |
|---|---|---|---|
| 01 | Hooke | Measures resistance-band load from how far the band stretches, using computer vision. | openGym fork, computer vision |
| 02 | openGym fork | A self-hosted gym tracker with Bodylastics band support, automatic progressive overload, and Hooke built in. | Hooke, gym.jalenchen.me |
| 03 | ubg Studio | Founder and lead developer of a Roblox game studio, since 2025. | roblox, luau |
| 04 | Whiteboard | A collaborative whiteboard: invite codes grant read access, and the owner can promote people to write. | realtime, google sign-in |

Hero intro: "Computer science at Stony Brook University. Founder of ubg Studio, a Roblox game studio. Everything I build connects to something else I'm building."

About: "I'm a computer science student at Stony Brook and the founder of ubg Studio, where I design and ship Roblox games. Lately I'm building tools for strength training: measuring band tension, tracking progression."

### Posts

Markdown files in `src/content/posts/*.md`:

```yaml
title: Measuring band tension from stretch
description: Why a resistance band's label isn't enough, and how Hooke turns stretch into weight.
date: 2026-11-25
tags: [hooke, physics, computer-vision]
draft: false        # drafts are never built, listed, or put in the RSS feed
```

- **Tags** are free-form but lowercase and hyphenated. Good starting set: `guide`, `opinion`, `notes`, plus one tag per project (`hooke`, `opengym`, `ubg`). Each tag gets a page at `/tags/<tag>` listing its posts.
- **Routes:** `/writing` (all posts, newest first, the same row style as the homepage list), `/writing/<slug>`, `/tags/<tag>`, `/rss.xml`.
- **RSS** includes the full text of every non-draft post. Link it from the Writing heading, the post footer, and with `<link rel="alternate" type="application/rss+xml">` in `<head>`.
- **Drafts never leak.** Filter `draft: true` out of every list, tag page, the sitemap, and RSS, and don't build their pages at all. (The old Hugo site published a "private" test post this way.)
- The mockup's three post titles are samples. Replace them with real posts before the Writing section goes live.

**Placeholders to fill before launch:** email, LinkedIn URL, resume PDF, photo, the "what you're looking for" line, and ubg Studio game names and player numbers.

---

## 9. Accessibility

- **Contrast:** ink on paper is 19:1. Muted text passes 4.5:1 in both modes. Opacity-reduced text stays at or above 0.62.
- **Focus:** every link and button gets `outline: 2px solid var(--ink); outline-offset: 3px` on `:focus-visible`. Cards show their hover inversion on focus too.
- **Touch targets:** at least 44px for nav, buttons and contact links.
- **Graph:** `role="img"` with a descriptive `aria-label`. The cards below carry the same information as text, so nothing is available only in the diagram.
- **Decoration:** grid layers, rulers, crop marks and glyphs are `aria-hidden="true"`.
- **Photo and post figures:** the photo has real `alt` text. Every chart has `role="img"` and an `aria-label` that states what it shows.
- **Posts:** one h1 per page, h2s in order, and table-of-contents links that point to the h2 ids.
- **Motion:** fully disabled under `prefers-reduced-motion: reduce`.

---

## 10. Implementation notes (Astro)

```
src/
  components/  Header.astro  Hero.astro  ProjectGraph.astro  WorkCard.astro
               PostRow.astro  TagChip.astro  Photo.astro  Toc.astro
               GridLayer.astro  Ruler.astro  Footer.astro
  content/projects/*.md
  content/posts/*.md
  layouts/PostLayout.astro
  styles/tokens.css   (§2, §5, §7)  styles/prose.css
  pages/index.astro
  pages/projects/[id].astro
  pages/writing/index.astro   pages/writing/[slug].astro
  pages/tags/[tag].astro
  pages/rss.xml.js            (@astrojs/rss)
  assets/photo.jpg            (pre-processed grayscale; served through astro:assets)
public/CNAME                  (contains: jalenchen.me)
```

- Ship zero client JavaScript for the homepage. Everything here is CSS and static SVG. The one exception is an optional `IntersectionObserver` that adds `.blur-in` to work cards when they scroll into view.
- Load fonts with `font-display: swap`.
- Build and deploy with the official Astro GitHub Pages GitHub Actions workflow, from a single repo. Keep `public/CNAME` so the custom domain survives every deploy.

---

## 11. Don'ts

- No accent colors, gradients, shadows on cards, rounded corners, or emoji.
- Don't use a full-page grid. If it's everywhere, it stops being a detail.
- Don't put the grid behind paragraphs at full strength.
- Don't use a decorative font. Geist and Geist Mono only.
- Don't make up stats or testimonials. Leave a placeholder until the real number exists.
