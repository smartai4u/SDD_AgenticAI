---
name: create-constitution
description: Use when the user directly invokes /create-constitution to bootstrap a project's constitution (specs/mission.md, specs/tech-stack.md, specs/roadmap.md) from VISION.md. Never trigger automatically.
disable-model-invocation: true
---

# Create Constitution

Bootstrap the project constitution from `VISION.md`. The constitution **is** these three files; there is no `CONSTITUTION.md`:

- `specs/mission.md`
- `specs/tech-stack.md`
- `specs/roadmap.md`

**Core principle:** VISION.md is the seed, not the source of every answer. Anything it doesn't state gets asked, never invented.

## Process

1. Read `VISION.md`. If it is missing, tell the user and stop. Check whether any of the three target files already exist; if so, ask (AskUserQuestion) whether to overwrite, merge, or skip that file.
2. Create `specs/` if needed.
3. **Round 1 is the mission interview** (a single AskUserQuestion call, before any file is written). Its **first question is mandatory and always asked**, with the header/tab labeled **"Release"**, even if VISION.md already mentions a version number (a VISION.md version may be offered as an option, never assumed). It asks what the **first version label** of the constitution should be (this run creates its first version). The question text must state that **the chosen label will be used verbatim across all three constitution files** (`specs/mission.md`, `specs/tech-stack.md`, `specs/roadmap.md`). Offer `0.1.0` (default) and `1.0.0` as options; the user can enter anything via Other. Never pick a version yourself. If a target file already carries a version, mention it in the question. The remaining Round 1 questions cover mission topics only (purpose, target users, problem solved, success criteria, non-goals). **Keep technical topics such as Auth, hosting, data stores, testing and CI/CD out of Round 1**; they belong to the tech-stack and roadmap rounds.
4. Write the files **in this order, one at a time**: mission → tech-stack → roadmap. For each file (mission's confirmation is Round 1 above):
   1. Draft what VISION.md supports, and list the gaps.
   2. Use **AskUserQuestion** to confirm scope and fill the gaps *before writing that file*. Offer VISION-derived options as defaults where possible.
   3. Write the file, then move to the next. Later files may build on answers to earlier ones.
5. Finish with a short summary of the three files and any open questions deferred.

## Asking well

- AskUserQuestion takes 1–4 questions per call. Batch related gaps into one call (e.g. all tech-stack gaps) and use further calls only as needed.
- If VISION.md is thin (a few lines), ask more questions rather than padding the files with generic content. A short file with `TBD` markers beats an invented one.

## Versioning

The constitution has one version label (the first version, set by this skill), shared by all three files. Put it on the line directly under the title of each file as `**Constitution version:** <label>`, using the exact label the user gave. The summary at the end states the version.

## Per-file requirements

### specs/mission.md
Purpose, target users, problem solved, success criteria, explicit non-goals. Confirm scope and audience via AskUserQuestion in Round 1 (after the mandatory "Release" tab); do not infer users or goals VISION.md leaves out. No technical questions (e.g. Auth) here.

### specs/tech-stack.md
Languages, frameworks, data stores, hosting, and key libraries, as stated in VISION.md or confirmed by the user. **Mandatory dimensions, asked even when VISION.md is silent:**

- **Testing tools**: unit, integration, e2e frameworks; coverage expectations.
- **CI/CD**: propose **GitHub Actions** as the default and ask the user to confirm or choose another. Also ask what the pipeline runs (lint, tests, build, deploy) and where deploys go.

### specs/roadmap.md
Break the roadmap into **small, ordered phases that lead up to the first version** (the label the user chose). Each phase is small enough to ship and verify on its own, has a short goal and a done-when check, and builds on the previous phase. Put a `**Status:**` line under each phase title, using only `Not started`, `In progress` or `Done`; every phase starts as `Not started`. State in the roadmap intro that the PR completing a phase marks it `Done` and that status changes do not change the constitution version. Do not break phases down further: no task groups, task lists or checklists under a phase. The final phase is the release of the first version; nothing beyond it goes in the roadmap except an optional "Later" list. Before writing, use AskUserQuestion to confirm the phase breakdown (scope of version one and which phases to include) rather than inventing it from VISION.md. **Mandatory dimensions, asked even when VISION.md is silent:**

- **Testing**: when test infrastructure is set up, and that each milestone ships with tests.
- **CI/CD**: when the pipeline is set up (normally an early milestone) and what gates merges.
- **Git workflow**: see below.

## Git workflow interview (never commit to main)

Record in `specs/tech-stack.md` (under a "Git workflow" heading, next to CI/CD) that **nothing is committed directly to `main`**. Use AskUserQuestion to interview the user about their desired workflow:

- Feature branch naming convention
- Pull request requirements (reviewers, required CI checks, templates)
- Merge strategy (squash, merge commit, rebase)
- Branch protection on `main`
- Who may merge, and whether PRs are required for solo work

Write the answers down; do not assume defaults the user did not confirm.

## Rules

- Never write a file before its AskUserQuestion confirmation.
- Never invent technologies, users, dates, or milestones absent from VISION.md and the user's answers. Mark unresolved items `TBD` and list them in the summary.
- Do not create a `CONSTITUTION.md`.
- Do not commit anything. If the user later asks to commit, use a feature branch, never `main`.

## Red flags: stop and ask

| Thought | Reality |
|---|---|
| "VISION.md doesn't mention testing, so I'll skip it" | Testing and CI/CD are mandatory; ask. |
| "GitHub Actions is obviously right, no need to ask" | Propose it as the default, but get confirmation. |
| "I can fill in the roadmap dates myself" | Ask or mark TBD. |
| "I'll write all three files, then confirm" | Confirm before each file. |
| "VISION.md already gives a version, skip the Release tab" | Always ask "Release" first in Round 1. |
| "Auth fits in the mission questions" | Technical topics stay out of Round 1. |
