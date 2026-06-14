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

I didn't have a place that showed the work I've done — or where I stand on what makes
code clean and well-architected. The times I tried, hand-building a polished portfolio
from scratch cost more time than it was worth, and the moment I wanted to add something
new, getting it to look right was enough friction that the site just fell out of date.

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
