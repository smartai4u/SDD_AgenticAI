# Data layer: Plan

**Roadmap phase:** Phase 3: Data layer

Tasks are ordered. Every **feature task (F)** is immediately followed by the **test task(s) (T)** that prove it. Setup tasks (S) are the only exempt tasks (see below).

## Decisions

- **Scope:** new Supabase project for this app + schema + typed data layer + integration tests (no UI).
- **Movement model:** one `movements` table with a `direction` column (`inbound` | `outbound`); `producer_id` required for inbound, `site_id` required for outbound, enforced by a CHECK constraint.
- **Validation:** Vitest integration tests against the real Supabase project, including negative constraint tests; the schema is also read back through the Supabase tools.
- **Migrations:** SQL files in `supabase/migrations/`, applied through the Supabase tools (no CLI or Docker available). The files in the repo are the source of truth.
- **Data access:** server-side only, in `src/lib/data/` on top of `@supabase/supabase-js`, with generated types in `src/lib/supabase/database.types.ts`.
- **Keys and env:** server-only key; proposed variable names `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in a gitignored `.env.local`, placeholders in a committed `.env.example`. No `NEXT_PUBLIC_` prefix.
- **RLS:** enabled on every table with no policies (no public access). Auth/RLS policies are TBD.
- **Columns:** UUID primary keys (`gen_random_uuid()`); `weight_kg numeric(12,3)` with `> 0`; timestamps as `timestamptz`; foreign keys `ON DELETE RESTRICT`.
- **Test commands:** `npm test` stays unit and component tests only (no secrets needed); `npm run test:integration` runs the database tests.
- **CI:** unchanged (lint + typecheck); database tests run locally.
- **Supabase project (user decision):** name `sdd-agentic-ai`, region `us-east-1` (matches the Vercel deployment in iad1), organization `smartai4u's Org` (free plan).
- **Cost (user decision):** create the project only if the quoted cost is $0; if Supabase quotes anything nonzero, stop and ask first.
- **Names (user decision):** producer and site names are unique, case-insensitive (unique index on `lower(name)`); name-only columns; weight `numeric(12,3)`; hard deletes.
- **Secret key (user decision):** the user pastes the server-only secret key into a gitignored `.env.local` from Supabase Dashboard > Project Settings > API Keys; it never enters the chat or git. The Supabase tools only expose the publishable key. No permissive RLS policies are added.

## Setup tasks (exempt from test pairing)

These change an external account or tooling and contain no behavior of their own; they are verified by the tasks that follow.

- [ ] **S1** (user approval) Confirm the cost, then create a new Supabase project for this app and record its URL and server key in `.env.local` (never committed). Verified by F1/T1.
- [ ] **S2** Install `@supabase/supabase-js`; add `.env.example`; add a Vitest integration config and the `npm run test:integration` script (`.env.local` is already gitignored). Verified by the tasks that follow.

## Feature and test tasks

- [x] **F1** Migration `0001`: `producers` and `sites` tables (uuid id, required name, timestamps) with RLS enabled; applied to the new project.
  - [x] **T1** Test (schema read-back): both tables exist with the expected columns and constraints, and RLS is enabled (verified through the Supabase tools and recorded in `validation.md`).
- [ ] **F2** Migration `0002`: `movements` table with `direction` check, `weight_kg > 0`, foreign keys (`ON DELETE RESTRICT`), the direction CHECK constraint and indexes on `occurred_at`, `producer_id`, `site_id`; applied to the project.
  - [ ] **T2** Test (SQL against the live schema): valid inbound and outbound rows are accepted; weight `0` and negative weight, inbound without a producer, outbound without a site, inbound with a site, and outbound with a producer are all rejected.
- [ ] **F3** Generated TypeScript types and a server-only Supabase client (`src/lib/supabase/`).
  - [ ] **T3** Test (Vitest unit): the client factory throws a clear error when the URL or key is missing, and reads them from the environment when present.
- [ ] **F4** Data layer for producers and sites: create, get, list, update and delete.
  - [ ] **T4** Test (integration): producer create, get, list, update and delete round-trip, with cleanup.
  - [ ] **T5** Test (integration): site create, get, list, update and delete round-trip, with cleanup.
- [ ] **F5** Data layer for movements: record inbound, record outbound, get, list (newest first, with the producer or site name).
  - [ ] **T6** Test (integration): an inbound movement (with a producer) and an outbound movement (with a site) can be recorded and listed back with the correct weight in kg and names; invalid input (zero or negative weight, wrong party for the direction) is rejected with an error.
  - [ ] **T7** Test (integration): deleting a producer or site that a movement references is rejected (`ON DELETE RESTRICT`).

## Pairing check

- Feature tasks: F1, F2, F3, F4, F5 (5).
- Test tasks: T1 to T7 (7); every feature task has at least one test task directly under it.
- Exempt setup tasks: S1, S2.
