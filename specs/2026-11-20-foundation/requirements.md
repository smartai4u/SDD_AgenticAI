# Foundation: Requirements

**Roadmap phase:** Phase 1: Foundation

## Goal

A running, styled, tested app skeleton: Next.js + TypeScript + Tailwind, shadcn/ui, Inter font, green accent, with Vitest, React Testing Library and Playwright set up (from `specs/roadmap.md`).

## In scope

- **App scaffold:** Next.js + TypeScript + Tailwind app that starts locally.
- **shadcn/ui and design tokens:** shadcn/ui set up; Inter font; single green accent on a neutral palette.
- **Styled placeholder page:** one page that proves the styling works.
- **Test tooling:** Vitest, React Testing Library and Playwright set up, with one sample test of each kind.

## Out of scope

- Supabase, database schema or any data access (Phase 3).
- GitHub Actions CI and branch protection (Phase 2).
- Producers/sites CRUD pages, movement entry or review pages (Phases 4 to 6).
- Authentication (not decided in the constitution).
- Deployment to Vercel (Phase 7).
- IoT/Viam integration (after 1.0).

## Requirements

- **R1:** the app starts locally with `npm run dev` and serves a page at `/`.
- **R2:** stack matches `specs/tech-stack.md`: Next.js, TypeScript, Tailwind CSS only (no raw CSS files), shadcn/ui for all components.
- **R3:** layout decisions: npm as package manager; app at the repository root next to `specs/` and `.claude/`; App Router; `src/` directory.
- **R4:** design: Inter font from Google Fonts, a single green accent, neutral palette, Tailwind's default type scale, rounded corners, subtle shadows, generous whitespace.
- **R5:** the placeholder page is usable at phone width (mobile friendly) as well as desktop.
- **R6:** test tooling is configured and runnable: Vitest (unit), React Testing Library (component, run under Vitest), Playwright (end-to-end).
- **R7:** one passing sample test of each kind (unit, component, end-to-end), including the Vitest unit sample selected for validation.
- **R8:** every feature task in `plan.md` is paired with a test task.
- **R9:** the phase ships with tests; no numeric coverage threshold (per `tech-stack.md`).

## Open questions (TBD)

- **Raw CSS rule:** `tech-stack.md` says never write raw CSS files, but Next.js + Tailwind + shadcn generate a `globals.css` holding Tailwind directives and theme variables. Decision needed: allow the generated `globals.css` as the only CSS file (recommended reading), or avoid it.
- **App name and placeholder text:** not stated in the constitution; the page uses a neutral placeholder until decided.
- **Node.js version:** not stated; TBD.
- **Playwright browsers:** which to install (e.g. Chromium only) is TBD.
- **Additional validation:** only the Vitest unit sample was selected as extra validation; the component and e2e samples come from the roadmap's done-when check ("a sample test of each kind passes").
