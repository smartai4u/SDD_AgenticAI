# Foundation: Plan

**Roadmap phase:** Phase 1: Foundation

Tasks are ordered. Every **feature task (F)** is immediately followed by the **test task(s) (T)** that prove it. Setup tasks (S) are the only exempt tasks (see below).

## Decisions

- **Package manager:** npm.
- **Layout:** app at the repository root (next to `specs/` and `.claude/`); App Router; `src/` directory.
- **Stack:** as fixed in `specs/tech-stack.md` (Next.js, TypeScript, Tailwind only, shadcn/ui).
- **Design:** Inter via Google Fonts, single green accent, neutral palette.
- **Tests:** Vitest for unit tests; React Testing Library for component tests (run under Vitest); Playwright for end-to-end.
- **Generated CSS:** the generated `src/app/globals.css` (Tailwind import and theme tokens) is the only CSS file allowed; no hand-written CSS rules go in it.
- **Node.js:** pinned to `>=24` via `engines` in `package.json`.
- **Placeholder page text:** neutral placeholder (heading "Placeholder", short line such as "App skeleton ready"); no product name.
- **Playwright browsers:** Chromium only.

## Setup tasks (exempt from test pairing)

These install or generate tooling and contain no behavior of their own; they are verified by the tasks that follow.

- [x] **S1** Create the Next.js app at the repo root with TypeScript, Tailwind, App Router, `src/` dir and npm.
- [x] **S2** Install and configure Vitest, React Testing Library and jsdom (config, setup file, `npm test`).
- [x] **S3** Install and configure Playwright (config with a `webServer` that starts the dev server, `npm run test:e2e`).

## Feature and test tasks

- [ ] **F1** Initialise shadcn/ui (`components.json`, `cn` helper).
  - [ ] **T1** Test (Vitest unit): `cn()` merges class names and resolves conflicting Tailwind classes.
- [ ] **F2** Add the shadcn/ui `Button` component.
  - [ ] **T2** Test (React Testing Library): `Button` renders its label and handles a click.
- [ ] **F3** Design tokens: Inter font via `next/font/google`, single green accent and neutral palette in the Tailwind theme.
  - [ ] **T3** Test (React Testing Library): the root layout renders its children and applies the Inter font class.
- [ ] **F4** Styled placeholder page at `/` (heading, short text, accent-colored `Button`; works at phone width).
  - [ ] **T4** Test (React Testing Library): the page renders its heading and the accent-styled `Button`.
  - [ ] **T5** Test (Playwright e2e): loading `/` shows the heading and the button with no console errors.
- [ ] **F5** npm scripts: `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`.
  - [ ] **T6** Test: run `lint`, `typecheck`, `test`, `test:e2e` and `build` and confirm each exits 0 (recorded in `validation.md`).

## Pairing check

- Feature tasks: F1, F2, F3, F4, F5 (5).
- Test tasks: T1, T2, T3, T4, T5, T6 (6); every feature task has at least one test task directly under it.
- Exempt setup tasks: S1, S2, S3.
