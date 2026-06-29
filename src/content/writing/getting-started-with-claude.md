---
title: Getting started with Claude
date: 2026-06-28
summary: From classic chatbots to agentic AI — what the difference is, why it matters, and how to install Claude Desktop or Claude Code on macOS, Windows, WSL, and Linux so you can start using it in a real project.
tags: [claude, ai, getting-started, tutorial]
draft: false
---

If you've used ChatGPT or chatted with Claude in a browser, you've seen one half of
what these tools can do. The other half — where the AI doesn't just answer you but
actually *does the work*, in your files, on your machine — is a bigger leap than it
sounds, and it's surprisingly easy to start using.

This is a guide for getting there from zero. By the end you'll have an account, the
tools installed, and Claude running inside a real project so you can try it for
yourself. It's written for beginners, and that includes the curious non-developer —
if you've never opened a terminal, you're exactly who the easy path is for. Plan on
about fifteen minutes.

## Chat vs. agentic AI

The thing most people have used is a **classic chat**: ChatGPT, or Claude at
[claude.ai](https://claude.ai). You type a question, it types back. It's brilliant
at explaining, drafting, and brainstorming — but it lives in its own window. If it
writes you some code or a document, *you* copy it out, paste it where it belongs, and
run it yourself. The AI advises; you do the work.

**Agentic AI** closes that loop. Instead of just talking back, it can take action on
your behalf: read and write files, run commands, search a codebase, and work through
a multi-step task — all inside your actual project folder. You ask for the outcome
and it carries out the steps to get there.

Think of it as the difference between an advisor and an assistant. A classic chat is
the advisor on the phone telling you what to type. Agentic AI is the assistant
sitting at your keyboard, doing it — and showing you what it changed. Ask a chatbot
to "add a license file to my project" and you'll get text to copy. Ask an agentic
tool the same thing and the file simply appears, written into the right place.

> **Claude isn't the only one.** This guide is about Claude, but agentic AI is a
> broader shift — OpenAI's Codex and Google's Gemini CLI are agentic tools too. The
> ideas here carry over; the setup steps below are Claude-specific.

## Sign up

Everything starts with an account. Go to [claude.ai](https://claude.ai) and sign up —
it's free, and the free account gets you the classic chat right away. Poke around,
ask it something, get a feel for it.

> **Heads up on plans.** The free plan gives you the *chat*. The agentic tools below —
> Claude Code — need a paid plan (Pro, Max, Team, or Enterprise). If you just want to
> try the chat first, free is plenty. Come back here when you're ready to let Claude
> work inside your projects.

## Two ways to go agentic

There are two doors to the agentic side, and they lead to the same room. Pick whichever
suits you — you can switch later.

- **The Claude Desktop app** — a normal application with a window, no terminal
  required. It's the easiest start, and it has Claude Code built right in. Available
  for macOS and Windows.
- **Claude Code (the command-line tool)** — runs in a terminal. A little more
  hands-on, a lot of control, and it works everywhere, including Linux and WSL.

Both reach the same capabilities. If "terminal" makes you nervous, start with the
Desktop app. If you already live in a terminal, the CLI will feel right at home.

## Install the Desktop app

Head to [claude.ai/download](https://claude.ai/download) and grab the installer for
your system — it's available for macOS and Windows. (On Linux, skip ahead to the CLI
section below.)

1. Download and install it the way you would any other app.
2. Open it.
3. Sign in with the account you made a moment ago.

That's it. To work on a project, you point the app at a folder on your computer, and
Claude can see and act on the files inside it.

## Install Claude Code (the CLI)

Prefer the terminal, or on Linux? Claude Code installs with a single command. Pick
the one for your setup.

### macOS & Linux

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

On Linux, package-manager installs (apt, dnf, apk) are also available if you'd rather
go that route.

### Windows

In PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Installing [Git for Windows](https://git-scm.com/downloads/win) alongside it is
recommended — it lets Claude Code use its Bash tool, which makes it more capable.

### Windows + WSL

WSL is a full Linux environment running inside Windows. If that's where your work
lives, open your **WSL terminal** (not PowerShell) and run the macOS/Linux installer
there. You install and launch `claude` from inside WSL.

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

> **Native Windows or WSL?** Use native Windows for Windows-native projects and tools.
> Use WSL if your project relies on a Linux toolchain, or if you want Claude Code's
> sandboxed command execution. Either works — pick where your code already lives.

Already have Node.js? You can install it through npm instead:

```bash
npm install -g @anthropic-ai/claude-code
```

That route needs Node.js 18 or newer. Whichever method you used, confirm it worked:

```bash
claude --version
```

A version number means you're ready.

## Start it in a project

A "project" is just a folder of files — your website, a script, some notes, anything.

With the **CLI**, open a terminal in that folder and run:

```bash
claude
```

The first time, it'll open your browser to log in. After that, you're talking to
something that can read and change the files right in front of it.

With the **Desktop app**, open the app and point it at the same folder. Same result,
no terminal.

## A few prompts to try

The fastest way to feel the difference is to ask for something real. Point it at a
folder of your own and try a few of these:

- "Summarize what's in this folder."
- "Take my rough notes in `notes.txt` and turn them into a clean, organized document."
- "Rename these files so they're sorted by date, and group them into subfolders by topic."
- "Walk me through what this project does and how the pieces fit together."

Whether your folder holds code, documents, photos, or a half-finished idea, the move
is the same: talk to it like you'd talk to a capable teammate — plain language is
enough. Watch what it reads and changes, and you'll quickly get a sense of what it's
good at.

## Go deeper

Once you're set up, the fastest way to learn what Claude can actually *do* is to watch
someone drive it. Nick Saraev's [Claude Code Full Course](https://youtu.be/QoQBzR1NIqI)
is a thorough, beginner-friendly walkthrough of the tools and how to use them.

I've deliberately kept this guide to the basics — there are deeper layers worth
learning later (project memory via a `CLAUDE.md` file, custom skills, and agents) once
the fundamentals feel comfortable. For now, the best next step is simple: open one of
your own projects and start asking.
