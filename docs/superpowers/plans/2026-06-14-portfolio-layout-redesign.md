# Portfolio Layout Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio into a busy, multi-section landing layout rendered in the existing espresso+amber theme (serif headings, ST monogram), keeping both light/dark themes and staying mobile-friendly.

**Architecture:** Presentation-layer only. Add two shared CSS primitives to `global.css` (wide container, buttons, card, section rule). `BaseLayout` gains `wide`/`bleed` props so most chrome widens to ~1120px while article body text keeps a 720px reading column. The home page becomes a full-bleed hero + featured-work grid + about/latest-writing split. Content collections, Zod schemas, `getCollection`/`render`, and the theme-resolution logic (`theme.ts`, inline anti-flash script) are untouched.

**Tech Stack:** Astro 6, content collections, plain CSS custom properties (no framework). `astro:assets` `<Image>` for the portrait.

**Note on TDD:** This is a CSS/markup redesign — there is no behavioral unit to test, so per-task verification is `npx astro check` (0 errors/0 warnings; the `'z' is deprecated` *hints* are expected and ignored) plus a final visual pass. Do **not** invent brittle unit tests for styling. The existing `theme.ts` tests must stay green (`npm test`) because that logic does not change.

**Spec:** `docs/superpowers/specs/2026-06-14-portfolio-layout-redesign-design.md`

**Branch:** `redesign/portfolio-landing-layout` (already created off `master`; never commit to `master`).

---

## File map

- **Modify** `src/styles/global.css` — add layout primitives (Task 1).
- **Modify** `src/layouts/BaseLayout.astro` — `wide`/`bleed` props (Task 2).
- **Modify** `src/components/Nav.astro` — widen + translucent blur (Task 3).
- **Modify** `src/components/Footer.astro` — widen (Task 3).
- **Modify** `src/components/ProjectCard.astro` — thumbnail card + "Read more →" (Task 4).
- **Modify** `src/components/PostCard.astro` — card style for grid (Task 5).
- **Rewrite** `src/pages/index.astro` — home landing (Task 6).
- **Modify** `src/pages/writing/index.astro` — wide + card grid (Task 7).
- **Modify** `src/pages/projects/index.astro` — wide + grid (Task 8).
- **Modify** `src/pages/about.astro` — section rule, stays narrow (Task 9).
- **Modify** `src/layouts/PostLayout.astro` — section rule, stays narrow (Task 9).
- Final verification (Task 10).

---

## Task 1: Shared CSS primitives

**Files:**
- Modify: `src/styles/global.css` (append after existing rules)

- [ ] **Step 1: Append the primitives**

Add to the end of `src/styles/global.css`:

```css
/* ---- Layout primitives (redesign) ---- */
.container-wide { max-width: 1120px; margin: 0 auto; padding: 0 var(--space); }

main.bleed { padding: 0; }

.btn {
  display: inline-block;
  padding: 0.7rem 1.4rem;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 0.98rem;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
}
.btn:hover { text-decoration: none; }
.btn-primary { background: var(--accent); color: var(--bg); }
.btn-primary:hover { filter: brightness(1.06); }
.btn-ghost { background: transparent; color: var(--text); border-color: var(--border); }
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

.card {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  color: var(--text);
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.card:hover { transform: translateY(-3px); border-color: var(--accent); text-decoration: none; }

.section-rule { display: inline-block; width: 46px; height: 3px; background: var(--accent); border-radius: 2px; margin-bottom: 1.2rem; }
```

Rationale: `.btn-primary` uses `color: var(--bg)` so the text is dark-on-amber in dark theme and light-on-amber in light theme automatically — token-driven, both themes correct.

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: `0 errors, 0 warnings` (deprecation *hints* on `'z'` are expected, ignore them).

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "Add layout primitives: wide container, buttons, card, section rule

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: BaseLayout wide/bleed props

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add props and conditional container**

Replace the frontmatter `interface Props` / destructure block and the `<main>` block.

Change the frontmatter to:

```astro
interface Props {
  title: string;
  description?: string;
  wide?: boolean;
  bleed?: boolean;
}
const {
  title,
  description = 'Lead software engineer writing about how systems are built.',
  wide = false,
  bleed = false,
} = Astro.props;
```

Change the `<main>` block (currently lines 35-39) to:

```astro
    <main class:list={[{ bleed }]}>
      {bleed ? (
        <slot />
      ) : (
        <div class={wide ? 'container-wide' : 'container'}><slot /></div>
      )}
    </main>
```

Leave `<head>`, the inline theme script, `<Nav />`, and `<Footer />` exactly as they are.

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: `0 errors, 0 warnings` (ignore `'z'` hints).

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "BaseLayout: add wide and bleed container modes

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Widen nav + footer chrome

**Files:**
- Modify: `src/components/Nav.astro`
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Widen and reskin the nav**

In `src/components/Nav.astro`, change the wrapper class on line 11 from `container nav-inner` to `container-wide nav-inner`:

```astro
  <div class="container-wide nav-inner">
```

Then replace the `.site-nav` rule in the `<style>` block with a translucent, blurred version (token-driven so both themes work):

```css
  .site-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid var(--border);
    padding: 1rem 0;
    background: color-mix(in srgb, var(--bg) 85%, transparent);
    backdrop-filter: blur(8px);
  }
```

Leave the logo, links array, and other styles unchanged.

- [ ] **Step 2: Widen the footer**

In `src/components/Footer.astro`, change line 9 wrapper class from `container footer-inner` to `container-wide footer-inner`:

```astro
  <div class="container-wide footer-inner">
```

No other footer changes.

- [ ] **Step 3: Type-check**

Run: `npx astro check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro
git commit -m "Widen nav/footer to wide container; translucent blurred nav

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: ProjectCard — thumbnail card

**Files:**
- Modify: `src/components/ProjectCard.astro` (full replacement)

- [ ] **Step 1: Replace the component**

Replace the entire contents of `src/components/ProjectCard.astro` with:

```astro
---
interface Props {
  href: string;
  title: string;
  summary: string;
  tags: string[];
}
const { href, title, summary, tags } = Astro.props;
---
<a class="card project-card" href={href}>
  <div class="thumb" aria-hidden="true"></div>
  <div class="card-body">
    <h3>{title}</h3>
    <p class="summary">{summary}</p>
    <div class="tags">{tags.map((t) => <span class="chip">{t}</span>)}</div>
    <span class="more accent">Read more →</span>
  </div>
</a>

<style>
  .project-card { color: var(--text); }
  .thumb { height: 140px; position: relative; background: linear-gradient(135deg, var(--accent-soft), var(--code-bg)); }
  .thumb::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(300px 120px at 30% 10%, color-mix(in srgb, var(--accent) 18%, transparent), transparent);
  }
  .card-body { padding: 1.1rem 1.2rem 1.3rem; }
  .card-body h3 { margin: 0 0 0.4rem; font-size: 1.15rem; }
  .summary { margin: 0 0 0.9rem; color: var(--muted); font-size: 0.92rem; }
  .tags { margin-bottom: 0.8rem; }
  .more { font-size: 0.9rem; font-weight: 600; }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectCard.astro
git commit -m "ProjectCard: thumbnail card with Read more affordance

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: PostCard — card style for grid

**Files:**
- Modify: `src/components/PostCard.astro` (full replacement)

- [ ] **Step 1: Replace the component**

Replace the entire contents of `src/components/PostCard.astro` with:

```astro
---
interface Props {
  href: string;
  title: string;
  date: Date;
  summary: string;
  tags: string[];
}
const { href, title, date, summary, tags } = Astro.props;
const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
---
<a class="card post-card" href={href}>
  <div class="card-body">
    <p class="muted mono date">{dateStr}</p>
    <h3>{title}</h3>
    <p class="summary">{summary}</p>
    <div class="tags">{tags.map((t) => <span class="chip">{t}</span>)}</div>
    <span class="more accent">Read more →</span>
  </div>
</a>

<style>
  .post-card { color: var(--text); }
  .card-body { padding: 1.3rem 1.4rem 1.4rem; }
  .date { font-size: 0.78rem; margin: 0 0 0.5rem; }
  .post-card h3 { margin: 0 0 0.4rem; font-size: 1.2rem; }
  .summary { margin: 0 0 0.9rem; color: var(--muted); font-size: 0.92rem; }
  .tags { margin-bottom: 0.8rem; }
  .more { font-size: 0.9rem; font-weight: 600; }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 3: Commit**

```bash
git add src/components/PostCard.astro
git commit -m "PostCard: card style for grid listing

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Home landing page

**Files:**
- Rewrite: `src/pages/index.astro` (full replacement)

- [ ] **Step 1: Replace the page**

Replace the entire contents of `src/pages/index.astro` with:

```astro
---
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import portrait from '../assets/portrait.jpg';

const latestPosts = (await getCollection('writing', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 2);

const featured = (await getCollection('projects', ({ data }) => !data.draft && data.featured))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 2);

const fmt = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
---
<BaseLayout title="Steven Timothy — Lead Software Engineer" bleed>
  <section class="hero">
    <div class="container-wide hero-grid">
      <div class="hero-text">
        <h1>Lead Software Engineer<br />&amp; Future Architect</h1>
        <p class="role">Building reliable systems — and writing about how they're designed. <span class="mono accent">// systems &amp; architecture</span></p>
        <div class="cta">
          <a class="btn btn-primary" href="/projects">View my work</a>
          <a class="btn btn-ghost" href="mailto:steven.timothy265@gmail.com">Get in touch</a>
        </div>
        <div class="chips">
          <span class="chip">software architecture</span>
          <span class="chip">distributed systems</span>
          <span class="chip">platform</span>
        </div>
      </div>
      <div class="portrait-wrap">
        <div class="codebg" aria-hidden="true"><pre>export class Service {
  async handle(req) {
    const ctx = build(req);
    return pipeline(ctx);
  }
}
function pipeline(ctx) {
  for (const stage of stages)
    ctx = stage(ctx);
}</pre></div>
        <Image src={portrait} alt="Steven Timothy" width={360} height={450} loading="eager" class="portrait-img" />
      </div>
    </div>
  </section>

  {featured.length > 0 && (
    <section class="container-wide block">
      <span class="section-rule"></span>
      <h2>Featured work</h2>
      <p class="lead muted">A few projects that show how I think about systems.</p>
      <div class="grid">
        {featured.map((p) => (
          <ProjectCard href={`/projects/${p.id}`} title={p.data.title} summary={p.data.summary} tags={p.data.tags} />
        ))}
      </div>
    </section>
  )}

  <section class="container-wide block">
    <div class="split">
      <div>
        <span class="section-rule"></span>
        <h2>About</h2>
        <p class="muted">Lead software engineer focused on software architecture — how systems are shaped, why they're built the way they are, and how to keep them healthy as they grow.</p>
        <p><a class="accent" href="/about">More about me →</a></p>
      </div>
      {latestPosts.length > 0 && (
        <div>
          <span class="section-rule"></span>
          <h2>Latest writing</h2>
          {latestPosts.map((p) => (
            <a class="post-row" href={`/writing/${p.id}`}>
              <span class="date muted mono">{fmt(p.data.date)}</span>
              <span class="post-title">{p.data.title}</span>
            </a>
          ))}
          <p style="margin-top:1rem"><a class="accent" href="/writing">All writing →</a></p>
        </div>
      )}
    </div>
  </section>
</BaseLayout>

<style>
  .hero {
    border-bottom: 1px solid var(--border);
    background: radial-gradient(900px 380px at 78% 20%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%);
  }
  .hero-grid { display: grid; grid-template-columns: 1.05fr 0.85fr; gap: 3rem; align-items: center; padding: 4rem 0 3.5rem; }
  .hero-text h1 { font-size: clamp(2.2rem, 5vw, 3.4rem); margin: 0 0 1rem; }
  .role { font-size: 1.15rem; color: var(--muted); margin: 0 0 2rem; }
  .cta { display: flex; gap: 0.9rem; flex-wrap: wrap; }
  .chips { margin-top: 1.6rem; }

  .portrait-wrap { position: relative; }
  .codebg {
    position: absolute;
    inset: -14px;
    border-radius: 18px;
    background: var(--code-bg);
    border: 1px solid var(--border);
    overflow: hidden;
  }
  .codebg pre {
    margin: 0;
    padding: 1rem;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    line-height: 1.5;
    color: var(--muted);
    opacity: 0.5;
  }
  .portrait-img {
    position: relative;
    display: block;
    width: 100%;
    max-width: 360px;
    height: auto;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    object-position: 50% 14%;
    border-radius: 14px;
    border: 2px solid var(--accent);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
    margin-left: auto;
  }

  .block { padding: 3.5rem 0; }
  .block h2 { font-size: 1.9rem; margin: 0 0 0.35rem; }
  .lead { margin: 0 0 1.8rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.4rem; }

  .split { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
  .post-row { display: flex; flex-direction: column; padding: 0.8rem 0; border-bottom: 1px solid var(--border); color: var(--text); }
  .post-row:hover { text-decoration: none; }
  .post-row:hover .post-title { color: var(--accent); }
  .post-row .date { font-size: 0.75rem; }
  .post-title { font-family: var(--font-display); font-size: 1.1rem; }

  @media (max-width: 860px) {
    .hero-grid, .split { grid-template-columns: 1fr; }
    .portrait-wrap { order: -1; }
    .codebg { inset: -8px; }
    .portrait-img { margin: 0 auto; }
  }
</style>
```

Note: the About blurb summarizes facts already on the real About page (no invented claims). `featured` renders the grid; the grid `auto-fill` left-aligns gracefully whether there are 1 or 2 cards.

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 3: Build to confirm the page renders and assets resolve**

Run: `npm run build`
Expected: build succeeds; no error about `portrait.jpg` or `<Image>`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "Rebuild home as multi-section landing (hero, featured, about/writing)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Writing index — wide card grid

**Files:**
- Modify: `src/pages/writing/index.astro` (full replacement)

- [ ] **Step 1: Replace the page**

Replace the entire contents of `src/pages/writing/index.astro` with:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';

const posts = (await getCollection('writing', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<BaseLayout title="Writing — Steven Timothy" wide>
  <span class="section-rule"></span>
  <h1>Writing</h1>
  <p class="muted">Notes on software architecture, engineering standards, and ideas worth exploring.</p>
  {posts.length === 0 ? (
    <p class="muted">First posts are on the way.</p>
  ) : (
    <div class="grid">
      {posts.map((p) => (
        <PostCard href={`/writing/${p.id}`} title={p.data.title} date={p.data.date} summary={p.data.summary} tags={p.data.tags} />
      ))}
    </div>
  )}
</BaseLayout>

<style>
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.4rem; margin-top: 1.5rem; }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/writing/index.astro
git commit -m "Writing index: wide container + card grid

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Projects index — wide grid

**Files:**
- Modify: `src/pages/projects/index.astro`

- [ ] **Step 1: Add the `wide` prop, section rule, and update grid**

Replace the `<BaseLayout ...>` open tag (line 9) so it opens with `wide` and a section rule, and update the `.grid` minmax. The full replacement for the page body + style:

```astro
<BaseLayout title="Projects — Steven Timothy" wide>
  <span class="section-rule"></span>
  <h1>Projects</h1>
  <p class="muted">Systems I've designed and things I've built.</p>
  {projects.length === 0 ? (
    <p class="muted">Selected work is being written up — check back soon.</p>
  ) : (
    <div class="grid">
      {projects.map((p) => (
        <ProjectCard href={`/projects/${p.id}`} title={p.data.title} summary={p.data.summary} tags={p.data.tags} />
      ))}
    </div>
  )}
</BaseLayout>

<style>
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.4rem; margin-top: 1.5rem; }
</style>
```

Leave the frontmatter (imports + `projects` query) unchanged.

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/index.astro
git commit -m "Projects index: wide container + section rule

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 9: About + PostLayout section rules (narrow stays narrow)

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/layouts/PostLayout.astro`

- [ ] **Step 1: Add a section rule to About**

In `src/pages/about.astro`, insert a section rule immediately after the `<BaseLayout ...>` open tag and before `<h1>About</h1>` (line 5 area):

```astro
<BaseLayout title="About — Steven Timothy">
  <span class="section-rule"></span>
  <h1>About</h1>
```

Do **not** add `wide` — About body text stays in the narrow reading container. Leave all body copy unchanged.

- [ ] **Step 2: Add a section rule to PostLayout**

In `src/layouts/PostLayout.astro`, insert a section rule as the first child of `<article class="prose">`, before `<h1>{title}</h1>` (line 14 area):

```astro
  <article class="prose">
    <span class="section-rule"></span>
    <h1>{title}</h1>
```

Do **not** add `wide` — article reading column stays 720px. Leave date/tags/slot and styles unchanged.

- [ ] **Step 3: Type-check**

Run: `npx astro check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro src/layouts/PostLayout.astro
git commit -m "Add section rule to About and article header (reading width unchanged)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 10: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Unit tests stay green**

Run: `npm test`
Expected: PASS (the unchanged `theme.ts` tests).

- [ ] **Step 2: Type-check the whole project**

Run: `npx astro check`
Expected: `0 errors, 0 warnings` (the `'z' is deprecated` *hints* are expected and not actionable).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Visual pass in preview**

Run: `npm run preview`
Then in a browser check, in BOTH light and dark (toggle in nav), at desktop width AND a ~375px mobile width:
- Home: hero two-column on desktop → portrait stacks above text on mobile; CTAs work ("View my work" → /projects, "Get in touch" → mailto); featured grid; about/writing split stacks on mobile.
- Writing: card grid, collapses to one column on mobile.
- Projects: card grid with thumbnails.
- About: narrow readable column, section rule present.
- One writing post and one project page: 720px reading column preserved; nav/footer span wide.
- Confirm no horizontal scrollbar at 375px and the sticky nav stays usable.

- [ ] **Step 5: Confirm draft filtering and empty-section behavior**

Verify featured/writing home sections self-hide when their queries return nothing (e.g. temporarily flip `featured: true` to `false` in `src/content/projects/this-website.md`, rebuild, confirm the Featured section disappears, then revert). Drafts must never appear.

- [ ] **Step 6: Final summary commit (only if any verification fix was needed)**

If steps 1–5 required a fix, commit it:

```bash
git add -A
git commit -m "Fix issues found during final verification

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

If nothing needed fixing, skip this step.

---

## Self-review notes

- **Spec coverage:** layout system (Task 1, 2) · home centerpiece (Task 6) · writing/projects index (Task 7, 8) · about (Task 9) · post layout narrow column (Task 2 default + Task 9) · nav/footer/components reskin (Task 3, 4, 5) · mobile (Task 6 media query + Task 10 step 4) · both themes via tokens (all tasks) · contact mailto (Task 6) · dropped progress bars (Task 4 uses tags only) · testing/verification (Task 10). All spec sections mapped.
- **Type consistency:** `ProjectCard` props (`href,title,summary,tags`) and `PostCard` props (`href,title,date,summary,tags`) match their call sites in Tasks 6/7/8. `BaseLayout` `wide`/`bleed` booleans match usage. `.container-wide`, `.btn*`, `.card`, `.section-rule` defined in Task 1 before first use.
- **No placeholders:** every code step contains complete content.
```
