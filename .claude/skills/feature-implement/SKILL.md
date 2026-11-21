---
name: feature-implement
description: Use only when the user directly calls it ("run feature-implement" or /feature-implement) to implement the phase described by the active spec's plan.md, honoring requirements.md's scope and decisions and verifying against validation.md before reporting the phase done. Never trigger automatically.
disable-model-invocation: true
---

# Feature Implement

Implement the **whole phase** described by the active spec's `plan.md`, honoring `requirements.md` (scope and decisions), and **verify it against `validation.md`** before reporting the phase done.

**Core principle:** the spec is the contract. Build what it says, nothing outside its scope, and claim "done" only with command output as evidence.

## Definitions

- **Active spec:** a folder `specs/YYYY-MM-DD-feature-name/` (made by `/feature-spec`) with `requirements.md`, `plan.md` and `validation.md`, whose roadmap phase (the `**Roadmap phase:**` line) is not `Done`. If several qualify, ask the user which one (AskUserQuestion). If none qualifies, say so and suggest `/feature-spec`; stop.
- **Task group:** one top-level task in `plan.md` together with its nested paired test tasks: a setup task (`S1`, ...) or a feature task (`F1`, ...) with its test tasks (`T1`, ...). A phase is implemented by working through its task groups in plan order.

## Process

1. **Read the spec.** Read `requirements.md`, `plan.md` and `validation.md` of the active spec, plus `specs/tech-stack.md` (stack, test tools, Git workflow) and `specs/roadmap.md` (the phase). Note which task groups are already ticked (`- [x]`); skip those, so a run can resume where an earlier one stopped.
2. **Check scope before touching code.** Every remaining group must fit `requirements.md`'s in-scope list and the decisions in `plan.md`. If any needs something out of scope, contradicts a decision, or depends on an open `TBD` question, **stop and ask** (AskUserQuestion) instead of guessing. Do not widen scope or add technologies outside `tech-stack.md`. Record any decision the user makes in the `Decisions` section of `plan.md`.
3. **Set up the branch.** Never work on `main`. If on `main`, check the tree is clean, update it from the project's remote, and create one branch for the phase, named per `tech-stack.md` (`type/short-description`, e.g. `feat/foundation`). Reuse the current branch if it already is the phase's branch.
4. **Start the phase.** If the roadmap phase is `Not started`, set its `**Status:**` to `In progress` in `specs/roadmap.md` (the only roadmap changes allowed are `In progress` now and `Done` in step 8).
5. **Implement each remaining task group, in plan order.** For each group: build the feature task, then write or run its paired test task(s) (prefer writing the test first); follow the stack and design rules in `tech-stack.md` (e.g. Tailwind only, shadcn/ui for components). After each group, run that group's tests and read the output; fix failures before moving on. Tick the group's boxes in `plan.md` (`- [x]`) only once its tests pass. Commit locally after each group (`feat: <group>`, `test:` or `chore:` as fitting), staging only that group's files.
6. **Verify the whole phase against `validation.md`.** When all groups are done, run every check in the `validation.md` strategy and checklist that applies (e.g. `npm run dev` starts, `npm test`, `npm run test:e2e`, `npm run lint`, `npm run typecheck`, `npm run build`). Read the actual output. If anything fails, fix it and re-run; do not report done on a failing check. Do not claim a check passed without having run it. Tick a `validation.md` item only if you verified it.
7. **Respect limits.** If a command is killed, times out or cannot run (machine low on memory, tool missing, no CI yet), say so plainly, leave the affected boxes unticked, and stop. Do not retry in a loop, and do not assume it passes.
8. **Phase completion.** Only if every group is ticked and every `validation.md` checklist item is verified, set the phase's `**Status:**` to `Done` in `specs/roadmap.md` and commit it. Otherwise leave it `In progress`.
9. **Do not push, open a PR or merge** unless the user asks.
10. **Report:** the groups completed, files changed, the commands run and their results (pass/fail), which `validation.md` items are verified and which are not, any `TBD` or scope questions raised, and whether the phase is `Done` or still `In progress` (and why).

## Rules

- Never commit to `main`; work on a feature branch.
- Never report the phase done without running its verification and reading the output. If a check cannot be run, say so rather than assuming it passes.
- Never edit `requirements.md`, `mission.md` or `tech-stack.md`. In `roadmap.md` only change the phase `**Status:**` line. In `plan.md` and `validation.md` only tick boxes and record decisions.
- Never invent requirements, libraries or decisions the spec and constitution do not state; ask.
- Stay inside the phase: do not start work from other phases.
- Do not push, open PRs or merge unless the user asks.
- On Windows, if a git command hangs, retry it with `git -c core.fsmonitor=false`.
- The repo's auto-sync Stop hook only merges to `main` when the local branch is `main`; on a feature branch it just pushes the `auto-sync` branch.

## Red flags: stop and ask

| Thought | Reality |
|---|---|
| "The tests probably pass" | Run them and read the output. |
| "This extra feature would be nice" | Out of scope; ask or leave it. |
| "The spec has a TBD but I'll pick something" | Stop and ask. |
| "I'll tick the validation box, it should be fine" | Tick only what you verified. |
| "One more group of the next phase while I'm here" | Stay inside this phase. |
| "That command got killed, I'll loop until it works" | Report it and stop. |
| "I'm on main, but it's a small change" | Never work on `main`; branch first. |
