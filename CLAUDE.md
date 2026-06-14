# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal/portfolio website for Steven Timothy. There is **no build system, no package manager, and no tests** — the files served are the files in the repo. To preview, open `index.html` directly in a browser or run a static server (e.g. `python3 -m http.server`).

## Deployment

Deployed via **GitHub Pages** from the `master` branch root. The `CNAME` file binds the site to the custom domain `www.steventimothy.com`, so any commit to `master` publishes live. There is no staging environment.

## Architecture

- `index.html` — home page (profile header + welcome blurb).
- `about/index.html` — about page. Lives in its own directory and uses **its own duplicated copy** of the dark theme at `about/css/dark_theme.css`. Edits to the root `css/` files do not propagate to `about/`; keep them in sync manually.
- `css/dark_theme.css` and `css/light_theme.css` — two complete, parallel stylesheets using identical element IDs/classes (`Profile_Container`, `Logos`, `Navigation_Bar`, `Content_Container`). Any structural/layout change must be made in both to avoid theme drift.

## Theming

Two themes exist. `js/theme_changer.js` is the intended mechanism: it picks `light_theme` between 10am–7pm and `dark_theme` otherwise, injecting the `<link>` via `document.write`. **It is currently commented out in `index.html`**, which instead hardcodes `dark_theme.css`. Re-enabling the script requires uncommenting its `<script>` tag and removing the hardcoded stylesheet `<link>`.

## Asset conventions

`source/images/` contains two naming variants of the same photos:
- Capitalized (e.g. `Prof_Pic.jpg`, `Prof_Back_D.jpg`) — full-resolution originals, linked for click-through.
- lowercase (e.g. `profile_pic.jpg`) — display/thumbnail versions used in `<img src>`.

Theme-specific assets use `_d` (dark) / `_l` (light) suffixes (e.g. `github_d.png`, `linkedin_l.png`). When the active theme changes, the referenced sprite suffix must change to match.
