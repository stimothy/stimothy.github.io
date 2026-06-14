# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Steven Timothy's personal portfolio — an **Astro** static site (Home, Writing, Projects, About) deployed to **GitHub Pages** at the custom domain `www.steventimothy.com`. It serves two audiences at once: a hiring manager evaluating a lead/architect, and a casual visitor reading the writing. Positioning is oriented around software architecture.

## Workflow rule

**Never commit directly to `master`.** Always branch off `master` first. `master` is the live deploy branch (see CI below), so commits to it publish immediately. Integrate via PR/merge.

## Commands

- `npm run dev` — local dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built `dist/` locally (closest to production)
- `npm test` — Vitest unit tests (`vitest run --passWithNoTests`)
- `npx astro check` — TypeScript + Astro type checking

Note on `astro check`: expect **0 errors / 0 warnings** but a number of *hints* reading `'z' is deprecated`. These come from the Zod re-export bundled with Astro 6 and are a framework-level JSDoc artifact, not actionable — don't chase them.

## Architecture

- **Content as data.** Writing posts and projects are Markdown files under `src/content/{writing,projects}/`, validated by Zod schemas in `src/content.config.ts`. Publishing = adding a `.md` file with the right frontmatter; no code changes. Pages query content with `getCollection(...)` and render bodies via `render(entry)` from `astro:content`.
  - `writing` frontmatter: `title`, `date`, `summary`, `tags[]`, `draft`.
  - `projects` frontmatter: the above plus `featured`, optional `repo` (URL), optional `link` (URL).
  - **Drafts** (`draft: true`) are filtered out at build time everywhere. The home page surfaces the latest non-draft post and up to two `featured` projects; both sections self-hide when empty.
  - Import `z` from `astro:schema` (not `astro:content`) in `content.config.ts`.

- **Theming is the one piece of real logic.** Light + dark in a single warm palette ("espresso + amber"), driven entirely by CSS custom properties in `src/styles/global.css`, keyed off a `data-theme` attribute on `<html>` (light is `:root`, dark via `[data-theme='dark']`).
  - `src/lib/theme.ts` holds the only unit-tested logic: `resolveTheme(stored, prefersDark)` decides the active theme. The `ThemeToggle.astro` client script imports it. Tests in `src/lib/theme.test.ts`.
  - `BaseLayout.astro` runs an **inline (`is:inline`) script in `<head>`** that sets `data-theme` before first paint to avoid a flash. Because `is:inline` scripts are not bundled and cannot import, this script re-implements the same resolution logic inline — keep it in sync with `resolveTheme` if that logic changes. `ThemeToggle.astro` flips the attribute and persists the choice to `localStorage`. First visit follows the OS `prefers-color-scheme`.

- **Layout composition.** `BaseLayout.astro` (head, `Nav`, `Footer`, slot) wraps every page; `PostLayout.astro` wraps `BaseLayout` for both writing posts and project detail pages (shared article styling).

## Content drafts workflow (`scratchpad/`)

The `scratchpad/` folder is Steven's scratchpad — rough, unpolished, thrown-together notes he writes just to get his thoughts out. He hands these to Claude as **source material** for real site content (About copy, blog posts, project write-ups). Treat a scratchpad note as raw input, not finished prose: pull out the facts and intent, then write them up properly in Steven's voice and the site's tone. Don't invent facts that aren't in the scratchpad notes (existing real facts already on the site are fine to retain).

**Required workflow for every scratchpad note — do not skip a step:**
1. Use the scratch notes to create or update the real page/content.
2. **Stop and let Steven review the generated page. Do NOT delete the scratchpad note yet.**
3. Only after Steven approves, delete the source scratchpad note/s file.

Never delete a scratchpad note before Steven has reviewed the content it produced.

## Deployment

`.github/workflows/deploy.yml` builds with `withastro/action` and deploys to GitHub Pages via `actions/deploy-pages` on every push to `master`. The custom domain ships via `public/CNAME` (copied into `dist/` at build). **One-time manual step:** the repo's Settings → Pages → Source must be set to "GitHub Actions".

## Conventions

- Global utility classes from `global.css`: `container`, `muted`, `mono`, `accent`, `chip`. Use design tokens (`var(--bg)`, `var(--text)`, `var(--accent)`, `var(--border)`, etc.) rather than hardcoded colors so both themes stay correct.
- Keep components small and single-responsibility (`src/components/`).
- The seed prose in the starter posts and About page is placeholder, marked for the owner to rewrite — don't invent biographical or employment claims.
