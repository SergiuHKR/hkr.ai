# CLAUDE.md — hkr.ai

## Project Overview

HKR.AI — AI consulting platform with a public CMS (markdown articles), private LMS (Duolingo-style gamified training), and marketing landing pages. Supabase-inspired dark design.

**Not a redesign of hkr.team.** This is a separate product on a separate domain. hkr.team is the legacy FTE outsourcing brand. hkr.ai is the new AI consulting brand that absorbs hkr.team over 3 years.

## Key Files

| File | Purpose |
|------|---------|
| `README.md` | Full project plan: vision, architecture, data model, design language |
| `TODO.md` | Phased build checklist (Phase 0-7) |
| `CLAUDE.md` | This file — AI context for Claude Code |
| `SCHEMA.md` | Canonical data model — all entities, fields, relationships, invariants |
| `PRODUCT.md` | Product constitution — what this product is, is not, and AI guardrails |

## Product Constitution

**Before any schema change, new feature, or architectural decision — read `SCHEMA.md` and `PRODUCT.md`.**

- `SCHEMA.md` is the source of truth for all DB entities and fields. Update it before writing migrations.
- `PRODUCT.md` defines non-negotiables. Push back if a request contradicts it and ask for explicit confirmation before deviating.

## Repo & Git

This project lives at `septillion/apps/hkr.ai/` but has its **own git repo**: [github.com/SergiuHKR/hkr.ai](https://github.com/SergiuHKR/hkr.ai). The parent septillion repo ignores `apps/` entirely.

```bash
# Commit and push (from this directory)
git add -A && git commit -m "message" && git push
```

Do NOT push to septillion's repo from here.

## Parent Resources (Septillion)

The parent `septillion/CLAUDE.md` is auto-inherited. For shared knowledge:

| Resource | Path (relative to this project) |
|----------|-------------------------------|
| Skills | `../../skills/` |
| Tools | `../../tools/` |
| Context | `../../context/` |
| Business strategy doc | `../../context/build_hkr_ai_website_CMS_LMS.md` |
| Google APIs | `../../tools/google-*/TOOL.md` |
| AWS | `../../tools/aws/TOOL.md` |

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Backend:** Supabase (Auth + Postgres + Realtime + Storage + Edge Functions)
- **UI:** shadcn/ui + Supabase UI Library
- **Styling:** Tailwind CSS v4 (dark mode default)
- **Deploy:** Vercel
- **CMS:** MDX / next-mdx-remote (`.md` files in `content/articles/`)
- **Animations:** Framer Motion (optional)

## CLI Tools

```bash
supabase    # Local dev, migrations, DB management
vercel      # Deploy, preview URLs
npx shadcn@latest add [component]  # Add UI components
```

## Design Tokens

```
Background:      #0A0A0A
Cards:           #171717 with border #2A2A2A
Accent (green):  #3ECF8E (hover: #2BB57A)
Text primary:    #FFFFFF
Text muted:      #A1A1AA
Text tertiary:   #71717A
```

## Route Groups

| Group | Path | Auth | Purpose |
|-------|------|------|---------|
| `(marketing)` | `/`, `/about`, `/solutions`, `/contact` | Public | Landing pages |
| `(cms)` | `/articles/*` | Public | Blog / playbooks |
| `(lms)` | `/learn/*`, `/dashboard`, `/leaderboard` | Required | Training platform |

## Deployment

| Environment | URL | Purpose |
|-------------|-----|---------|
| Production (custom) | `https://dev.hkr.ai` | Primary URL (pending DNS migration to Route53) |
| Production (Vercel) | `https://hkr-45ttev9gl-hkrteam.vercel.app` | Fallback — always works, use for testing |
| Local | `http://localhost:3000` | Dev server |

**Supabase project:** `bsmhtqzzzhaieruwxixl` (West EU Ireland)
**Route53 hosted zone:** `Z004204135P4SRWXS410P`

When testing the live site, use the Vercel fallback URL if `dev.hkr.ai` isn't resolving yet.

## Workflow: TODO-First Development

Every coding task follows this strict loop:

1. **Plan** — Write the task in `TODO.md` before writing any code
2. **Code** — Implement the change
3. **Verify** — Test that it works (preview, build, manual check)
4. **Mark complete** — Check off the item in `TODO.md` only after verification passes

Never skip steps. Never mark done before verifying.

## Build Priority

CMS is easiest — ship first. LMS is most urgent — internal team adoption. See `TODO.md` for the full phased checklist.

## Documentation Sync

After every conversation that changes the project (new features, architecture changes, pivots, decisions), **always update**:

1. **`TODO.md`** — check off completed items, add new tasks, reorder priorities
2. **`README.md`** — keep architecture, data model, and design sections in sync with reality
3. **`SCHEMA.md`** — update whenever a table, field, or relationship changes
4. **`PRODUCT.md`** — update whenever a core product decision is made or changes
