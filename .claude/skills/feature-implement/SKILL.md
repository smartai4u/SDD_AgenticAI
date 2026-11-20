---
name: feature-implement
description: Use only when the user directly asks for it ("feature-implement", "run feature-implement" or /feature-implement) to implement the next incomplete task group from the active spec's plan.md, within the scope and decisions of requirements.md, and verify it against validation.md before reporting it done. Never trigger automatically.
disable-model-invocation: true
---

# Feature Implement

Implement the **next incomplete task group** from the active spec's `plan.md`, honoring `requirements.md` (scope and decisions), and **verify it against `validation.md`** before reporting the group done.

**Core principle:** the spec is the contract. Build what it says, nothing outside its scope, and claim "done" only with command output as evidence.

## Definitions

- **Active spec:** a folder `specs/YYYY-MM-DD-feature-name/` (made by `/feature-spec`) with `requirements.md`, `plan.md` and `validation.md`, whose roadmap phase (the `**Roadmap phase:**` line) is not `Done`. If several qualify, ask the user which one (AskUserQuestion). If none qualifies, say so and suggest `/feature-spec`; stop.
- **Task group:** one top-level task in `plan.md` together with its nested paired test tasks. That is either a setup task (`S1`, `S2`, ...) or a feature task (`F1`, ...) with its test tasks (`T1`, ...). The **next incomplete group** is the first group, in plan order, that still has an unchecked `- [ ]` box.

## Process

1. **Read the spec.** Read `requirements.md`, `plan.md` and `validation.md` of the active spec, plus `specs/tech-stack.md` for the stack, test tools and Git workflow, and `specs/roadmap.md` for the phase. Identify the next incomplete task group.
2. **Check scope before touching code.** The group must fit `requirements.md`'s in-scope list and the decisions recorded in `plan.md`. If it needs something out of scope, contradicts a decision, or depends on an open `TBD` question, **stop and ask** (AskUserQuestion) instead of guessing. Do not widen scope or add technologies outside `tech-stack.md`.
3. **Set up the branch.** Never work on `main`. If on `main`, check the tree is clean, update it from the project's remote, and create a branch named per `tech-stack.md` (`type/short-description`, e.g. `feat/foundation-shadcn-ui`). One branch per task group. Reuse the current branch if it is already the one for this group.
4. **Start the phase.** If the roadmap phase is `Not started`, set its `**Status:**` to `In progress` in `specs/roadmap.md` (the only roadmap change allowed here besides marking it `Done` in step 8).
5. **Implement the group.** Build the feature task, then write or run its paired test task(s). Prefer writing the test first. Follow the stack and design rules in `tech-stack.md` (e.g. Tailwind only, shadcn/ui for components). Keep the change limited to this group.
6. **Verify against `validation.md`.** Run the checks that apply to this group: the group's own tests, plus the relevant items from the `validation.md` checklist and strategy (e.g. `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e`, only those that exist at this point). Read the actual output. If anything fails, fix it and re-run; do not report done on a failing check. Do not claim a check passed without having run it.
7. **Update the spec files.** Tick the completed boxes in `plan.md` (`- [x]`) for this group and its tests. Tick items in the `validation.md` checklist **only** if you verified them in step 6. Do not edit `requirements.md`.
8. **Phase completion.** If this was the last group and every `validation.md` checklist item is verified, set the phase's `**Status:**` to `Done` in `specs/roadmap.md`.
9. **Commit locally** on the feature branch with a message like `feat: <group name>` (or `test:`/`chore:` as fitting). Do **not** push or open a PR unless the user asks.
10. **Report:** the group implemented, files changed, the commands run and their results (pass/fail), which `validation.md` items are now verified and which are not yet, any `TBD` or scope questions raised, and the next incomplete group.

## Rules

- Never commit to `main`; work on a feature branch.
- Implement exactly one task group per run, then stop.
- Never report a group done without running its verification and reading the output. If a check cannot be run (tool not installed yet, no CI), say so plainly rather than assuming it passes.
- Never edit `requirements.md`, `mission.md` or `tech-stack.md`. In `roadmap.md` only change the phase `**Status:**` line.
- Never invent requirements, libraries or decisions that the spec and constitution do not state; ask.
- Do not push, open PRs or merge unless the user asks.
- On Windows, if a git command hangs, retry it with `git -c core.fsmonitor=false`.
- The repo's auto-sync Stop hook only merges to `main` when the local branch is `main`; on a feature branch it just pushes the `auto-sync` branch.

## Red flags: stop and ask

| Thought | Reality |
|---|---|
| "I'll knock out the next group too while I'm here" | One task group per run. |
| "The tests probably pass" | Run them and read the output. |
| "This extra feature would be nice" | Out of scope; ask or leave it. |
| "The spec has a TBD but I'll pick something" | Stop and ask. |
| "I'll tick the validation box, it should be fine" | Tick only what you verified. |
| "I'm on main, but it's a small change" | Never work on `main`; branch first. |
