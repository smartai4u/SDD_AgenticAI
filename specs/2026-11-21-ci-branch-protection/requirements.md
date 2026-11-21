# CI and branch protection: Requirements

**Roadmap phase:** Phase 2: CI and branch protection

## Goal

Every change is checked before it merges: GitHub Actions runs lint + typecheck, and `main` is protected (PRs required, squash merge only) (from `specs/roadmap.md`).

**Done when (roadmap):** a PR runs the pipeline and cannot merge to `main` unless it passes.

## In scope

- **CI pipeline:** one GitHub Actions workflow that runs `npm run lint` and `npm run typecheck` on every pull request into `main`.
- **Branch protection on `main`:** pull requests required, the CI check required to pass, no direct pushes, no force pushes, no branch deletion. Applied with the `gh` CLI (GitHub API) as the `smartai4u` account.
- **Squash-only merging:** merge commits and rebase merges disabled at repository level; squash merge is the only method.
- **Auto-sync hook adaptation:** `.claude/hooks/auto-sync.sh` enables auto-merge (`gh pr merge --auto --squash`) instead of merging immediately, so it merges only once CI passes.
- **Proof:** a throwaway PR with a deliberate lint error is blocked from merging; after the fix it can merge.

## Out of scope

- Running tests (Vitest/Playwright) or `next build` in CI: not selected; `tech-stack.md` leaves them TBD.
- Deploy automation or Vercel configuration (Phase 7).
- Required human reviewers (`tech-stack.md`: no reviewer required).
- Supabase, data layer, any app features (Phases 3 to 6).
- Rewriting existing `main` history.

## Requirements

- **R1:** the workflow runs on `pull_request` targeting `main` and executes `npm ci`, `npm run lint`, `npm run typecheck` on Node 24 (matches `engines` `>=24`).
- **R2:** the workflow exposes a single stable check name used as the required status check.
- **R3:** `main` requires a pull request and the CI check before merge; direct pushes, force pushes and deletion are blocked.
- **R4:** only squash merge is enabled on the repository.
- **R5:** the auto-sync hook never merges a PR before its required check passes (uses auto-merge).
- **R6:** all commits and API calls use the `smartai4u` account only.
- **R7:** every feature task in `plan.md` has a paired test task.

## Prerequisite blocker (found while writing this spec)

`smartai4u/SDD_AgenticAI` is a **private** repository on a **free** personal plan. GitHub returns `403: Upgrade to GitHub Pro or make this repository public to enable this feature` for both the branch-protection API and the rulesets API. Without one of those, R3 (and therefore the roadmap's "cannot merge unless it passes") **cannot be enforced**. The CI workflow (R1, R2) and the squash-only setting (R4) do not depend on it. Repository settings that do work on the free plan are applied regardless.

## Open questions (TBD)

- **Unlock protection:** upgrade the account to GitHub Pro, or make the repository public? (User decision; plan setup task S1.)
- **Admins:** enforce the rules for repository admins too (needed for the roadmap's "cannot merge unless it passes" to hold for `smartai4u`), or let admins bypass? Recommended reading: enforce for admins. TBD.
- **Who may merge:** `tech-stack.md` lists this as TBD.
- **Trigger on push to `main`:** also run CI on pushes to `main`? Not requested; TBD.
- **Strict up-to-date branches:** require the PR branch to be up to date with `main` before merging? TBD.
