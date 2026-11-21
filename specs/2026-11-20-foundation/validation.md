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

- [x] `npm run dev` starts the app locally and `/` loads.
- [x] The placeholder page is styled: Inter font, green accent, neutral palette, shadcn/ui `Button`.
- [x] `npm test` passes, including the Vitest unit sample and the component samples.
- [x] `npm run test:e2e` passes (Playwright sample).
- [x] `npm run lint`, `npm run typecheck` and `npm run build` exit 0.
- [x] Every feature task in `plan.md` has a passing paired test task.
- [x] No raw CSS files were added beyond the open question recorded in `requirements.md`.
- [x] The PR that completes this phase marks Phase 1 `Done` in `specs/roadmap.md`.

## CI

No GitHub Actions workflow exists yet (Phase 2). Until it does, the checks above are run locally.

## Verification results (2026-11-21)

Run locally on branch `feat/foundation-finish` (Node v24.20.0):

- `npm test`: 4 files, 9 tests passed (cn unit, Button, root layout, home page).
- `npm run test:e2e`: 1 Playwright test passed (Chromium).
- `npm run lint`: exit 0.
- `npm run typecheck`: exit 0.
- `npm run build`: succeeded; `/` prerendered as static.
- `npm run dev` started via the Playwright webServer and `/` loaded.
- Computed styles (production build, Chromium): heading font Inter; Button background green; no horizontal overflow at 375px width or 1280px.
- Only CSS file: `src/app/globals.css` (generated Tailwind/shadcn tokens, accent set via theme variables).
