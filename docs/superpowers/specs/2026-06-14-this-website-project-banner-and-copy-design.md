# Design: "This website" project revamp — project banners + copy

**Date:** 2026-06-14
**Status:** Approved
**Source:** `scratchpad/this-website-voice-and-intent.md`

## Goal

Revamp the "This website" project on the portfolio: introduce per-project banner
artwork (on the projects listing card and the open project page), and rewrite the
project's copy in Steven's voice with the hiring-manager framing left implicit.

## Motivation

- Project cards have an empty gradient placeholder where a banner could communicate
  what the project is at a glance.
- The open project page has no banner; the visitor loses the visual cue they clicked.
- The current copy explicitly states the site exists to impress hiring managers; that
  intent should be implicit, not spelled out.

## Design

### 1. Banner model

A banner is **per-project artwork** so each banner can do its subject justice (brand
colors, a photo, a logo on a gradient) rather than being forced into the site palette.

- Add two optional fields to the `projects` collection schema in `src/content.config.ts`:
  - `image: z.string().optional()` — path to banner artwork (e.g. `/banners/astro.svg`).
  - `imageAlt: z.string().optional()` — alt text for the banner.
- Rendering:
  - When `image` is present, render it with `object-fit: cover` to fill the banner area.
  - When `image` is absent, fall back to today's themed espresso/amber gradient
    (the existing `.thumb` background). This keeps projects without art cohesive with
    the site by default.
- **No separate light/dark banner variants.** Supplied artwork is intentionally fixed
  across themes; only the gradient fallback follows the theme (it already uses tokens).

### 2. Where the banner appears

- **Projects listing card** (`src/components/ProjectCard.astro`):
  - The existing `.thumb` div becomes the banner surface.
  - Add `image?` and `imageAlt?` to `Props`. When `image` is set, render
    `<img src={image} alt={imageAlt ?? ''} />` filling the thumb; otherwise keep the
    current gradient + radial overlay.
  - `src/pages/projects/index.astro` passes `image`/`imageAlt` from each project's data.
- **Open project page — contained banner ("Option C")**:
  - A rounded banner inside the content column, above the title, mirroring the listing
    card for visual continuity.
  - Implemented by adding optional `image?` / `imageAlt?` props to
    `src/layouts/PostLayout.astro`. The banner block renders only when `image` is set.
  - `src/pages/projects/[...slug].astro` passes `project.data.image` / `imageAlt` to
    `PostLayout`. Writing posts (`src/pages/writing/[...slug].astro`) do not pass these,
    so blog posts are unaffected.

### 3. Astro banner asset

- Ship `public/banners/astro.svg`: the official Astro logo mark on Astro's signature
  dark-purple → violet gradient, authored at a banner aspect ratio so `object-fit: cover`
  fills cleanly.
- `src/content/projects/this-website.md` frontmatter gains:
  - `image: /banners/astro.svg`
  - `imageAlt: Astro logo`

### 4. Copy rewrites for `this-website.md`

**The problem**
> I didn't have a place that showed the work I've done — or where I stand on what makes
> code clean and well-architected. The times I tried, hand-building a polished portfolio
> from scratch cost more time than it was worth, and the moment I wanted to add something
> new, getting it to look right was enough friction that the site just fell out of date.

**What I built**
> A static site built with [Astro](https://astro.build), designed to stay current with
> almost no effort. Writing and projects are plain Markdown files validated by
> content-collection schemas, so publishing is just adding a file — new content inherits
> the site's styling automatically, which is what keeps it from going stale. A warm
> light/dark theme, applied before first paint and remembered across visits, rounds out
> the reading experience.

**Architecture notes** (adds the theming bullet)
> - **Content as data:** `getCollection` queries typed Markdown; drafts are filtered at
>   build time.
> - **Theming:** light/dark via CSS custom properties keyed off a `data-theme` attribute —
>   resolved before first paint and persisted to `localStorage`, with an OS-preference
>   fallback on first visit.
> - **No backend:** everything is static, served by GitHub Pages behind a custom domain.
> - **CI/CD:** GitHub Actions builds and deploys on every push to `master`.

## Out of scope (YAGNI)

- Full-bleed photo "cover" hero on the detail page (we chose the contained Option C).
- Banners on writing posts.
- Per-theme banner image variants.
- Underlay/overlay text-on-banner treatment (rejected for legibility + image-agnosticism).

## Verification

- `npx astro check` — 0 errors / 0 warnings (deprecation hints from Astro's Zod re-export
  are expected and ignored).
- `npm run build` succeeds.
- Manual: projects listing shows the Astro banner on the "This website" card; other
  projects (if any) show the gradient fallback. Open project page shows the contained
  banner above the title in both light and dark themes; banner is legible in both.
- Banner artwork is unaffected by theme toggling; gradient fallback recolors with theme.
