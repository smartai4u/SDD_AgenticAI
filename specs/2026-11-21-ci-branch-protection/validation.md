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

- [ ] S1 done: the branch protection API no longer returns the 403 "Upgrade" error.
- [ ] `.github/workflows/ci.yml` exists and runs lint + typecheck on PRs into `main`.
- [ ] The `ci` check runs and passes on the Phase 2 PR.
- [ ] Only squash merge is enabled; head branches auto-delete; auto-merge allowed.
- [ ] `main` protection requires a PR and the `ci` check; force pushes and deletion blocked.
- [ ] Deliberate lint error: `ci` fails and merge is blocked.
- [ ] After the fix: `ci` passes and merge is allowed.
- [ ] A direct push to `main` is rejected.
- [ ] Auto-sync hook merges only after `ci` passes.
- [ ] Every feature task in `plan.md` has a passing paired test task.
- [ ] All commits authored by `smartai4u`.
- [ ] The PR that completes this phase marks Phase 2 `Done` in `specs/roadmap.md`.

## CI

The workflow this phase creates is itself the CI. Until it is merged, no GitHub Actions workflow exists, so the Phase 2 spec PR has no required checks.
