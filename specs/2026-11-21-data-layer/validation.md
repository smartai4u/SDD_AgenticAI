# Data layer: Validation

**Roadmap phase:** Phase 3: Data layer

## Done when (from the roadmap)

The schema exists in Supabase and the app can read and write it in tests.

## Test strategy

- **Schema read-back (T1):** read the live schema through the Supabase tools and compare it with the migrations in the repo; confirm RLS is enabled on every table.
- **Constraint tests (T2):** insert valid and invalid rows directly in SQL and confirm the CHECK, foreign-key and weight rules.
- **Unit (T3):** Vitest unit test of the server-only client factory (no database needed).
- **Integration (T4, T5, T6, T7):** Vitest tests run through the data layer against the real Supabase project: create, read, update, delete for producers and sites; record and list inbound and outbound movements; rejection of invalid data and of deleting referenced rows. Each test cleans up the rows it creates.
- **Existing suites:** `npm test` (unit and component), `npm run lint`, `npm run typecheck` and `npm run build` keep passing; `npm test` needs no database secrets.
- No numeric coverage threshold (per `specs/tech-stack.md`).
- No manual dashboard checks are required beyond the read-back above.

## Checklist

- [ ] A new Supabase project exists for this app and the schema is applied to it.
- [ ] `producers` and `sites` exist with the expected columns and RLS enabled.
- [ ] `movements` exists with the direction CHECK, `weight_kg > 0` and `ON DELETE RESTRICT` foreign keys.
- [ ] Migrations in `supabase/migrations/` match the live schema.
- [ ] Generated types are committed and the data layer is fully typed.
- [ ] No secret is committed; `.env.example` has placeholders only; the server key has no `NEXT_PUBLIC_` prefix.
- [ ] `npm run test:integration` passes against the real project (read and write for all three tables).
- [ ] Negative tests pass: zero or negative weight, wrong producer or site for the direction, deleting a referenced row.
- [ ] `npm test`, `npm run lint`, `npm run typecheck` and `npm run build` exit 0.
- [ ] The `ci` check passes on the Phase 3 PR.
- [ ] Every feature task in `plan.md` has a passing paired test task.
- [ ] All commits authored by `smartai4u`.
- [ ] The PR that completes this phase marks Phase 3 `Done` in `specs/roadmap.md`.

## CI

The `ci` workflow (`.github/workflows/ci.yml`) runs lint and typecheck on every PR into `main` and is a required check. It does not run the database integration tests, which need Supabase secrets and run locally.
