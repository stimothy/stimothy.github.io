# Portfolio Layout Redesign — Design Spec

**Date:** 2026-06-14
**Branch:** `redesign/portfolio-landing-layout`
**Status:** Approved (design); spec under review

## Summary

Redesign the portfolio to adopt a busier, multi-section "landing page" layout
(inspired by a reference template the owner liked), rendered entirely in the
existing **espresso + amber** theme with **serif (Georgia) headings** and the
**ST monogram**. Both **light and dark** themes are retained, mobile-friendly
throughout.

This is a **presentation-layer redesign only**. Content collections, Zod schemas,
the `getCollection`/`render(entry)` data flow, the theming mechanism
(`theme.ts`, the inline anti-flash script, `data-theme`), and the build/deploy
pipeline are all unchanged.

## Goals

- Richer, multi-section home page: hero with portrait + CTAs, a featured-work
  card row, an About/Latest-writing split, footer.
- Apply the new aesthetic site-wide (nav, buttons, cards, spacing).
- Preserve comfortable long-form reading on article pages.
- Keep both themes correct and the whole site mobile-friendly.

## Non-goals (YAGNI)

- Decorative progress bars on project cards (reference had them; dropped as noise).
- A dedicated Contact page or `Contact` nav item.
- A social-icon row in the nav.
- Any change to content schemas, the drafts workflow, or the CI/deploy pipeline.
- Any change to theme-resolution logic or its tests.

## Theming

No logic changes. The design uses only existing CSS custom properties from
`global.css` (`--bg`, `--surface`, `--text`, `--muted`, `--border`, `--accent`,
`--accent-soft`, `--code-bg`). The theme toggle, OS-preference default, and
inline pre-paint `data-theme` script all stay as-is. Both light and dark must
render correctly for every new element (buttons, cards, hero glow, code backdrop).

## Layout system (the one structural change)

Today everything lives in a single 720px `.container`. Introduce two widths:

- **`.container-wide` (~1120px)** — nav, home sections, Writing/Projects listing
  grids. The "busy landing" width.
- **`.container` (720px, unchanged)** — article **body text** on writing posts
  and project detail pages. Long-form reading stays narrow; only the chrome
  around it widens.

New shared styles added to `global.css` alongside existing tokens/utilities:

- `.btn`, `.btn-primary` (amber fill), `.btn-ghost` (bordered) — CTA buttons.
- `.card` — surface card with border, radius, hover lift + amber border.
- `.section-rule` — short amber tick above section headings.
- `.container-wide` — the wider centered container.

Use design tokens only (no hardcoded colors) so both themes stay correct.

## Page-by-page

### Home (`src/pages/index.astro`) — centerpiece

- **Sticky nav** (wide container): monogram + name left; Home / Writing /
  Projects / About + theme toggle right. Translucent blurred background.
- **Two-column hero**:
  - Left: headline, role line, two CTAs, tag chips.
    - "View my work" → `/projects`
    - "Get in touch" → `mailto:steven.timothy265@gmail.com`
  - Right: portrait (existing `src/assets/portrait.jpg`), amber border, sitting
    over a faint **code backdrop with an amber glow**.
- **Featured work**: 3-up `ProjectCard` grid (thumbnail, title, summary, tag
  chips, "Read more →"). No progress bars. Section self-hides when no featured
  projects (current behavior preserved).
- **Bottom split**: About blurb (→ `/about`) | Latest writing (2 most-recent
  non-draft posts → post pages, "All writing →"). Section self-hides when empty.
- **Footer**: existing push-to-bottom footer.

Data queries are the existing ones; home surfaces latest non-draft post(s) and
up to two `featured` non-draft projects.

### Writing & Projects index (`src/pages/{writing,projects}/index.astro`)

- Widen to `.container-wide`.
- Render entries as the new **card grid** (replacing today's plain list), using
  the reskinned `PostCard` / `ProjectCard`.
- Same `getCollection(...)` queries; drafts still filtered out.

### About (`src/pages/about.astro`)

- Keep content; reskin with new nav/footer chrome, section rule, buttons.
- Body text stays at readable width.

### Post & Project detail (`src/layouts/PostLayout.astro`)

- New nav/footer chrome via `BaseLayout`.
- **720px reading column preserved** for article body — the core readability win.
- Buttons/cards available for a project's optional repo/link row.

### Components

- `Nav.astro`, `Footer.astro`, `PostCard.astro`, `ProjectCard.astro` — reskinned.
- `BaseLayout.astro` — gains a way to opt into the wide container (e.g. a
  `wide` prop) while defaulting to the narrow reading container for article pages.

## Mobile-friendliness (required)

- Hero collapses from two columns to a single column (text above portrait) on
  narrow screens; headline uses fluid `clamp()` sizing.
- Featured-work and listing card grids collapse to 1–2 columns via
  `grid-template-columns: repeat(auto-fill, minmax(...))` or explicit breakpoints.
- Bottom About/Latest-writing split stacks vertically on mobile.
- Nav remains usable at small widths (links wrap or condense; tap targets stay
  comfortable). Sticky nav must not crowd content on short viewports.
- Verify at a representative mobile width (~375px) in addition to desktop.

## Testing & verification

- `theme.ts` unit tests unchanged and still pass (`npm test`).
- `npm run build` succeeds.
- `npx astro check` → 0 errors / 0 warnings (the usual non-actionable
  `'z' is deprecated` hints are expected).
- `npm run preview` eyeball pass: both themes, at desktop and ~375px mobile,
  across Home, Writing, Projects, About, and one post + one project page.
- Confirm drafts are still filtered everywhere and empty home sections self-hide.

## Risks / watch-items

- Keep the wide vs. narrow container boundary clear so article reading width is
  never accidentally widened.
- Code-backdrop hero must stay legible/contrast-safe in light mode (it is
  decorative; ensure it never reduces text contrast).
- Buttons and cards must use tokens so both themes pass contrast.
