# "This website" Project Banner + Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional per-project banner artwork to the projects listing card and the open project page, ship an Astro-branded banner for the "This website" project, and rewrite that project's copy.

**Architecture:** Two optional frontmatter fields (`image`, `imageAlt`) flow from the `projects` content collection into `ProjectCard.astro` (listing) and `PostLayout.astro` (detail, via `projects/[...slug].astro`). When `image` is set the banner renders the artwork with `object-fit: cover`; when absent it falls back to the existing themed gradient. Writing posts never pass these props, so they are unaffected.

**Tech Stack:** Astro 6, TypeScript, content collections (Zod via `astro:schema`), Vitest, scoped component CSS with design tokens.

**Testing note:** All changes here are presentational/content. There is no unit-testable logic, so each task's verification gate is `npx astro check` (expect 0 errors / 0 warnings; `'z' is deprecated` *hints* are an Astro framework artifact and expected) plus `npm run build`. `npm test` is run once at the end as a regression gate.

---

### Task 1: Add `image` / `imageAlt` to the projects schema

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Add the optional fields**

In `src/content.config.ts`, inside the `projects` collection's `schema: z.object({ ... })`, add two fields next to `link`:

```ts
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    repo: z.url().optional(),
    link: z.url().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: 0 errors, 0 warnings (deprecation *hints* are fine).

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "Add optional image/imageAlt fields to projects schema"
```

---

### Task 2: Create the Astro banner asset

**Files:**
- Create: `public/banners/astro.svg`

- [ ] **Step 1: Write the banner SVG**

Create `public/banners/astro.svg` with this exact content (Astro logo mark in white on Astro's dark-purple → violet gradient, with wordmark; 800×320 banner aspect ratio so `object-fit: cover` fills cleanly):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" role="img" aria-label="Astro">
  <defs>
    <linearGradient id="astroBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1b1129"/>
      <stop offset="55%" stop-color="#3a2150"/>
      <stop offset="100%" stop-color="#6d3bd1"/>
    </linearGradient>
  </defs>
  <rect width="800" height="320" fill="url(#astroBg)"/>
  <g transform="translate(225,85) scale(0.41)">
    <path d="M182.022 9.147c2.982 3.702 4.502 8.697 7.543 18.687l66.435 218.32a276.385 276.385 0 0 0-79.426-26.81L132.66 70.78a5.534 5.534 0 0 0-10.628.043L79.91 219.295a276.412 276.412 0 0 0-79.748 26.851L66.943 27.804c3.043-9.972 4.565-14.958 7.547-18.657a24.585 24.585 0 0 1 9.94-7.348C88.832 0 94.049 0 104.481 0h47.04c10.445 0 15.667 0 20.064 1.798a24.585 24.585 0 0 1 9.937 7.349Z" fill="#ffffff"/>
    <path d="M189.043 256.679c-10.952 9.364-32.812 15.751-57.992 15.751-30.904 0-56.807-9.621-63.68-22.56-2.458 7.415-3.009 15.903-3.009 21.324 0 0-1.619 26.623 16.898 45.14 0-9.615 7.795-17.41 17.41-17.41 16.48 0 16.46 14.378 16.446 26.043l-.001 1.041c0 17.705 10.819 32.883 26.21 39.255a35.659 35.659 0 0 1-3.588-15.647c0-16.879 9.908-23.163 21.425-30.468 9.167-5.814 19.353-12.274 26.372-25.232a47.762 47.762 0 0 0 5.769-22.823c0-5.96-1.09-11.664-3.08-16.928a35.713 35.713 0 0 1-2.18 9.241Z" fill="#ffffff"/>
  </g>
  <text x="350" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="80" font-weight="700" fill="#ffffff">Astro</text>
</svg>
```

- [ ] **Step 2: Sanity-check the file is valid SVG**

Run: `head -1 public/banners/astro.svg`
Expected: the opening `<svg ...>` tag prints (no shell error).

- [ ] **Step 3: Commit**

```bash
git add public/banners/astro.svg
git commit -m "Add Astro-branded banner asset"
```

---

### Task 3: Update `this-website.md` frontmatter + copy

**Files:**
- Modify: `src/content/projects/this-website.md`

- [ ] **Step 1: Add the banner fields to frontmatter**

In `src/content/projects/this-website.md`, add `image` and `imageAlt` to the frontmatter (after `link`):

```yaml
repo: https://github.com/stimothy/stimothy.github.io
link: https://www.steventimothy.com
image: /banners/astro.svg
imageAlt: Astro logo
```

- [ ] **Step 2: Rewrite "The problem"**

Replace the entire `## The problem` section body with:

```md
## The problem

I didn't have a place that showed the work I've done — or where I stand on what makes
code clean and well-architected. The times I tried, hand-building a polished portfolio
from scratch cost more time than it was worth, and the moment I wanted to add something
new, getting it to look right was enough friction that the site just fell out of date.
```

- [ ] **Step 3: Rewrite "What I built"**

Replace the entire `## What I built` section body with:

```md
## What I built

A static site built with [Astro](https://astro.build), designed to stay current with
almost no effort. Writing and projects are plain Markdown files validated by
content-collection schemas, so publishing is just adding a file — new content inherits
the site's styling automatically, which is what keeps it from going stale. A warm
light/dark theme, applied before first paint and remembered across visits, rounds out
the reading experience.
```

- [ ] **Step 4: Rewrite "Architecture notes"**

Replace the entire `## Architecture notes` section body with:

```md
## Architecture notes

- **Content as data:** `getCollection` queries typed Markdown; drafts are filtered
  at build time.
- **Theming:** light/dark via CSS custom properties keyed off a `data-theme` attribute —
  resolved before first paint and persisted to `localStorage`, with an OS-preference
  fallback on first visit.
- **No backend:** everything is static and served by GitHub Pages behind a custom
  domain.
- **CI/CD:** GitHub Actions builds and deploys on every push to `master`.
```

- [ ] **Step 5: Type-check**

Run: `npx astro check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 6: Commit**

```bash
git add src/content/projects/this-website.md
git commit -m "Rewrite This website copy and add Astro banner"
```

---

### Task 4: Render the banner on the projects listing card

**Files:**
- Modify: `src/components/ProjectCard.astro`
- Modify: `src/pages/projects/index.astro`

- [ ] **Step 1: Add props and banner markup to `ProjectCard.astro`**

Replace the component frontmatter and the `<a>` opening through the `.thumb` div. New frontmatter:

```astro
---
interface Props {
  href: string;
  title: string;
  summary: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
}
const { href, title, summary, tags, image, imageAlt } = Astro.props;
---
```

New markup for the card opening (replace the `<div class="thumb" aria-hidden="true"></div>` line):

```astro
<a class="card project-card" href={href}>
  <div class={image ? 'thumb has-img' : 'thumb'}>
    {image && <img class="thumb-img" src={image} alt={imageAlt ?? ''} loading="lazy" />}
  </div>
```

- [ ] **Step 2: Add the image CSS to `ProjectCard.astro`**

In the component's `<style>` block, add these rules after the existing `.thumb::after { ... }` rule:

```css
  .thumb.has-img::after { content: none; }
  .thumb-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
```

- [ ] **Step 3: Pass the fields from the listing page**

In `src/pages/projects/index.astro`, update the `<ProjectCard ... />` call inside the `.map` to forward the new fields:

```astro
<ProjectCard href={`/projects/${p.id}`} title={p.data.title} summary={p.data.summary} tags={p.data.tags} image={p.data.image} imageAlt={p.data.imageAlt} />
```

- [ ] **Step 4: Build and type-check**

Run: `npx astro check && npm run build`
Expected: type-check clean; build completes with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectCard.astro src/pages/projects/index.astro
git commit -m "Render banner artwork on project cards with gradient fallback"
```

---

### Task 5: Render the contained banner on the open project page

**Files:**
- Modify: `src/layouts/PostLayout.astro`
- Modify: `src/pages/projects/[...slug].astro`

- [ ] **Step 1: Add optional props to `PostLayout.astro`**

Update the `Props` interface and destructuring:

```astro
interface Props {
  title: string;
  date: Date;
  summary: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
}
const { title, date, summary, tags, image, imageAlt } = Astro.props;
```

- [ ] **Step 2: Add the banner markup**

In `PostLayout.astro`, inside `<article class="prose">`, insert the banner immediately after the `<span class="section-rule"></span>` line and before `<h1>{title}</h1>`:

```astro
    <span class="section-rule"></span>
    {image && <img class="banner" src={image} alt={imageAlt ?? ''} />}
    <h1>{title}</h1>
```

- [ ] **Step 3: Add the banner CSS**

In `PostLayout.astro`'s `<style>` block, add:

```css
  .banner { display: block; width: 100%; height: 200px; object-fit: cover; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 1.4rem; }
```

- [ ] **Step 4: Pass the fields from the project detail page**

In `src/pages/projects/[...slug].astro`, update the `<PostLayout ...>` opening tag to forward the fields:

```astro
<PostLayout title={project.data.title} date={project.data.date} summary={project.data.summary} tags={project.data.tags} image={project.data.image} imageAlt={project.data.imageAlt}>
```

- [ ] **Step 5: Build and type-check**

Run: `npx astro check && npm run build`
Expected: type-check clean; build completes with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/PostLayout.astro src/pages/projects/[...slug].astro
git commit -m "Add contained banner to open project page"
```

---

### Task 6: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Regression + type + build gates**

Run: `npm test && npx astro check && npm run build`
Expected: tests pass (theme tests), 0 type errors, build succeeds.

- [ ] **Step 2: Manual visual check**

Run: `npm run preview` and open the served URL.
- Projects listing: the "This website" card shows the Astro banner (purple gradient + logo). Any project without an `image` shows the espresso/amber gradient fallback.
- Open the "This website" project: a contained, rounded Astro banner sits above the title; title/date/tags/body are fully legible.
- Toggle light/dark: the Astro banner artwork stays fixed (intentional); the gradient fallback recolors with the theme. Banner is legible in both themes.
- Open a writing post: confirm no banner appears (writing posts pass no `image`).

- [ ] **Step 3: Done**

No commit needed if everything passes. If a tweak was required, commit it with a descriptive message.

---

## Self-Review

- **Spec coverage:** Schema fields (Task 1) ✓; Astro asset (Task 2) ✓; this-website frontmatter + 3 copy rewrites (Task 3) ✓; ProjectCard banner + listing wiring with gradient fallback (Task 4) ✓; PostLayout contained "Option C" banner + detail wiring, writing posts unaffected (Task 5) ✓; verification incl. both themes (Task 6) ✓. Out-of-scope items (cover hero, writing banners, per-theme variants, overlay text) are correctly not implemented.
- **Placeholder scan:** No TBD/TODO; all code shown in full.
- **Type consistency:** Field names `image` / `imageAlt` used identically in schema, `this-website.md`, `ProjectCard` Props, `PostLayout` Props, and both `[...slug]`/`index` call sites. CSS class names `thumb` / `has-img` / `thumb-img` / `banner` consistent between markup and styles.
