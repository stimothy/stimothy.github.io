---
title: This website
date: 2026-06-13
summary: A from-scratch portfolio built with Astro, deployed to GitHub Pages, with a Markdown-driven writing pipeline and a warm light/dark theme.
tags: [astro, typescript, github-pages]
featured: true
repo: https://github.com/stimothy/stimothy.github.io
link: https://www.steventimothy.com
image: /banners/astro.svg
imageAlt: Astro logo
---

## The problem

I wanted a single home for the work I've done — and for where I stand on what makes
code clean and well-architected. The real challenge isn't building a portfolio once;
it's keeping one current. A site is only as useful as its last update, and a hand-built
one tends to drift out of date the moment publishing something new means reworking the
layout by hand. So the goal was to engineer for exactly that: a portfolio where staying
current takes almost no effort.

## What I built

A static site built with [Astro](https://astro.build), designed to stay current with
almost no effort. Writing and projects are plain Markdown files validated by
content-collection schemas, so publishing is just adding a file — new content inherits
the site's styling automatically, which is what keeps it from going stale. A warm
light/dark theme, applied before first paint and remembered across visits, rounds out
the reading experience.

## Architecture notes

- **Content as data:** `getCollection` queries typed Markdown; drafts are filtered
  at build time.
- **Theming:** light/dark via CSS custom properties keyed off a `data-theme` attribute —
  resolved before first paint and persisted to `localStorage`, with an OS-preference
  fallback on first visit.
- **No backend:** everything is static and served by GitHub Pages behind a custom
  domain.
- **CI/CD:** GitHub Actions builds and deploys on every push to `master`.
