# Data layer: Requirements

**Roadmap phase:** Phase 3: Data layer

## Goal

The Supabase database models producers, sites, and inbound and outbound movements (weight in kg) (from `specs/roadmap.md`).

**Done when (roadmap):** the schema exists in Supabase and the app can read and write it in tests.

## In scope

- **New Supabase project for this app:** created in this phase (after the user's explicit OK on cost). The existing project `hive-inspect-template-builder` belongs to a different app and is not used.
- **Schema as migrations:** SQL files kept in the repo under `supabase/migrations/` and applied to the new project through the Supabase tools (no Supabase CLI or Docker on this machine).
- **Three tables:** `producers`, `sites`, and a single `movements` table with a `direction` column (`inbound` | `outbound`).
- **Typed data-access layer** in the Next.js app (server-side only): create, read, update and delete for producers and sites; record and list for movements.
- **Generated TypeScript types** for the database, committed to the repo.
- **Integration tests** (Vitest) against the real Supabase project that read and write every table through the data layer, plus negative tests for the constraints.
- **Local secrets handling:** `.env.example` with placeholder names committed; real values only in a gitignored `.env.local`.

## Out of scope

- Any UI: producers and sites CRUD pages (Phase 4), movement entry (Phase 5), movement review (Phase 6).
- Authentication and row-level-security policies (not decided in the constitution; see open questions).
- Seed or demo data.
- Running the database tests in GitHub Actions (CI stays lint + typecheck per `tech-stack.md`).
- Configuring Vercel environment variables or deploys (Phase 7).
- IoT / Viam integration (after 1.0).

## Requirements

- **R1:** a new Supabase project exists for this app and the schema is applied to it.
- **R2:** `producers` and `sites` each have an `id` (uuid primary key), a required `name`, and `created_at` / `updated_at` timestamps.
- **R3:** `movements` has an `id`, `direction` (`inbound` or `outbound`, constrained), `weight_kg` (numeric, must be greater than 0), `occurred_at` (timestamptz), `producer_id` and `site_id` (foreign keys), and `created_at`.
- **R4:** a CHECK constraint enforces the direction rules: an inbound movement requires a `producer_id` and no `site_id`; an outbound movement requires a `site_id` and no `producer_id`.
- **R5:** foreign keys use `ON DELETE RESTRICT`, so a producer or site referenced by a movement cannot be deleted.
- **R6:** every table has row-level security enabled and no public policies; the app reaches the database only from server-side code using a server-only key. The key is never exposed to the browser (no `NEXT_PUBLIC_` prefix) and never committed.
- **R7:** the data layer exposes typed functions; callers never use the raw Supabase client directly.
- **R8:** integration tests prove read and write for producers, sites and movements, and that invalid data is rejected; tests clean up the rows they create.
- **R9:** `npm run lint` and `npm run typecheck` still pass (they are what CI runs), and `npm test` (unit and component tests) still passes without database secrets.
- **R10:** all commits use the `smartai4u` GitHub account.
- **R11:** every feature task in `plan.md` has a paired test task.

## Open questions (TBD)

- **Supabase project details:** name, region and organization for the new project (the only existing project is in `ap-south-1`). The user confirms cost before creation.
- **Auth and RLS policies:** not decided in the constitution. This phase creates tables with RLS enabled and no policies (no public access).
- **Name uniqueness:** whether producer and site names must be unique (case-insensitive). TBD.
- **Extra fields:** whether producers or sites need contact, location or notes columns; the constitution only requires a name. TBD.
- **Extra movement fields:** notes, operator, facility, vehicle or ticket number. The constitution only requires weight, producer or site, and direction. TBD.
- **Facility model:** whether there is a single facility or several. Not modeled in this phase. TBD.
- **Weight precision:** proposed `numeric(12,3)` (kg with gram precision); not stated in the constitution. TBD.
- **Delete behaviour:** hard delete assumed (no soft delete). TBD.
- **Env variable names** for the Supabase URL and server key. TBD (proposed in `plan.md`).
