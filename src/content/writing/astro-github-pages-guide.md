---
title: Deploy an Astro site to GitHub Pages
date: 2026-06-14
summary: A start-to-finish guide — scaffold an Astro site, wire up a GitHub Actions deploy, and get it live on GitHub Pages for free. Every command and setting included.
tags: [astro, github-pages, tutorial]
draft: false
---

This site runs on [Astro](https://astro.build), served as static files by GitHub
Pages, and it costs me nothing to host. Every push to `master` rebuilds and
redeploys it on its own. That setup is hard to beat for a portfolio, a blog, or a
docs site: fast, free, and low enough friction that you actually keep it updated.

Here's the whole thing, end to end. Follow it top to bottom and you'll have a live
site at `https://<your-username>.github.io` in about fifteen minutes. No prior Astro
experience needed.

## What you'll need

- **Node.js** — the current LTS release. Check what you have:
  ```bash
  node --version
  ```
  If that errors or shows something older than v18, install the LTS from
  [nodejs.org](https://nodejs.org).
- **A GitHub account** — [github.com](https://github.com), free tier is fine.
- **git** — confirm with `git --version`.

## 1. Create the repo on GitHub and clone it

Start on GitHub. Create a new **empty** repository — don't let it add a README,
license, or `.gitignore`, so it's clean when you scaffold into it.

The name matters, and it depends on which kind of site you want:

- **User/organization site** at `https://<username>.github.io` — the repo *must* be
  named exactly `<username>.github.io`.
- **Project site** at `https://<username>.github.io/<repo-name>/` — name it anything.

If you're not sure, the user site gives you the cleaner URL. (This choice also affects
one config value in step 3.)

Now clone it to your machine and move into it:

```bash
git clone git@github.com:<username>/<repo-name>.git
cd <repo-name>
```

> **Note — SSH vs. HTTPS.** This uses SSH, which skips entering credentials on every
> push once you've [added a key to GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).
> Prefer HTTPS? Use `git clone https://github.com/<username>/<repo-name>.git` instead —
> GitHub will prompt for a personal access token when you push. Either works; the rest
> of this guide is identical.

Git will warn that you cloned an empty repository — that's expected. The clone already
wired up the `origin` remote, so there's nothing to connect later.

## 2. Scaffold Astro into the repo

Astro ships an interactive setup wizard. Run it with `.` so it scaffolds into the
folder you're already in:

```bash
npm create astro@latest .
```

It'll ask a few questions. Sensible answers for a first site:

- **How would you like to start?** — pick a template. "Empty" if you want a blank
  slate, or one of the starters if you'd rather have something to edit.
- **Install dependencies?** — Yes.
- **Initialize a new git repository?** — **No.** You already have one from the clone.

When it finishes, start the dev server:

```bash
npm run dev
```

Open the URL it prints (usually `http://localhost:4321`). You should see your site.
Edit a file under `src/pages/` and the browser updates instantly. Stop the server
with `Ctrl+C` when you're ready to move on.

## 3. Point Astro at GitHub Pages

Astro needs to know the public URL it'll be served from so it can generate correct
links. Open `astro.config.mjs` and set the `site` option.

**The important fork in the road** — there are two kinds of GitHub Pages sites, and
they're configured differently:

- A **user/organization site** lives at `https://<username>.github.io`. Its repo
  *must* be named exactly `<username>.github.io`. No `base` needed.
  ```js
  import { defineConfig } from 'astro/config';

  export default defineConfig({
    site: 'https://<username>.github.io',
  });
  ```

- A **project site** lives at `https://<username>.github.io/<repo-name>/`. The repo
  can be named anything. Because it's served from a subfolder, you also need `base`:
  ```js
  import { defineConfig } from 'astro/config';

  export default defineConfig({
    site: 'https://<username>.github.io',
    base: '/<repo-name>',
  });
  ```

Use whichever matches the repo you created in step 1.

## 4. Add the deploy workflow

GitHub can build and publish the site for you on every push using GitHub Actions.
Create the file `.github/workflows/deploy.yml` with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment, cancel older in-progress runs.
concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Build Astro site
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

A few things worth knowing about this file:

- `withastro/action@v3` installs dependencies, runs `astro build`, and uploads the
  built `dist/` folder as a Pages artifact — you don't have to wire those steps up
  yourself.
- The `permissions` block is required; without `pages: write` and `id-token: write`
  the deploy step can't publish.
- `branches: [main]` must match the branch you push to. If your default branch is
  `master`, change it here.

Now commit everything — your scaffolded site, the config change, and this workflow —
and push it up. Since the repo started empty, this is your first push:

```bash
git add -A
git commit -m "Initial Astro site with GitHub Pages deploy"
git push -u origin main
```

## 5. Flip the one setting that isn't in code

This is the step that trips people up. The workflow can't deploy until you tell the
repo to use GitHub Actions as its Pages source — and that's a one-time manual setting,
not something the YAML can do for itself.

In your repo on GitHub: **Settings → Pages → Build and deployment → Source**, and
choose **GitHub Actions**.

Now open the **Actions** tab. You'll see your workflow running (the push from the last
step kicked it off, or it will the moment you change the source). Give it a minute or
two to go green.

## 6. You're live

Once the deploy job finishes, your site is up. Find the URL under **Settings → Pages**
at the top, or click the deployment in the Actions run — it's
`https://<username>.github.io` for a user site, or
`https://<username>.github.io/<repo-name>/` for a project site.

From here on, publishing is just `git push`. Edit your content, commit, push, and the
workflow rebuilds and redeploys automatically.

## Optional: use your own domain

Want it at `www.yourdomain.com` instead of `github.io`? Two small additions.

**1. Tell GitHub the domain.** Add a file named `CNAME` (no extension) in your
project's `public/` folder containing only your domain:

```
www.yourdomain.com
```

Astro copies everything in `public/` into the build untouched, so this file lands at
the root of your deployed site, which is exactly where GitHub Pages looks for it.
Commit and push.

**2. Point your DNS at GitHub.** In your domain registrar's DNS settings:

- For the `www` subdomain, add a **CNAME** record pointing to
  `<username>.github.io`.
- If you also want the bare apex domain (`yourdomain.com`) to work, add **A** records
  pointing at GitHub's Pages IPs:
  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```

Then in **Settings → Pages → Custom domain**, enter your domain and save. Once DNS
propagates (minutes to a few hours), tick **Enforce HTTPS** so visitors always get
TLS.

One catch worth noting: if you switched to a custom domain, drop the `base` option
from `astro.config.mjs` and set `site` to your real domain — your site now lives at
the root again, not in a subfolder.

That's the whole pipeline. A static site, hosted for free, that redeploys itself
every time you push.
