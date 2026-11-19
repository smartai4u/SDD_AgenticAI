# Tech Stack

**Constitution version:** 0.1.0

## Application

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS only. Never write raw CSS files.
- **Components:** shadcn/ui for all components.
- **Data store:** Supabase (Postgres)
- **Hosting:** Vercel

## Design

- Clean, minimal aesthetic: consistent spacing, neutral color palette, generous whitespace.
- Tailwind's default type scale, rounded corners, subtle shadows.
- **Accent color:** green (single accent).
- **Font:** Inter (Google Fonts).
- Mobile friendly for field data entry; desktop used primarily for data analysis.

## Testing

- **Unit/integration:** Vitest
- **Component tests:** React Testing Library
- **End-to-end:** Playwright
- **Coverage:** no numeric threshold; every milestone ships with tests.

## CI/CD

- **Platform:** GitHub Actions
- **Pipeline runs:** lint + typecheck.
- Tests, build and deploy steps in the pipeline: TBD (not selected during the interview).
- **Deploy target:** Vercel (hosting); how and when deploys are triggered: TBD.

## Git workflow

- **Nothing is committed directly to `main`.**
- **Branch naming:** `type/short-description` (e.g. `feat/producer-crud`, `fix/weight-validation`).
- **Pull requests:** required for all changes, including solo work. CI must pass; no reviewer required.
- **Merge strategy:** squash merge.
- **Branch protection:** `main` is protected; PRs always required.
- **Who may merge:** TBD.
- **Automation:** a Claude Code `Stop` hook (`.claude/hooks/auto-sync.sh`) pushes local changes to the `auto-sync` branch on `smartai4u`, opens a PR into `main`, and squash-merges it. It never pushes directly to `main`. The hook has no review step, so it relies on PRs without reviewers; revisit if required reviews or CI checks are added to branch protection.

## Later (post-1.0)

- IoT integration to avoid manual weight entry (Viam is being considered; not decided).
