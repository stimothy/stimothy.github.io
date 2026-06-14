# Portfolio Rebuild — Design

**Date:** 2026-06-13
**Status:** Approved
**Branch:** `portfolio-rebuild`

## Summary

Scrap the existing static HTML/CSS/JS site and rebuild Steven Timothy's personal
portfolio as a modern Astro static site deployed to GitHub Pages. The site serves
two reinforcing audiences: a hiring manager who should come away impressed, and a
casual visitor who should find it genuinely useful to learn from. Positioning is
oriented around Steven's identity as a **lead software engineer with a software
architecture focus**.

## Goals

- A credible, polished presence that impresses someone considering hiring Steven
  for a lead/architect role.
- A genuinely useful resource (writing/notes) that helps others grow.
- Low-friction authoring so writing more is realistic (author in Markdown, not HTML).
- First-class light/dark theme toggle (hard requirement — dark is Steven's
  preference, light is his wife's).
- Designed to look intentional and complete even while content is sparse, then
  grow gracefully as projects and posts are added.

## Non-Goals (YAGNI)

- No backend (GitHub Pages is static-only).
- No comments, analytics, search, tag-filtering pages, or newsletter at launch.
  All are deferrable and easy to add later.
- No CMS — content lives in the repo as Markdown.

## Audience & Voice

- **Primary:** hiring managers / recruiters evaluating for senior/lead/staff/architect roles.
- **Secondary:** peers and learners reading the writing.
- **Voice:** clear thinking over polished prose. Steven self-identifies as not a
  strong writer; the writing format favors short, focused notes (standards,
  explorations, opinions) over long essays. For an architecture audience, clarity
  reads as quality.

## Technical Architecture

- **Framework:** [Astro](https://astro.build) — static site generator.
- **Content:** Astro **content collections** for `writing/` and `projects/`.
  Authoring a post = adding a Markdown file with frontmatter (title, date,
  summary, tags). No hand-written HTML.
- **Styling:** scoped component CSS with CSS custom properties (design tokens) so
  the light/dark themes are a single source of truth. No CSS framework required.
- **Deploy:** GitHub Actions builds the Astro site and publishes to GitHub Pages
  on every push to `master`. The `www.steventimothy.com` custom domain is
  preserved via the `CNAME` file (carried into the built output).
- **Migration:** the existing `index.html`, `about/`, `css/`, `js/`, and unused
  `source/` assets are removed as part of the rebuild. Profile imagery may be
  carried over if reused.

## Visual Design

Chosen direction: **A+C blend, warm palette** ("espresso + amber").

- **Typography:** serif display headlines (warmth, personality) + sans-serif body
  + monospace accents (engineer credibility).
- **Dark theme:** espresso background, warm off-white text, amber accent.
- **Light theme:** cream/paper background, dark warm text, amber accent — same
  family, not a separate look.
- **Hero:** serif name, role line with a monospace `// systems & architecture`
  accent, a latest-writing teaser, and tag chips.
- **Feel:** inviting and easy on the eyes; reader-first.

## Theming Behavior

- Light + dark toggle control in the nav.
- Selection persisted to `localStorage`.
- First visit follows the OS `prefers-color-scheme`.
- No flash of incorrect theme on load (inline pre-paint script sets the theme
  before first render).

## Information Architecture

Four sections plus a global footer.

### Home
Hero (as designed) + latest-writing teaser + a couple of featured projects +
footer links. Must look intentional when content is sparse.

### Writing
- Index: list of posts (title, date, summary, tags), newest first.
- Post page: clean reading typography, styled code blocks and headings.

### Projects
- Index: card grid. Graceful empty/sparse state (does not look unfinished).
- Detail page: problem, what was built, architecture notes/diagrams, links.

### About
The fuller story: lead engineer, architecture interests, professional background,
what Steven cares about as an engineer. More personal than the home page.

### Footer (global)
GitHub, LinkedIn, email, and an optional résumé PDF link.

## Content Seeding Plan

"What to showcase" is the historical blocker, so launch with seeded content so the
site feels alive on day one:

- **First project = this website** (built with Astro) — meta proof that Steven ships.
- **2–3 starter writing pieces** drawn from Steven's interests, e.g.:
  - "Engineering standards I believe in"
  - one architecture concept he wants to explore further
  - "What software architecture means to me"
  Outlines drafted collaboratively; Steven fills in his voice.
- **About** seeded from his real background (lead software engineer; MS Computer
  Science, University of Utah; BS Computer Science, Utah State University),
  modernized from the old site's text.

## Success Criteria

- Site builds and deploys to `www.steventimothy.com` via GitHub Actions.
- Light/dark toggle works, persists, respects OS default, no flash.
- A new post can be published by adding a single Markdown file.
- All four sections render and look intentional with the seeded content.
- Lighthouse: fast, accessible (the bar for a static portfolio).

## Open Questions

None blocking. Résumé PDF and exact starter-post topics to be finalized during
implementation with Steven's input.
