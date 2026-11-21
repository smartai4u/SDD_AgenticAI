# CI and branch protection: Validation

**Roadmap phase:** Phase 2: CI and branch protection

## Done when (from the roadmap)

A PR runs the pipeline and cannot merge to `main` unless it passes.

## Test strategy

- **Local parity (T1):** `npm ci`, `npm run lint`, `npm run typecheck` exit 0 locally, the same commands CI runs.
- **Pipeline runs (T2):** the `ci` check appears on the Phase 2 PR and passes.
- **Settings read-back (T3, T4):** repository merge settings and `main` protection are read back through the GitHub API and compared with the spec.
- **Real failing + passing PR demo (T5, T6):** a throwaway PR with a deliberate lint error is blocked; after the fix it can merge.
- **Direct push rejected (T7):** pushing to `main` directly fails.
- **Hook (T8):** syntax check plus one real run showing auto-merge waits for CI.
- No numeric coverage threshold; no Vitest/Playwright suites are part of CI for this phase.

## Checklist

- [x] S1 done: the branch protection API no longer returns the 403 "Upgrade" error.
- [x] `.github/workflows/ci.yml` exists and runs lint + typecheck on PRs into `main`.
- [x] The `ci` check runs and passes on the Phase 2 PR.
- [x] Only squash merge is enabled; head branches auto-delete; auto-merge allowed.
- [x] `main` protection requires a PR and the `ci` check; force pushes and deletion blocked.
- [x] Deliberate lint error: `ci` fails and merge is blocked.
- [x] After the fix: `ci` passes and merge is allowed.
- [x] A direct push to `main` is rejected.
- [ ] Auto-sync hook merges only after `ci` passes.
- [ ] Every feature task in `plan.md` has a passing paired test task.
- [x] All commits authored by `smartai4u`.
- [ ] The PR that completes this phase marks Phase 2 `Done` in `specs/roadmap.md`.

## CI

The workflow this phase creates is itself the CI. Until it is merged, no GitHub Actions workflow exists, so the Phase 2 spec PR has no required checks.

## Verification results (2026-11-21)

- **T1/T2:** `npm ci --dry-run`, `npm run lint`, `npm run typecheck` exit 0 locally; the `ci` check passes on GitHub with a real clean install (run 44877934103). The first CI run caught a real bug (`LayoutProps` generated into `.next/`); fixed by running `next typegen` before `tsc`.
- **T3:** `gh api repos/smartai4u/SDD_AgenticAI` shows `allow_squash_merge=true`, `allow_merge_commit=false`, `allow_rebase_merge=false`, `allow_auto_merge=true`, `delete_branch_on_merge=true`.
- **T4:** `main` protection read back: required check `ci`, strict up-to-date, PR required (0 approvals), admins enforced, force pushes and deletions disallowed.
- **T5:** throwaway PR #18 with a deliberate `no-explicit-any` error: `ci` failed, merge state `BLOCKED`, `gh pr merge` refused ("the base branch policy prohibits the merge"), `main` unchanged.
- **T6:** after the fix `ci` passed and merge state became `CLEAN`; PR #18 was closed without merging and its branch deleted.
- **T7:** `git push smartai4u HEAD:main` was rejected ("Changes must be made through a pull request", "Required status check "ci" is expected").
- **Hook logic (partial T8):** in a throwaway clone with a fake `gh`, the hook opened a PR and ran `gh pr merge --auto --squash` (no immediate merge). The real run from `main` is recorded separately.
- **Repo:** made public to enable protection (free plan); secret scan beforehand found nothing.

