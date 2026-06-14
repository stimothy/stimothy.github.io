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
