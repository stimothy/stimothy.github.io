# Getting Started with Claude — writing post design

**Status:** approved design, pending spec review
**Date:** 2026-06-28
**Branch:** `writing/getting-started-with-claude`

## Goal

A new Writing post that takes a complete beginner from "I've heard of Claude" to a
working agentic setup they can experiment with. The conceptual focus is the
difference between a **classic LLM chat** (ChatGPT, Claude.ai) and **agentic AI**;
the practical payoff is getting Claude Desktop or Claude Code installed and running
in a real project across every major platform.

## Audience

Total beginners — both developers and non-developers. Non-coders are explicitly
invited to try the agentic/terminal side, not steered away from it. Assume no prior
Claude experience and minimal tooling knowledge; explain agentic AI from scratch.

## Scope

**In scope**
- Explaining classic chat vs. agentic AI (the conceptual heart).
- Signing up at claude.ai, with an honest note that agentic Claude Code requires a
  paid plan (free tier is chat-only).
- Installing the **Claude Desktop app** (GUI, macOS + Windows) — the no-terminal
  on-ramp; note it has Claude Code built in.
- Installing the **Claude Code CLI** across **macOS, Linux, Windows (native), and
  Windows + WSL**.
- Starting Claude in a project and 2–3 starter prompts that demonstrate the agentic
  difference.
- A hand-off link to Nick Saraev's "Claude Code Full Course (2026)" for going deeper.

**Out of scope (YAGNI)**
- CLAUDE.md, skills, agents, MCP, hooks — explicitly noted as deliberately skipped.
- Two-track (coder vs. non-coder) document split — both options woven into one
  narrative instead.
- Embedded video player — plain link, consistent with existing posts.
- Deep explanation of how agentic models work internally.

## File & frontmatter

- Path: `src/content/writing/getting-started-with-claude.md`
- Frontmatter (validated by the `writing` Zod schema in `src/content.config.ts`):
  - `title`: "Getting started with Claude"
  - `date`: 2026-06-28
  - `summary`: one line covering chat-vs-agentic plus installing Desktop & CLI on
    Mac, Windows, WSL, and Linux.
  - `tags`: `[claude, ai, getting-started, tutorial]`
  - `draft`: false
- Voice/format: match the existing `astro-github-pages-guide.md` — warm, direct,
  command-by-command, fenced code blocks, blockquote callouts for gotchas.

## Section outline (Approach A — concept-first)

1. **Intro** — what the guide delivers, who it's for (coders and non-coders), a
   short time promise. Lead with the payoff.
2. **Chat vs. agentic AI** — classic LLM chat *talks back*; agentic AI *takes
   action* (reads/writes files, runs commands, works across multiple steps inside
   your real project). Short analogy plus a concrete contrast. No internals.
3. **Sign up** — create an account at claude.ai; chat is free. Callout: Claude Code
   (the agentic tool) needs a paid plan — Pro/Max/Team/Enterprise; the free tier is
   chat-only.
4. **Two ways to go agentic** — frame the choice: Claude Desktop app (GUI, no
   terminal, easiest start, Claude Code built in) vs. Claude Code CLI (terminal,
   maximum control). Both reach the same agentic capabilities.
5. **Install — Desktop app** — download for macOS and Windows, launch, sign in.
   Note Linux users use the CLI route below.
6. **Install — Claude Code CLI** — cover all four environments:
   - macOS: `curl -fsSL https://claude.ai/install.sh | bash`
   - Linux: same `install.sh`; one-line note that apt/dnf/apk repos also exist.
   - Windows native: PowerShell `irm https://claude.ai/install.ps1 | iex`; note Git
     for Windows is recommended so the Bash tool works.
   - Windows + WSL: run the `install.sh` *inside* the WSL terminal; install and
     launch `claude` from WSL, not PowerShell; WSL adds sandboxing.
   - Short "which on Windows?" callout: native for Windows-native projects, WSL for
     Linux toolchains/sandboxing.
   - Mention the npm alternative (`npm install -g @anthropic-ai/claude-code`,
     Node 18+) and verifying with `claude --version`.
7. **Start it in a project** — open a terminal in a project folder and run `claude`;
   first run logs in via the browser. Desktop equivalent: open a folder in the app.
   Brief note on what a "project" is (just a folder of files).
8. **A few prompts to try** — 2–3 starter prompts that show the agentic difference,
   e.g. "summarize what this project does", "add a README", "find where X is
   handled". No step-by-step.
9. **Go deeper** — hand off to Nick Saraev's Claude Code Full Course
   (https://youtu.be/QoQBzR1NIqI) to learn the individual tools in depth. Note that
   CLAUDE.md / skills / agents are intentionally left for later.

## Factual anchors (verified against docs, 2026-06-28)

- Native installer commands and the WSL/native Windows distinction come from
  https://code.claude.com/docs/en/setup.
- Claude Code requires a paid plan; the free Claude.ai plan does not include it.
- The Desktop app can run Claude Code without a terminal (macOS + Windows downloads).
- Do not invent facts beyond these and the existing verified sources.

## Verification & delivery

- `npx astro check` → expect 0 errors / 0 warnings (deprecation *hints* are
  framework noise, per CLAUDE.md).
- `npm run build` → must succeed.
- Work happens on branch `writing/getting-started-with-claude` (never master).
- Commit the post, push, open a PR against `master`.
