---
name: feature-spec
description: Use when the user directly invokes /feature-spec to scaffold the spec (requirements, plan, validation) for the next unstarted phase on the roadmap, on a new branch with a draft PR. Never trigger automatically.
disable-model-invocation: true
---

# Feature Spec

Scaffold the spec for the **next unstarted phase** of `specs/roadmap.md`: ask three grouped questions, write three spec files on a feature branch, pair every feature task with a test task, commit, push, and open a **draft** PR gated on the project's CI checks.

**Core principle:** the constitution (`specs/mission.md`, `specs/tech-stack.md`, `specs/roadmap.md`) is the source. Anything it doesn't state gets asked, never invented.

## Process

1. **Read the constitution.** Read `specs/roadmap.md`, `specs/mission.md` and `specs/tech-stack.md`. If any is missing, tell the user to run `/create-constitution` and stop.
2. **Pick the phase.** The target is the **first phase, in order, whose `**Status:**` is `Not started`**. If a phase is `In progress`, tell the user and ask (AskUserQuestion) whether to spec that one or the next unstarted one. If every phase is `Done` or none is unstarted, say so and stop. Take the phase's goal and done-when check from the roadmap.
3. **Check the repo.** Confirm a git repo with a remote, and a clean working tree (untracked files that are not part of this work, or uncommitted changes, mean: ask before continuing). Read the **Git workflow** section of `tech-stack.md` for the branch naming convention, merge strategy and PR rules, and use them. If the convention is `TBD`, ask.
4. **Ask exactly 3 grouped questions in ONE AskUserQuestion call, before writing anything:**
   1. **Scope** (header "Scope"): what is in and out of this phase, drawn from the phase's goal in the roadmap and the mission's non-goals. Offer roadmap-derived options.
   2. **Key decisions** (header "Decisions"): the open design or technical choices for this phase that the constitution does not settle (e.g. data shapes, page structure, libraries within the chosen stack). Offer options consistent with `tech-stack.md`; never propose technologies outside it without saying so.
   3. **Validation** (header "Validation"): how the phase is proven done: which tests (unit, integration, e2e per `tech-stack.md`), and what manual checks, beyond the roadmap's done-when check.

   Do not ask more than these 3 questions, and do not split them across calls. If the dialog returns fewer than 3 answers, re-ask only the unanswered ones. Mark anything still unresolved `TBD`.
5. **Create the branch** from an up-to-date `main`, named per the convention (default shape in this project: `feat/<feature-name>`). Never commit to `main`.
6. **Write the spec folder** `specs/YYYY-MM-DD-feature-name/` where the date is today's date and `feature-name` is a short kebab-case name for the phase (e.g. `specs/2026-11-20-data-layer/`). Create three files:
   - **`requirements.md`**: the phase goal, in-scope and out-of-scope items, requirements derived from the answers and the constitution, and open questions (`TBD`).
   - **`plan.md`**: an ordered task list (see "Test pairing" below), plus the decisions from question 2.
   - **`validation.md`**: the phase's done-when check from the roadmap, the test strategy from question 3, and a checklist that confirms done.
   Put a line under each title linking the phase: `**Roadmap phase:** Phase N: <name>`. Do not edit `roadmap.md` (its status flips in the PR that completes the phase).
7. **Test pairing check (mandatory).** In `plan.md` every **feature task** must be immediately followed by a **test task** that covers it (e.g. `- [ ] Build producer form` then `- [ ] Test: producer form validation`). Number or label them so the pairing is visible. Before committing, re-read `plan.md` and verify the pairing: count feature tasks and test tasks and confirm every feature task has its test. Fix the plan if any feature task is unpaired. Pure setup tasks (e.g. installing the test framework) are the only exception, and the plan must say they are exempt and why.
8. **Commit, push, open a draft PR.**
   - Commit only the new `specs/YYYY-MM-DD-feature-name/` files, with a message like `docs: add spec for <phase name>`.
   - Push the branch to the project's configured remote (check `git remote -v` and `remote.pushDefault`).
   - Open a **draft** PR into `main` with `gh pr create --draft`. Put the phase goal, done-when check and a link to the spec files in the body.
   - **CI gating:** look in `.github/workflows/` for the project's GitHub Actions checks. List the checks the PR must pass in its body ("Ready for review only when these pass: ..."). If no workflow exists yet (CI is a roadmap phase that may not be done), say so in the PR body and the summary; do not invent checks. After the PR is open, run `gh pr checks`. **Leave the PR as a draft**; mark it ready only when the user asks and the checks have passed. Never merge it.
9. **Summarize:** the phase chosen, the branch, the spec folder, the draft PR URL, the CI checks it is gated on (or that none exist yet), and any `TBD` items.

## Test pairing

- Feature task = anything that builds, changes or configures behavior.
- Test task = a task that writes or runs the test proving that feature task (unit, integration, or e2e as appropriate for the stack in `tech-stack.md`).
- The test task names what it verifies. "Add tests" as a catch-all at the end does not satisfy the rule.

## Rules

- Never write a file before the 3 questions have been answered.
- Never commit or push to `main`; use a feature branch and a PR.
- Never invent requirements, tools, dates or CI checks absent from the constitution and the user's answers. Mark gaps `TBD`.
- Do not modify `specs/roadmap.md`, `mission.md` or `tech-stack.md`.
- The PR stays a **draft** until the user says otherwise and CI is green.
- On Windows, if a git command hangs, retry it with `git -c core.fsmonitor=false`.
- The repo's auto-sync Stop hook only opens PRs when the local branch is `main`; on the feature branch it only pushes `auto-sync` and does not merge. It never replaces the draft PR this skill opens.

## Red flags: stop and ask

| Thought | Reality |
|---|---|
| "I'll just ask a couple more questions to be thorough" | Exactly 3 grouped questions, in one call. |
| "I'll write the files first, then ask" | Ask before writing anything. |
| "Add tests at the end covers it" | Every feature task needs its own paired test task. |
| "No CI exists, so I'll make up checks to gate on" | State that CI isn't set up; list only real workflow checks. |
| "The PR looks fine, I'll mark it ready" | Draft until the user says so and CI passes. |
| "I'll commit to main since it's only docs" | Never commit to `main`. |
