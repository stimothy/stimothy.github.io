# steventimothy.com

Personal portfolio of Steven Timothy — lead software engineer, software architecture focus. Built with [Astro](https://astro.build) and deployed to GitHub Pages at [www.steventimothy.com](https://www.steventimothy.com).

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve the built site
npm test         # unit tests (Vitest)
npx astro check  # type checking
```

## Authoring content

Posts and projects are Markdown files — add a file, no code needed:

- Writing: `src/content/writing/<slug>.md`
- Projects: `src/content/projects/<slug>.md`

Set `draft: true` to keep something out of the build. See `src/content.config.ts` for the frontmatter schema, and `CLAUDE.md` for architecture details.

## Deploy

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages. The custom domain is configured via `public/CNAME`.
