# Getting Started with Claude — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a beginner-friendly Writing post that explains classic chat vs. agentic AI and walks the reader through installing Claude Desktop / Claude Code across macOS, Linux, Windows, and WSL.

**Architecture:** Content-as-data. The post is a single Markdown file under `src/content/writing/`, validated by the existing `writing` Zod schema and rendered by existing page/layout code. No code changes — publishing is purely adding the `.md` file. Verification is `npx astro check` (schema + types) and `npm run build` (renders).

**Tech Stack:** Astro 6 content collections, Markdown, GitHub Pages deploy (unchanged).

## Global Constraints

- Never commit to `master`. Work happens on branch `writing/getting-started-with-claude` (already created).
- File path: `src/content/writing/getting-started-with-claude.md`.
- Frontmatter must satisfy the `writing` schema (`src/content.config.ts`): `title` (string), `date` (date), `summary` (string), `tags` (string[]), `draft` (boolean).
- `draft: false`.
- `date: 2026-06-28`.
- Voice/format must match `src/content/writing/astro-github-pages-guide.md`: warm, direct, second person, command-by-command, fenced code blocks with language tags, `>` blockquote callouts for gotchas.
- Factual anchors (verified 2026-06-28 against https://code.claude.com/docs/en/setup) — use these exact commands; do not invent others:
  - macOS / Linux / WSL native install: `curl -fsSL https://claude.ai/install.sh | bash`
  - Windows PowerShell native install: `irm https://claude.ai/install.ps1 | iex`
  - npm alternative: `npm install -g @anthropic-ai/claude-code` (Node.js 18+)
  - Verify: `claude --version`
  - Launch in a project: `claude`
  - Desktop downloads: macOS + Windows only (Linux uses CLI).
  - Claude Code requires a paid plan (Pro/Max/Team/Enterprise); the free Claude.ai plan is chat-only.
- Video hand-off: Nick Saraev, "Claude Code Full Course (2026)", https://youtu.be/QoQBzR1NIqI — plain Markdown link, no embed.
- Out of scope: CLAUDE.md, skills, agents, MCP, hooks (mention only that they're deliberately left for later); deep tool comparisons; embedded video player.

---

### Task 1: Write the post and verify it builds

**Files:**
- Create: `src/content/writing/getting-started-with-claude.md`
- Reference (read for voice, do not modify): `src/content/writing/astro-github-pages-guide.md`
- Reference (schema, do not modify): `src/content.config.ts`

**Interfaces:**
- Consumes: the `writing` collection schema in `src/content.config.ts` (fields listed in Global Constraints).
- Produces: a non-draft post that the Writing index and home page pick up automatically via `getCollection('writing')` — no other file references it by name.

- [ ] **Step 1: Create the file with frontmatter**

Create `src/content/writing/getting-started-with-claude.md` starting with exactly this frontmatter:

```markdown
---
title: Getting started with Claude
date: 2026-06-28
summary: From classic chatbots to agentic AI — what the difference is, why it matters, and how to install Claude Desktop or Claude Code on macOS, Windows, WSL, and Linux so you can start using it in a real project.
tags: [claude, ai, getting-started, tutorial]
draft: false
---
```

- [ ] **Step 2: Write the Intro section**

Append after the frontmatter. 1–2 short paragraphs: what the reader will have by the end (an account plus a working agentic setup they can experiment with), who it's for (beginners — both developers and the curious non-developer, who is explicitly welcome to try the terminal side), and a light time expectation. Lead with the payoff. No heading needed for the intro (matches the existing guide, which opens with prose before the first `##`).

- [ ] **Step 3: Write "Chat vs. agentic AI"**

`## Chat vs. agentic AI`. Explain the core distinction in plain language: a classic LLM chat (ChatGPT, Claude.ai in the browser) *talks back* — you copy and paste between it and your work. Agentic AI *takes action* on your behalf: it reads and writes files, runs commands, and works through multi-step tasks directly inside your real project folder. Use one short analogy (e.g. advisor who tells you what to do vs. assistant who does it) and one concrete before/after contrast. Do not explain model internals. Include this callout near the end of the section:

```markdown
> **Claude isn't the only one.** This guide is about Claude, but agentic AI is a
> broader shift — OpenAI's Codex and Google's Gemini CLI are agentic tools too. The
> ideas here carry over; the setup steps below are Claude-specific.
```

- [ ] **Step 4: Write "Sign up"**

`## Sign up`. Walk through creating an account at [claude.ai](https://claude.ai); the chat is free to start. Then the honest callout:

```markdown
> **Heads up on plans.** The free plan gives you the *chat*. The agentic tools below
> — Claude Code — need a paid plan (Pro, Max, Team, or Enterprise). If you only want
> to try the chat first, free is plenty; come back here when you're ready to let
> Claude work inside your projects.
```

- [ ] **Step 5: Write "Two ways to go agentic"**

`## Two ways to go agentic`. Frame the choice plainly so the reader knows which of the next two sections is theirs:
- **Claude Desktop app** — a regular application with a window, no terminal required. Easiest start, and it has Claude Code built in. macOS and Windows.
- **Claude Code (the CLI)** — runs in a terminal, maximum control, every platform including Linux and WSL.
Make clear both reach the same agentic capabilities; the reader can pick one and switch later.

- [ ] **Step 6: Write "Install the Desktop app"**

`## Install the Desktop app`. Download from [claude.ai/download](https://claude.ai/download) (note: macOS and Windows; Linux users skip to the CLI section). Steps: download, install like any app, open it, sign in with the account from the Sign up step. One line that opening a project is just pointing it at a folder.

- [ ] **Step 7: Write "Install Claude Code (the CLI)" with all four environments**

`## Install Claude Code (the CLI)`. One short intro line, then a subsection per environment. Use exactly the verified commands from Global Constraints.

`### macOS & Linux`

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

One line for Linux: package-manager installs (apt, dnf, apk) are also available if you prefer them.

`### Windows`

```powershell
irm https://claude.ai/install.ps1 | iex
```

Note: run this in PowerShell; installing [Git for Windows](https://git-scm.com/downloads/win) is recommended so Claude Code can use its Bash tool.

`### Windows + WSL`

Explain: if you work in WSL (a Linux environment inside Windows), open your WSL terminal and run the macOS/Linux installer there — not PowerShell. You install and launch `claude` from inside WSL.

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Then a callout to help readers choose on Windows:

```markdown
> **Native Windows or WSL?** Use native Windows for Windows-native projects and
> tools. Use WSL if your project relies on a Linux toolchain, or if you want Claude
> Code's sandboxed command execution. Either works — pick where your code already lives.
```

Close the section with the npm alternative and verification:

```bash
npm install -g @anthropic-ai/claude-code
```

(one line: needs Node.js 18+), then:

```bash
claude --version
```

(one line: confirms the install worked).

- [ ] **Step 8: Write "Start it in a project"**

`## Start it in a project`. Define "project" as just a folder of files. CLI path: open a terminal in that folder and run:

```bash
claude
```

Note the first run opens a browser to log in. Desktop path: open the app and point it at the folder. One sentence that you're now talking to something that can act on the files in front of it.

- [ ] **Step 9: Write "A few prompts to try"**

`## A few prompts to try`. A short intro line, then 2–3 example prompts as a list (no step-by-step) that show the agentic difference, e.g.:
- "Summarize what this project does."
- "Add a README that explains how to run this."
- "Find where logging is handled and explain it to me."
One closing line encouraging the reader to just talk to it normally.

- [ ] **Step 10: Write "Go deeper"**

`## Go deeper`. Hand off to the course for learning the individual tools in depth:

```markdown
Once you're set up, the fastest way to learn what Claude can actually *do* is to
watch someone drive it. Nick Saraev's [Claude Code Full Course](https://youtu.be/QoQBzR1NIqI)
is a thorough, beginner-friendly walkthrough of the tools and how to use them.
```

Add one closing line noting that this guide intentionally skipped the deeper layers (project memory / `CLAUDE.md`, custom skills, and agents) — they're worth learning once the basics feel comfortable.

- [ ] **Step 11: Run type/schema check**

Run: `npx astro check`
Expected: 0 errors, 0 warnings. (A number of `'z' is deprecated` *hints* are expected framework noise per CLAUDE.md — not failures.) If there are errors, they almost certainly mean the frontmatter doesn't match the schema; fix and re-run.

- [ ] **Step 12: Run the production build**

Run: `npm run build`
Expected: build completes successfully and the output includes a generated page for the new writing slug (`getting-started-with-claude`).

- [ ] **Step 13: Commit**

```bash
git add src/content/writing/getting-started-with-claude.md
git commit -m "Add 'Getting started with Claude' writing post"
```

---

### Task 2: Open the pull request

**Files:** none (git/GitHub only).

**Interfaces:**
- Consumes: the committed post and the design/plan docs on branch `writing/getting-started-with-claude`.
- Produces: a PR against `master`.

- [ ] **Step 1: Push the branch**

```bash
git push -u origin writing/getting-started-with-claude
```

- [ ] **Step 2: Open the PR**

```bash
gh pr create --base master --title "Add 'Getting started with Claude' writing post" --body "$(cat <<'EOF'
## Summary
- New Writing post: a beginner's guide to Claude — classic chat vs. agentic AI, signing up, and installing Claude Desktop / Claude Code across macOS, Windows, WSL, and Linux.
- Ends with a few starter prompts and a hand-off to Nick Saraev's Claude Code Full Course for going deeper.
- Intentionally scoped to basic setup: no CLAUDE.md / skills / agents.

## Verification
- `npx astro check` — 0 errors / 0 warnings (deprecation hints are framework noise).
- `npm run build` — succeeds.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Report the PR URL**

Capture the URL printed by `gh pr create` and report it.

---

## Notes for the implementer

- This is prose, not code — there is no unit-test cycle. The "tests" are `astro check` and `npm run build` in Task 1, steps 11–12. Do not add Vitest tests for content.
- Do not delete anything in `scratchpad/` — this post was not generated from a scratchpad note, and the scratchpad workflow's review-before-delete rule applies regardless.
- Keep paragraphs tight and skimmable; prefer short paragraphs and the existing guide's rhythm over long blocks.
