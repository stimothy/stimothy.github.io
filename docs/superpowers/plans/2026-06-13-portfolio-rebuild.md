# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy static HTML site with a modern Astro portfolio (Home, Writing, Projects, About) featuring a warm light/dark theme toggle, Markdown-authored content, and GitHub Pages deployment.

**Architecture:** Astro 5 static site. Content lives in Markdown files validated by content-collection schemas. Theming uses CSS custom properties keyed off a `data-theme` attribute, set pre-paint by an inline script and toggled client-side with `localStorage` persistence + OS-preference fallback. A single pure function (`resolveTheme`) holds the only real logic and is unit-tested with Vitest; everything else is verified via `astro check` + `astro build`. GitHub Actions builds and deploys to GitHub Pages on push to `master`, keeping the `www.steventimothy.com` custom domain via a `CNAME` in `public/`.

**Tech Stack:** Astro 5, TypeScript, Vitest, CSS custom properties, GitHub Actions, GitHub Pages.

---

## File Structure

Created/owned by this plan (legacy files in the repo root are deleted in Task 1):

```
astro.config.mjs              # site config (domain, integrations)
package.json                  # scripts + deps
tsconfig.json                 # strict TS config (from Astro template)
vitest.config.ts             # test runner config
.gitignore                    # add node_modules, dist, .astro
public/
  CNAME                       # www.steventimothy.com (carried into dist root)
  favicon.svg
src/
  content.config.ts          # writing + projects collection schemas
  lib/
    theme.ts                 # resolveTheme() pure logic (unit-tested)
    theme.test.ts            # Vitest tests for resolveTheme
  styles/
    global.css               # design tokens + base element styles (both themes)
  components/
    ThemeToggle.astro        # nav toggle button + client script
    Nav.astro                # site navigation (includes ThemeToggle)
    Footer.astro             # GitHub / LinkedIn / email / resume links
    PostCard.astro           # writing list item
    ProjectCard.astro        # projects grid card
  layouts/
    BaseLayout.astro         # <head>, pre-paint theme script, Nav, Footer, slot
    PostLayout.astro         # article wrapper for writing/project detail pages
  pages/
    index.astro              # Home (hero + latest writing + featured projects)
    about.astro              # About
    writing/
      index.astro            # Writing list
      [...slug].astro        # individual post
    projects/
      index.astro            # Projects grid (graceful empty state)
      [...slug].astro        # individual project
  content/
    writing/                 # seeded Markdown posts
    projects/                # seeded Markdown projects
.github/workflows/deploy.yml # build + deploy to GitHub Pages
```

---

## Task 1: Scaffold Astro and remove the legacy site

**Files:**
- Delete: `index.html`, `about/`, `css/`, `js/`, `source/`, `.idea/`
- Create: Astro project files (`package.json`, `astro.config.mjs`, `tsconfig.json`, `src/`, `public/`)
- Create: `public/CNAME`
- Modify: `.gitignore`

- [ ] **Step 1: Confirm you are on the work branch**

Run: `git branch --show-current`
Expected: `portfolio-rebuild` (if not, `git checkout portfolio-rebuild`)

- [ ] **Step 2: Remove legacy site files**

```bash
git rm -r index.html about css js source 2>/dev/null
rm -rf .idea
```

Note: keep `CNAME`, `docs/`, `.serena/`, `.gitignore`, and `.git/`. We re-add CNAME under `public/` in Step 5.

- [ ] **Step 3: Scaffold Astro into a temp dir and move it in**

Astro's create command refuses a non-empty dir, so scaffold beside the repo and copy the generated files in:

```bash
cd /Users/steventimothy/workspace
npm create astro@latest portfolio-tmp -- --template minimal --no-install --no-git --typescript strict --skip-houston
cp -R portfolio-tmp/. stimothy.github.io/
rm -rf portfolio-tmp
cd stimothy.github.io
```

Expected: `package.json`, `astro.config.mjs`, `tsconfig.json`, and `src/pages/index.astro` now exist in the repo.

- [ ] **Step 4: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, no errors.

- [ ] **Step 5: Restore the custom domain into `public/`**

```bash
mkdir -p public
git show HEAD:CNAME > public/CNAME 2>/dev/null || printf 'www.steventimothy.com\n' > public/CNAME
git rm --cached CNAME 2>/dev/null; rm -f CNAME
```

Verify: `cat public/CNAME` → `www.steventimothy.com`

- [ ] **Step 6: Ensure build artifacts are ignored**

Confirm `.gitignore` contains `node_modules`, `dist`, and `.astro`. The Astro template usually adds these; if any are missing, append them. (`.superpowers/` was added earlier.)

Run: `grep -E 'node_modules|dist|.astro' .gitignore`
Expected: all three present.

- [ ] **Step 7: Verify the scaffold builds and runs**

Run: `npm run build`
Expected: build succeeds, `dist/` produced, `dist/CNAME` exists.

Run: `ls dist/CNAME`
Expected: file exists.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project and remove legacy site"
```

---

## Task 2: Configure the site and add Vitest

**Files:**
- Modify: `astro.config.mjs`
- Create: `vitest.config.ts`
- Modify: `package.json` (add test script + vitest dep)

- [ ] **Step 1: Set the production site URL in `astro.config.mjs`**

Replace the file contents with:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.steventimothy.com',
});
```

(Custom domain serves at root, so no `base` is needed.)

- [ ] **Step 2: Install Vitest**

Run: `npm install -D vitest`
Expected: vitest added to devDependencies.

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 4: Add a test script to `package.json`**

In the `"scripts"` object, add:

```json
"test": "vitest run"
```

- [ ] **Step 5: Verify the test runner starts**

Run: `npm test`
Expected: exits cleanly with "No test files found" (no tests yet).

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs vitest.config.ts package.json package-lock.json
git commit -m "chore: configure site URL and add Vitest"
```

---

## Task 3: Theme resolution logic (TDD)

**Files:**
- Create: `src/lib/theme.ts`
- Test: `src/lib/theme.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/theme.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { resolveTheme } from './theme';

describe('resolveTheme', () => {
  it('returns the stored theme when it is "dark"', () => {
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('returns the stored theme when it is "light"', () => {
    expect(resolveTheme('light', true)).toBe('light');
  });

  it('falls back to OS preference (dark) when nothing is stored', () => {
    expect(resolveTheme(null, true)).toBe('dark');
  });

  it('falls back to OS preference (light) when nothing is stored', () => {
    expect(resolveTheme(null, false)).toBe('light');
  });

  it('ignores invalid stored values and uses OS preference', () => {
    expect(resolveTheme('purple', true)).toBe('dark');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./theme` / `resolveTheme` is not defined.

- [ ] **Step 3: Write the minimal implementation**

Create `src/lib/theme.ts`:

```ts
export type Theme = 'light' | 'dark';

export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme.ts src/lib/theme.test.ts
git commit -m "feat: add theme resolution logic with tests"
```

---

## Task 4: Design tokens and global styles

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
/* ---- Design tokens (warm: espresso + amber) ---- */
:root,
[data-theme='light'] {
  --bg: #f5efe6;
  --surface: #fbf7f0;
  --text: #2a2521;
  --muted: #6f6354;
  --border: #e4dac9;
  --accent: #b9701a;        /* amber, darkened for light-bg contrast */
  --accent-soft: #f0e2cf;
  --code-bg: #efe7da;
}

[data-theme='dark'] {
  --bg: #17130f;
  --surface: #1f1a14;
  --text: #efe7db;
  --muted: #b09a7f;
  --border: #322a20;
  --accent: #e0a05a;        /* amber */
  --accent-soft: #2a2118;
  --code-bg: #211b14;
}

:root {
  --font-display: Georgia, 'Times New Roman', serif;
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --maxw: 720px;
  --space: 1.25rem;
}

* { box-sizing: border-box; }

html { color-scheme: light dark; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  transition: background 0.2s ease, color 0.2s ease;
}

h1, h2, h3 { font-family: var(--font-display); line-height: 1.15; letter-spacing: -0.01em; }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

.container { max-width: var(--maxw); margin: 0 auto; padding: 0 var(--space); }

.mono { font-family: var(--font-mono); }
.accent { color: var(--accent); }
.muted { color: var(--muted); }

.chip {
  display: inline-block;
  font-size: 0.8rem;
  font-family: var(--font-body);
  padding: 0.2rem 0.65rem;
  margin: 0.2rem 0.35rem 0 0;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--muted);
  background: var(--surface);
}

main { padding: 3rem 0 4rem; }

pre {
  background: var(--code-bg);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.9rem;
}
code { font-family: var(--font-mono); font-size: 0.9em; }
```

- [ ] **Step 2: Verify the CSS is valid by importing it later**

No standalone check here; it is exercised by Task 5's build. Proceed.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add design tokens and global styles"
```

---

## Task 5: BaseLayout with pre-paint theme script, Nav, Footer, and ThemeToggle

**Files:**
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro` (temporary smoke page; replaced in Task 9)

- [ ] **Step 1: Create `src/components/ThemeToggle.astro`**

```astro
---
---
<button id="theme-toggle" class="mono" aria-label="Toggle color theme" title="Toggle theme">
  <span data-theme-icon>◐</span>
</button>

<style>
  #theme-toggle {
    background: none;
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 8px;
    padding: 0.3rem 0.55rem;
    cursor: pointer;
    font-size: 0.95rem;
    line-height: 1;
  }
  #theme-toggle:hover { border-color: var(--accent); color: var(--accent); }
</style>

<script>
  import { resolveTheme } from '../lib/theme';

  function current(): 'light' | 'dark' {
    const attr = document.documentElement.dataset.theme;
    return attr === 'light' ? 'light' : 'dark';
  }

  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  });

  // Reconcile in case markup loaded before the inline head script (defensive).
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = resolveTheme(localStorage.getItem('theme'), prefersDark);
</script>
```

- [ ] **Step 2: Create `src/components/Nav.astro`**

```astro
---
import ThemeToggle from './ThemeToggle.astro';
const links = [
  { href: '/', label: 'home' },
  { href: '/writing', label: 'writing' },
  { href: '/projects', label: 'projects' },
  { href: '/about', label: 'about' },
];
---
<nav class="site-nav">
  <div class="container nav-inner">
    <a class="brand" href="/">ST</a>
    <div class="nav-links">
      {links.map((l) => <a href={l.href}>{l.label}</a>)}
      <ThemeToggle />
    </div>
  </div>
</nav>

<style>
  .site-nav { border-bottom: 1px solid var(--border); padding: 1rem 0; }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; }
  .brand { font-family: var(--font-display); font-weight: 700; font-size: 1.2rem; color: var(--text); }
  .nav-links { display: flex; align-items: center; gap: 1.1rem; }
  .nav-links a { color: var(--muted); font-size: 0.95rem; }
  .nav-links a:hover { color: var(--accent); text-decoration: none; }
</style>
```

- [ ] **Step 3: Create `src/components/Footer.astro`**

```astro
---
const links = [
  { href: 'https://github.com/stimothy', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/steventimothy', label: 'LinkedIn' },
  { href: 'mailto:steven.timothy265@gmail.com', label: 'Email' },
];
---
<footer class="site-footer">
  <div class="container footer-inner">
    <span class="muted mono">© {new Date().getFullYear()} Steven Timothy</span>
    <div class="footer-links">
      {links.map((l) => <a href={l.href}>{l.label}</a>)}
    </div>
  </div>
</footer>

<style>
  .site-footer { border-top: 1px solid var(--border); padding: 2rem 0; margin-top: 3rem; }
  .footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .footer-links { display: flex; gap: 1.1rem; }
  .footer-links a { color: var(--muted); font-size: 0.9rem; }
</style>
```

- [ ] **Step 4: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Lead software engineer writing about how systems are built.' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <script is:inline>
      (function () {
        try {
          var stored = localStorage.getItem('theme');
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          var theme = (stored === 'light' || stored === 'dark') ? stored : (prefersDark ? 'dark' : 'light');
          document.documentElement.dataset.theme = theme;
        } catch (e) {
          document.documentElement.dataset.theme = 'dark';
        }
      })();
    </script>
  </head>
  <body>
    <Nav />
    <main>
      <div class="container">
        <slot />
      </div>
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 5: Replace `src/pages/index.astro` with a smoke-test page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Steven Timothy">
  <h1>Home placeholder</h1>
  <p>Theme toggle and layout smoke test.</p>
</BaseLayout>
```

- [ ] **Step 6: Verify build and types pass**

Run: `npm run build`
Expected: build succeeds with no errors.

Run: `npx astro check`
Expected: 0 errors.

- [ ] **Step 7: Manually verify the theme toggle**

Run: `npm run dev`
Open the printed localhost URL. Confirm: page loads in a theme matching your OS; clicking the toggle flips espresso↔cream; reload preserves the choice. Stop the dev server (Ctrl+C).

- [ ] **Step 8: Commit**

```bash
git add src/components src/layouts src/pages/index.astro
git commit -m "feat: base layout with nav, footer, and persisted theme toggle"
```

---

## Task 6: Content collections schema

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/writing/.gitkeep`
- Create: `src/content/projects/.gitkeep`

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    repo: z.string().url().optional(),
    link: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, projects };
```

- [ ] **Step 2: Create empty content directories**

```bash
mkdir -p src/content/writing src/content/projects
touch src/content/writing/.gitkeep src/content/projects/.gitkeep
```

- [ ] **Step 3: Verify the schema compiles**

Run: `npx astro sync`
Expected: "Generated types" / completes with no schema errors.

Run: `npm run build`
Expected: build succeeds (collections empty is fine).

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/writing/.gitkeep src/content/projects/.gitkeep
git commit -m "feat: define writing and projects content collections"
```

---

## Task 7: Writing list and post pages

**Files:**
- Create: `src/components/PostCard.astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/pages/writing/index.astro`
- Create: `src/pages/writing/[...slug].astro`
- Create: `src/content/writing/hello-world.md` (temporary, removed in Task 10 if replaced)

- [ ] **Step 1: Add one temporary post so routes render**

Create `src/content/writing/hello-world.md`:

```md
---
title: Hello, world
date: 2026-06-13
summary: A placeholder post to verify the writing pipeline.
tags: [meta]
draft: true
---

This is a placeholder. It is marked `draft: true` and will be replaced with real
content in Task 10.
```

- [ ] **Step 2: Create `src/components/PostCard.astro`**

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
<article class="post-card">
  <a href={href}><h3>{title}</h3></a>
  <p class="muted mono date">{dateStr}</p>
  <p>{summary}</p>
  <div>{tags.map((t) => <span class="chip">{t}</span>)}</div>
</article>

<style>
  .post-card { padding: 1.5rem 0; border-bottom: 1px solid var(--border); }
  .post-card h3 { margin: 0 0 0.25rem; color: var(--text); }
  .post-card a:hover h3 { color: var(--accent); }
  .date { font-size: 0.8rem; margin: 0 0 0.5rem; }
  .post-card p { margin: 0.25rem 0; }
</style>
```

- [ ] **Step 3: Create `src/layouts/PostLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
interface Props {
  title: string;
  date: Date;
  summary: string;
  tags: string[];
}
const { title, date, summary, tags } = Astro.props;
const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
---
<BaseLayout title={title} description={summary}>
  <article class="prose">
    <h1>{title}</h1>
    <p class="muted mono date">{dateStr}</p>
    <div class="tags">{tags.map((t) => <span class="chip">{t}</span>)}</div>
    <slot />
  </article>
</BaseLayout>

<style>
  .date { font-size: 0.85rem; }
  .tags { margin-bottom: 2rem; }
  .prose :global(h2) { margin-top: 2.2rem; }
  .prose :global(p) { margin: 1rem 0; }
  .prose :global(ul), .prose :global(ol) { padding-left: 1.4rem; }
</style>
```

- [ ] **Step 4: Create `src/pages/writing/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';

const posts = (await getCollection('writing', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<BaseLayout title="Writing — Steven Timothy">
  <h1>Writing</h1>
  <p class="muted">Notes on software architecture, engineering standards, and ideas worth exploring.</p>
  {posts.length === 0 ? (
    <p class="muted">First posts are on the way.</p>
  ) : (
    posts.map((p) => (
      <PostCard href={`/writing/${p.id}`} title={p.data.title} date={p.data.date} summary={p.data.summary} tags={p.data.tags} />
    ))
  )}
</BaseLayout>
```

- [ ] **Step 5: Create `src/pages/writing/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<PostLayout title={post.data.title} date={post.data.date} summary={post.data.summary} tags={post.data.tags}>
  <Content />
</PostLayout>
```

- [ ] **Step 6: Verify build and types**

Run: `npx astro check && npm run build`
Expected: 0 errors; `/writing` renders. The draft post is excluded, so the list shows the empty state.

- [ ] **Step 7: Temporarily flip the placeholder to non-draft and confirm a post page builds**

Edit `src/content/writing/hello-world.md`, set `draft: false`, run `npm run build`, confirm `dist/writing/hello-world/index.html` exists, then set `draft: true` again.

```bash
ls dist/writing/hello-world/index.html
```

- [ ] **Step 8: Commit**

```bash
git add src/components/PostCard.astro src/layouts/PostLayout.astro src/pages/writing src/content/writing/hello-world.md
git commit -m "feat: writing list and post pages"
```

---

## Task 8: Projects grid and detail pages

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[...slug].astro`

- [ ] **Step 1: Create `src/components/ProjectCard.astro`**

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
<a class="project-card" href={href}>
  <h3>{title}</h3>
  <p>{summary}</p>
  <div>{tags.map((t) => <span class="chip">{t}</span>)}</div>
</a>

<style>
  .project-card {
    display: block;
    padding: 1.4rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--surface);
    color: var(--text);
    transition: transform 0.12s ease, border-color 0.12s ease;
  }
  .project-card:hover { transform: translateY(-2px); border-color: var(--accent); text-decoration: none; }
  .project-card h3 { margin: 0 0 0.4rem; }
  .project-card p { margin: 0 0 0.6rem; color: var(--muted); }
</style>
```

- [ ] **Step 2: Create `src/pages/projects/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';

const projects = (await getCollection('projects', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<BaseLayout title="Projects — Steven Timothy">
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
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.2rem; margin-top: 1.5rem; }
</style>
```

- [ ] **Step 3: Create `src/pages/projects/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  return projects.map((project) => ({ params: { slug: project.id }, props: { project } }));
}

const { project } = Astro.props;
const { Content } = await render(project);
---
<PostLayout title={project.data.title} date={project.data.date} summary={project.data.summary} tags={project.data.tags}>
  <Content />
  <p class="links">
    {project.data.repo && <a href={project.data.repo}>Source ↗</a>}
    {project.data.link && <a href={project.data.link}>Live ↗</a>}
  </p>
</PostLayout>

<style>
  .links { margin-top: 2rem; display: flex; gap: 1.2rem; }
</style>
```

- [ ] **Step 4: Verify build and types**

Run: `npx astro check && npm run build`
Expected: 0 errors; `/projects` renders the empty state (no projects yet).

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectCard.astro src/pages/projects
git commit -m "feat: projects grid and detail pages with graceful empty state"
```

---

## Task 9: Home page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace `src/pages/index.astro` with the real home page**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';

const latest = (await getCollection('writing', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 1)[0];

const featured = (await getCollection('projects', ({ data }) => !data.draft && data.featured))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 2);
---
<BaseLayout title="Steven Timothy — Lead Software Engineer">
  <section class="hero">
    <h1>Steven Timothy</h1>
    <p class="role">Lead Software Engineer <span class="mono accent">// systems &amp; architecture</span></p>
    {latest && (
      <a class="latest" href={`/writing/${latest.id}`}>
        <span class="label mono">~ latest</span>
        <span class="latest-title">{latest.data.title} →</span>
      </a>
    )}
    <div class="chips">
      <span class="chip">software architecture</span>
      <span class="chip">distributed systems</span>
      <span class="chip">platform</span>
    </div>
  </section>

  {featured.length > 0 && (
    <section class="featured">
      <h2>Featured work</h2>
      <div class="grid">
        {featured.map((p) => (
          <ProjectCard href={`/projects/${p.id}`} title={p.data.title} summary={p.data.summary} tags={p.data.tags} />
        ))}
      </div>
    </section>
  )}
</BaseLayout>

<style>
  .hero { padding: 2rem 0 1rem; }
  .hero h1 { font-size: clamp(2.5rem, 6vw, 3.5rem); margin: 0; }
  .role { font-size: 1.15rem; margin: 0.75rem 0 1.75rem; }
  .latest { display: block; border-left: 3px solid var(--accent); padding: 0.5rem 0 0.5rem 1rem; margin-bottom: 1.5rem; color: var(--text); }
  .latest:hover { text-decoration: none; }
  .latest:hover .latest-title { color: var(--accent); }
  .label { display: block; font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
  .latest-title { font-family: var(--font-display); font-size: 1.25rem; }
  .featured { margin-top: 3rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.2rem; margin-top: 1.2rem; }
</style>
```

- [ ] **Step 2: Verify build and types**

Run: `npx astro check && npm run build`
Expected: 0 errors. Home renders; latest-writing block is hidden (only draft exists) and featured section is hidden (no featured projects) — both reappear automatically once Task 10 adds content.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: home page with hero, latest writing, and featured projects"
```

---

## Task 10: About page and seed content

**Files:**
- Create: `src/pages/about.astro`
- Delete: `src/content/writing/hello-world.md`
- Create: `src/content/projects/this-website.md`
- Create: `src/content/writing/what-software-architecture-means-to-me.md`
- Create: `src/content/writing/engineering-standards-i-believe-in.md`

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="About — Steven Timothy">
  <h1>About</h1>
  <p>
    I'm Steven Timothy, a lead software engineer focused on software architecture —
    designing systems that scale, stay understandable, and survive failure. I care
    about clear boundaries, well-defined interfaces, and building things a team can
    reason about.
  </p>
  <p>
    I hold an MS in Computer Science from the University of Utah and a BS in Computer
    Science from Utah State University. Over my career I've worked across the full
    stack and grown into technical leadership, where most of my attention goes to
    architecture: how the pieces fit together, where the seams should be, and how to
    keep a system healthy as it grows.
  </p>
  <p>
    This site is where I write about that work — engineering standards I believe in,
    architecture ideas I want to explore, and the occasional thing I just find
    interesting. If any of it helps you, that's the point.
  </p>
  <p class="muted">
    Find me on <a href="https://github.com/stimothy">GitHub</a> and
    <a href="https://www.linkedin.com/in/steventimothy">LinkedIn</a>.
  </p>
</BaseLayout>
```

> Note for the implementer: this is seed copy drawn from the spec and the legacy
> site. Flag it for Steven to edit into his own voice; do not invent employment
> claims beyond what is stated here.

- [ ] **Step 2: Remove the placeholder post**

```bash
git rm src/content/writing/hello-world.md
```

- [ ] **Step 3: Create `src/content/projects/this-website.md`**

```md
---
title: This website
date: 2026-06-13
summary: A from-scratch portfolio built with Astro, deployed to GitHub Pages, with a Markdown-driven writing pipeline and a warm light/dark theme.
tags: [astro, typescript, github-pages]
featured: true
repo: https://github.com/stimothy/stimothy.github.io
link: https://www.steventimothy.com
---

## The problem

My old personal site never became something I was proud to share. I wanted a place
that does two jobs at once: makes a strong impression on anyone considering hiring
me, and is genuinely useful to anyone trying to learn something.

## What I built

A static site generated with [Astro](https://astro.build). Writing and projects are
plain Markdown files validated by content-collection schemas, so publishing is just
adding a file. Theming is driven by CSS custom properties keyed off a `data-theme`
attribute, set before first paint to avoid a flash and persisted in `localStorage`
with an OS-preference fallback.

## Architecture notes

- **Content as data:** `getCollection` queries typed Markdown; drafts are filtered
  at build time.
- **No backend:** everything is static and served by GitHub Pages behind a custom
  domain.
- **CI/CD:** GitHub Actions builds and deploys on every push to `master`.
```

- [ ] **Step 4: Create `src/content/writing/what-software-architecture-means-to-me.md`**

```md
---
title: What software architecture means to me
date: 2026-06-12
summary: Architecture isn't diagrams or titles — it's the set of decisions that are expensive to change, made deliberately and early.
tags: [architecture, philosophy]
draft: false
---

> Seed outline — Steven to expand in his own voice.

Software architecture, to me, is the set of decisions that are expensive to reverse.
Everything else is implementation detail you can refactor on a Tuesday.

## Boundaries over boxes

The value isn't in the diagram. It's in choosing where the seams go — which parts of
the system can change without forcing the rest to change with them.

## Designing for failure

Systems don't fail politely. Good architecture assumes failure and makes it survivable:
idempotency, timeouts, retries with backoff, and clear ownership of state.

## Keeping it understandable

A system a team can't reason about is a system that will rot. I optimize for the next
engineer's ability to hold a piece of it in their head.

*(Draft — expand each section with concrete examples from real work.)*
```

- [ ] **Step 5: Create `src/content/writing/engineering-standards-i-believe-in.md`**

```md
---
title: Engineering standards I believe in
date: 2026-06-10
summary: A short, opinionated list of the standards I keep coming back to as a lead — and why each one earns its place.
tags: [standards, leadership]
draft: false
---

> Seed outline — Steven to expand in his own voice.

A running list of standards I hold teams to, and the reasoning behind each.

## Make the change easy, then make the easy change

If a change is hard, the first job is refactoring until it's easy.

## Tests describe behavior, not implementation

A test suite should let you change how something works without rewriting every test.

## Boring is a feature

Reach for the well-understood tool before the exciting one. Novelty is a cost you pay
in operations forever.

*(Draft — add the rest of the list and concrete examples.)*
```

- [ ] **Step 6: Verify build and types with real content**

Run: `npx astro check && npm run build`
Expected: 0 errors. Confirm the generated pages exist:

```bash
ls dist/index.html dist/about/index.html \
   dist/writing/index.html \
   dist/writing/what-software-architecture-means-to-me/index.html \
   dist/projects/index.html \
   dist/projects/this-website/index.html
```

Expected: all exist. Home now shows the latest post and the featured project.

- [ ] **Step 7: Commit**

```bash
git add src/pages/about.astro src/content
git commit -m "feat: about page and seed writing/project content"
```

---

## Task 11: GitHub Pages deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Build with Astro
        uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Validate the workflow YAML**

Run: `npx --yes js-yaml .github/workflows/deploy.yml > /dev/null && echo OK`
Expected: `OK` (YAML parses).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy to GitHub Pages on push to master"
```

> Note for the implementer: after merge, the repo's GitHub Pages **Source** must be
> set to "GitHub Actions" in Settings → Pages (one-time manual step). Flag this to
> Steven; it cannot be done from the codebase.

---

## Task 12: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full clean build**

```bash
rm -rf dist .astro
npm run build
```

Expected: build succeeds.

- [ ] **Step 2: Run unit tests and type check**

Run: `npm test && npx astro check`
Expected: tests pass; 0 type errors.

- [ ] **Step 3: Confirm the custom domain file ships**

Run: `cat dist/CNAME`
Expected: `www.steventimothy.com`

- [ ] **Step 4: Manual smoke test of the production build**

Run: `npm run preview`
Open the printed URL and verify:
- Home shows hero, latest post, and the featured "This website" project.
- Theme toggle flips warm dark ↔ warm light and persists across reload.
- `/writing`, `/projects`, `/about`, and a post page all render.
Stop preview (Ctrl+C).

- [ ] **Step 5: Final review of the working tree**

Run: `git status`
Expected: clean (everything committed).

---

## Self-Review Notes

- **Spec coverage:** Astro + Markdown collections (Tasks 1, 6); GitHub Actions + CNAME deploy (Tasks 1, 11); warm A+C blend visual + serif/mono typography (Tasks 4, 9); light/dark toggle with localStorage + OS fallback + no flash (Tasks 3, 5); Home/Writing/Projects/About IA + footer links (Tasks 5, 7, 8, 9, 10); graceful sparse state (Tasks 7, 8); content seeding incl. this-site project + 2 starter posts + About (Task 10); legacy removal (Task 1); YAGNI exclusions respected (no analytics/search/comments). All covered.
- **Placeholders:** none — every code/command step contains concrete content. Seed prose is intentionally marked for Steven's voice but is complete, valid content.
- **Type consistency:** `resolveTheme(stored, prefersDark)` signature matches between `theme.ts`, its test, and the inline reconcile in `ThemeToggle.astro`; collection field names (`draft`, `featured`, `repo`, `link`, `tags`, `summary`, `date`, `title`) are used consistently across `content.config.ts` and all pages; entry id access uses `post.id` / `project.id` (Astro 5) consistently.
