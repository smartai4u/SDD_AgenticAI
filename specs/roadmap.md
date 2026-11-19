# Roadmap

**Constitution version:** 0.1.0

Ordered phases leading to the first version (0.1.0). Each phase ships and is verified on its own and builds on the previous one. Every phase ships with tests. All work happens on feature branches via pull requests; nothing is committed directly to `main`. Dates: TBD. Each phase has a status (`Not started`, `In progress` or `Done`); the pull request that completes a phase marks it `Done` (a phase is `Done` only when its done-when check is met). Status changes do not change the constitution version.

## Phase 1: Foundation

**Status:** Not started

**Goal:** a running, styled, tested app skeleton (Next.js + TypeScript + Tailwind, shadcn/ui, Inter font, green accent, Vitest/React Testing Library/Playwright set up).
**Done when:** the app starts locally, shows a styled placeholder page, and a sample test of each kind passes.

## Phase 2: CI and branch protection

**Status:** Not started

**Goal:** every change is checked before it merges (GitHub Actions running lint + typecheck; `main` protected, PRs required, squash merge only).
**Done when:** a PR runs the pipeline and cannot merge to `main` unless it passes.

## Phase 3: Data layer

**Status:** Not started

**Goal:** the Supabase database models producers, sites, and inbound and outbound movements (weight in kg).
**Done when:** the schema exists in Supabase and the app can read and write it in tests.

## Phase 4: Producers and sites management

**Status:** Not started

**Goal:** users can maintain the dropdown source lists through separate CRUD pages for feedstock producers and sequestration sites.
**Done when:** producers and sites can each be created, viewed, edited and deleted.

## Phase 5: Movement entry (mobile first)

**Status:** Not started

**Goal:** field staff can record inbound and outbound movements quickly on a phone, selecting producers and sites from dropdowns.
**Done when:** an inbound and an outbound movement can be recorded on a phone-sized screen.

## Phase 6: Movement review (desktop)

**Status:** Not started

**Goal:** analysts can review recorded movements on desktop.
**Done when:** recorded inbound and outbound movements are listed on a desktop-friendly page.

## Phase 7: Release 0.1.0

**Status:** Not started

**Goal:** ship the first version.
**Done when:** all earlier phases are complete, tests pass, and 0.1.0 is deployed to Vercel (deploy process TBD).

## Later

- IoT integration to avoid manual weight entry (Viam under consideration).
