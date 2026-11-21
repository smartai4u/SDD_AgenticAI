# CI and branch protection: Plan

**Roadmap phase:** Phase 2: CI and branch protection

Tasks are ordered. Every **feature task (F)** is immediately followed by the **test task(s) (T)** that prove it. Setup tasks (S) are the only exempt tasks (see below).

## Decisions

- **Pipeline checks:** lint + typecheck only (`npm run lint`, `npm run typecheck`), as stated in `specs/tech-stack.md`. No tests or build in CI.
- **How protection is applied:** by script with the `gh` CLI / GitHub API, authenticated as `smartai4u`.
- **Auto-sync hook:** changed to enable auto-merge (`gh pr merge --auto --squash`) so it merges only after the required check passes.
- **Proof of done:** a real failing + passing throwaway PR, plus reading back repository and protection settings through the API.
- **Runtime:** Node 24 in CI (matches `engines` `>=24`).
- **Admin enforcement:** enforce the rules for admins too (user decision).
- **CI trigger:** pull requests into `main` only; no run on pushes to `main` (user decision).
- **Strict status checks:** require the PR branch to be up to date with `main` before merging (user decision).
- **S1 (unlock protection):** user will make the repo public or upgrade to GitHub Pro; F3 and its tests wait until the API stops returning 403 (user decision).
- **Prerequisite:** branch protection needs the repo to be public or the account on GitHub Pro (currently returns 403).

## Setup tasks (exempt from test pairing)

These change an external account or tooling and contain no code behavior of their own; they are verified by the tasks that follow.

- [ ] **S1** (user action) Unlock branch protection: make `smartai4u/SDD_AgenticAI` public, or upgrade the `smartai4u` account to GitHub Pro. Confirm with `gh api repos/smartai4u/SDD_AgenticAI/branches/main/protection` returning something other than a 403 "Upgrade" error (a 404 "Branch not protected" is fine). Verified by F3/T4.

## Feature and test tasks

- [x] **F1** Add `.github/workflows/ci.yml`: triggers on `pull_request` into `main`; one job named `ci` on `ubuntu-latest` with Node 24, `npm ci`, `npm run lint`, `npm run typecheck`.
  - [x] **T1** Test: run `npm ci`, `npm run lint` and `npm run typecheck` locally exactly as the workflow does and confirm each exits 0.
  - [ ] **T2** Test: open the Phase 2 PR and confirm the `ci` check runs and passes (`gh pr checks`).
- [ ] **F2** Repository merge settings via `gh api`: allow squash merge only (disable merge commits and rebase merges), enable "automatically delete head branches" and "allow auto-merge".
  - [ ] **T3** Test: read the settings back with `gh api repos/smartai4u/SDD_AgenticAI` and assert `allow_squash_merge=true`, `allow_merge_commit=false`, `allow_rebase_merge=false`, `allow_auto_merge=true`.
- [ ] **F3** Branch protection on `main` via `gh api` (requires S1): require a pull request, require the `ci` status check, block force pushes and deletion; admin enforcement per the open question.
  - [ ] **T4** Test: read the protection back from the API and assert the required check is `ci`, a PR is required, force pushes and deletions are disallowed.
  - [ ] **T5** Test (demo, blocked): open a throwaway PR with a deliberate lint error; confirm `ci` fails and the PR cannot be merged.
  - [ ] **T6** Test (demo, allowed): fix the lint error on that PR; confirm `ci` passes and the PR can be squash-merged (if it was only a demo, close it instead so the throwaway change does not reach `main`).
  - [ ] **T7** Test: confirm a direct push to `main` is rejected.
- [ ] **F4** Update `.claude/hooks/auto-sync.sh` to use `gh pr merge --auto --squash` (and not reset local `main` until the PR has merged).
  - [ ] **T8** Test: `bash -n .claude/hooks/auto-sync.sh` passes, and a run from `main` with a trivial change opens a PR with auto-merge enabled that merges only after `ci` passes.

## Pairing check

- Feature tasks: F1, F2, F3, F4 (4).
- Test tasks: T1 to T8 (8); every feature task has at least one test task directly under it.
- Exempt setup tasks: S1.
