# HKR.AI — AI Consulting Platform

**Status:** Phase 5 complete — LMS gamification shipped
**Live:** [dev.hkr.ai](https://dev.hkr.ai)
**Owner:** Sergiu Poenaru
**Notion:** [HKR AI Platform & Business Strategy](https://www.notion.so/HKR-AI-Platform-Business-Strategy-30c814d4da5081c9a46be36c08eb0c0e)

---

## Vision

HKR.AI absorbs HKR.TEAM over 3 years. The FTE outsourcing model disappears. Everything HKR delivers becomes outcome-based + AI-powered. hkr.ai becomes the primary brand.

| Brand | Model | Status |
|-------|-------|--------|
| **hkr.team** | Classic outsourcing, FTE-based | Legacy — still generating revenue |
| **hkr.ai** | AI consulting + AI-augmented delivery, outcome-based pricing | New brand |

The two brands cross-promote. hkr.ai gradually takes over.

---

## What This Platform Does

### Landing Pages (Public — `/`)
- Supabase-inspired dark design with emerald green accents
- Marketing for the AI consulting business

### CMS (Public — `/articles/*`)
- AI playbooks, case studies, curated guides as `.md` files rendered by Next.js
- Dual purpose: SEO + organic traffic AND portfolio/showroom sent in sales proposals
- Git push = publish. No admin panel. No database for content.

### LMS (Private — auth-required)
- Duolingo-style AI training platform with XP, streaks, badges, leaderboards
- **`/learn`** — Course catalog with progress tracking
- **`/learn/[course]/[lesson]`** — Lesson reader with MDX + completion tracking
- **`/dashboard`** — Personal stats: XP, level, streak calendar, badges, activity
- **`/leaderboard`** — Overall / Weekly / Season tabs + team standings
- **`/badges`** — Aspirational badge showcase + level progression
- Year 1: HKR internal team (~50-100 users)
- Later: Client teams (multi-tenant architecture)

---

## Business Model

### ICP (Ideal Customer Profile)
- Revenue: $1M-$10M (mid-size companies)
- Industries: eCommerce + Tech preferred, but industry-agnostic
- Companies that can't afford Accenture/Deloitte but want AI transformation
- Have repetitive operations that can be automated

### Differentiator
- Mid-market focus (Accenture doesn't touch $1M-$10M)
- Hands-on implementation, not slide decks
- Embedded in the client's team
- 10x lower price
- HKR as curators of AI agents and processes, not generalist "AI consultants"

### Pricing
- **Phase 1:** Consultancy fee (~$3K) — discovery + AI audit
- **Phase 2:** Hybrid hours/flat + output-based metered
- Revenue comes from consulting/delivery contracts, not the platform itself

---

## LMS — Gamification (Shipped)

### XP Level System

| Level | Title | XP Required |
|-------|-------|-------------|
| 1 | Novice | 0 |
| 2 | Learner | 50 |
| 3 | Practitioner | 150 |
| 4 | Specialist | 300 |
| 5 | Expert | 500 |
| 6 | Master | 800 |
| 7 | Architect | 1200 |
| 8 | Visionary | 1800 |
| 9 | Legend | 2500 |

### Badges (7 at launch)

| Badge | Criteria |
|-------|----------|
| First Steps | Complete your first lesson |
| AI Literate | Complete the AI Literacy course |
| On Fire | 7-day learning streak |
| Unstoppable | 30-day learning streak |
| Century Club | Earn 100 XP total |
| Speed Learner | Complete 3 lessons in a single day |
| Early Adopter | Join during Season 1: Genesis |

### Game Mechanics
- **XP system** — points awarded on lesson completion, tracked per user
- **9 levels** — Novice to Legend with progressive XP thresholds
- **Streaks** — consecutive days of activity (Duolingo-style), 30-day calendar
- **Badges** — milestone achievements with confetti celebration on unlock
- **Leaderboard** — Overall / Weekly / Season tabs, scoped per organization
- **Team standings** — departments compete on aggregate XP
- **Organizations** — org + department/team model for multi-tenant isolation
- **Seasons** — quarterly cumulative periods with ranking preservation

### Curriculum (Current)
- **AI Literacy** (published, 3 modules, 9 lessons, 120 XP) — mandatory for all HKR
- **Prompt Engineering** (unpublished, coming soon)

### Curriculum (Planned)
- AI for Customer Support
- AI for Sales
- AI for Operations
- Agent Building (advanced)

---

## Tech Stack

```
Next.js 15 (App Router) + Supabase + Vercel + shadcn/ui
```

| Component | Role | Why |
|-----------|------|-----|
| **Next.js 15 (App Router)** | Framework | SSR/SSG, route groups, server components |
| **Supabase** | Auth + Postgres + RLS + Storage | Single backend for everything |
| **Vercel** | Hosting | Zero-config Next.js deploys |
| **shadcn/ui** | Component library | Copy-paste, full ownership, Tailwind-native |
| **Tailwind CSS v4** | Styling | Dark mode default, CSS custom properties |
| **MDX / next-mdx-remote** | Article + lesson rendering | `.md` files to pages at build/runtime |
| **react-confetti** | Celebrations | Badge unlock animations (8KB) |
| **tw-animate-css** | Animations | CSS-based entrance animations |
| **lucide-react** | Icons | Dynamic icon mapping for badges |

### Why NOT alternatives
- **Payload CMS** — Overkill. Articles are just `.md` files.
- **Neon** — Unnecessary second database. Supabase Postgres handles everything.
- **Railway/Coolify** — Vercel is simpler for zero-config deploys.
- **Moodle/Open edX** — Heavy, outdated UX, impossible to make Duolingo-like.
- **Framer Motion** — Too heavy. Using react-confetti (8KB) + tw-animate-css instead.

---

## Architecture

```
apps/hkr.ai/
├── app/
│   ├── (marketing)/              # Public landing pages
│   │   └── page.tsx              # Homepage
│   ├── (cms)/                    # Public articles
│   │   └── articles/
│   │       ├── page.tsx          # Article list
│   │       └── [slug]/page.tsx   # Article detail
│   ├── (lms)/                    # Auth-gated learning platform
│   │   ├── layout.tsx            # Auth check + LmsNavbar + StatsHeader
│   │   ├── learn/
│   │   │   ├── page.tsx          # Course catalog
│   │   │   └── [courseSlug]/
│   │   │       ├── page.tsx      # Course detail + modules
│   │   │       └── [lessonSlug]/page.tsx  # Lesson reader + completion
│   │   ├── dashboard/page.tsx    # Personal stats, badges, activity
│   │   ├── leaderboard/page.tsx  # Rankings + team standings
│   │   └── badges/page.tsx       # Badge showcase + levels
│   ├── api/
│   │   └── lms/complete-lesson/route.ts  # Atomic lesson completion
│   ├── auth/callback/route.ts    # OAuth callback
│   ├── login/page.tsx            # Google SSO
│   ├── layout.tsx                # Root layout (dark theme, fonts)
│   └── globals.css               # Design tokens
├── components/
│   ├── ui/                       # shadcn/ui (button, card, tabs, badge, progress, input, label)
│   ├── marketing/                # Navbar, Hero, Footer
│   └── lms/                      # LmsNavbar, StatsHeader, CourseCard, CompleteLessonButton,
│                                 # AchievementCelebration, BadgeCard, BadgeGrid, StreakCalendar,
│                                 # LeaderboardTable, LeaderboardRow, TeamStandings, DynamicIcon
├── content/
│   └── articles/                 # .md files (git push = publish)
├── lib/
│   ├── supabase/                 # Client setup (server.ts + client.ts)
│   └── lms/                      # Core logic
│       ├── queries.ts            # Course/lesson data access
│       ├── levels.ts             # XP level definitions + utilities
│       ├── streaks.ts            # Daily activity + streak calculation
│       ├── achievements.ts       # Badge criteria checker
│       └── gamification.ts       # Profiles, leaderboards, seasons
├── supabase/
│   ├── migrations/               # DB schema (3 migration files)
│   └── seed.sql                  # AI Literacy course + gamification data
├── .env.local                    # Supabase keys
├── CLAUDE.md                     # AI context for Claude Code
├── README.md                     # This file
└── TODO.md                       # Build phases and task tracking
```

### Backend Architecture

```
┌──────────────────────────────────────────────┐
│  Vercel (dev.hkr.ai)                         │
│  ┌────────────────────────────────────────┐  │
│  │  Next.js 15 App                        │  │
│  │  ├── /              (marketing)        │  │
│  │  ├── /articles/*    (CMS - public)     │  │
│  │  │   └── rendered from .md files       │  │
│  │  ├── /learn/*       (LMS - auth)       │  │
│  │  ├── /dashboard     (LMS - auth)       │  │
│  │  ├── /leaderboard   (LMS - auth)       │  │
│  │  ├── /badges        (LMS - auth)       │  │
│  │  └── /api/lms/*     (API routes)       │  │
│  └────────────────────────────────────────┘  │
│                    │                          │
│                    ▼                          │
│             Supabase (EU West Ireland)        │
│             ├── Auth (Google SSO)             │
│             ├── Postgres                      │
│             │   ├── courses, modules, lessons │
│             │   ├── user_progress             │
│             │   ├── organizations, teams      │
│             │   ├── user_profiles             │
│             │   ├── achievements              │
│             │   ├── user_achievements         │
│             │   ├── streaks                   │
│             │   ├── seasons, season_rankings  │
│             │   └── views: weekly_leaderboard │
│             │         + team_leaderboard      │
│             └── RLS (org-scoped policies)     │
└──────────────────────────────────────────────┘
```

### Data Model

| Table | Purpose |
|-------|---------|
| `courses` | Course definitions (title, slug, tier, published) |
| `modules` | Sections within courses |
| `lessons` | Individual lessons (MDX content, duration, XP reward) |
| `user_progress` | Tracks lesson completion + XP earned |
| `organizations` | Workspace containers (HKR, client orgs) |
| `teams` | Departments within an organization |
| `user_profiles` | Denormalized stats (total XP, streak, level) for fast reads |
| `seasons` | Quarterly ranking periods |
| `achievements` | Badge definitions with criteria (JSONB) |
| `user_achievements` | Badges earned by users |
| `streaks` | One row per user per active day |
| `season_rankings` | Snapshot at season end |
| `weekly_leaderboard` | View: XP earned this week per user |
| `team_leaderboard` | View: aggregate XP per team |

---

## Deployment

| Environment | URL | Purpose |
|-------------|-----|---------|
| Production (custom) | `https://dev.hkr.ai` | Primary URL |
| Production (Vercel) | `https://hkr-*.vercel.app` | Fallback (always works) |
| Local | `http://localhost:3000` | Dev server |

| Service | Detail |
|---------|--------|
| Supabase project | `bsmhtqzzzhaieruwxixl` (EU West Ireland) |
| Route53 zone | `Z004204135P4SRWXS410P` |
| Auth | Google SSO via Supabase |

---

## Design Language

Supabase-minimal + terminal-style monospace numbers. Dark theme default.

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#0A0A0A` | Page background |
| `--card` | `#171717` | Card backgrounds |
| `--card-border` | `#2A2A2A` | Card/section borders |
| `--primary` | `#3ECF8E` | CTAs, highlights, XP bar, badges |
| `--accent-hover` | `#2BB57A` | Hover states |
| `--foreground` | `#FFFFFF` | Primary text |
| `--muted-foreground` | `#A1A1AA` | Secondary text |

### UI Patterns
- **Stats header strip** — compact bar below navbar with level, XP progress, streak, badges
- **Confetti** — Robinhood-style full-screen celebration on badge unlock (green palette)
- **Monospace** — `font-mono` for all numbers, levels, XP values
- **Terminal symbols** — minimal iconography from lucide-react

---

## Monthly Cost Estimate

| Service | At launch | At scale |
|---------|-----------|----------|
| Vercel Pro | $20/mo | $20/mo |
| Supabase | Free | $25/mo |
| **Total** | **~$20/mo** | **~$45/mo** |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Content gets stale in 3-6 months | Living content wiki-style + retired courses with persistent XP |
| Team doesn't adopt LMS | Mandatory per role + gamification + financial bonus |
| Clients reject outcome-based | Bottom-up strategy + real pain point data from "What do you hate?" |
| Sergiu = single point of failure | AI-generated content (NotebookLM) + contributors + external consultants |

---

## References

- [Supabase + Next.js quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [shadcn/ui docs](https://ui.shadcn.com)
- [Vercel CLI](https://vercel.com/docs/cli)
- [react-confetti](https://www.npmjs.com/package/react-confetti)
