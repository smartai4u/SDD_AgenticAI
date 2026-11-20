# Foundation: Validation

**Roadmap phase:** Phase 1: Foundation

## Done when (from the roadmap)

The app starts locally, shows a styled placeholder page, and a sample test of each kind passes.

## Test strategy

- **Unit (Vitest):** `cn()` helper sample (T1). This is the extra validation selected for the phase.
- **Component (React Testing Library):** `Button`, root layout and placeholder page samples (T2, T3, T4).
- **End-to-end (Playwright):** `/` loads and shows the placeholder content (T5).
- **Scripts:** `lint`, `typecheck`, `test`, `test:e2e` and `build` all exit 0 (T6).
- No numeric coverage threshold (per `specs/tech-stack.md`).
- A manual phone-width check was not selected as extra validation. Mobile friendliness is still a requirement (R5 in `requirements.md`).

## Checklist

- [ ] `npm run dev` starts the app locally and `/` loads.
- [ ] The placeholder page is styled: Inter font, green accent, neutral palette, shadcn/ui `Button`.
- [ ] `npm test` passes, including the Vitest unit sample and the component samples.
- [ ] `npm run test:e2e` passes (Playwright sample).
- [ ] `npm run lint`, `npm run typecheck` and `npm run build` exit 0.
- [ ] Every feature task in `plan.md` has a passing paired test task.
- [ ] No raw CSS files were added beyond the open question recorded in `requirements.md`.
- [ ] The PR that completes this phase marks Phase 1 `Done` in `specs/roadmap.md`.

## CI

No GitHub Actions workflow exists yet (Phase 2). Until it does, the checks above are run locally.
