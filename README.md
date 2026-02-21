# HKR.AI — AI Consulting Platform

**Status:** Pre-build
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

### CMS (Public — `/articles/*`)
- AI playbooks, case studies, curated guides as `.md` files rendered by Next.js
- Dual purpose: SEO + organic traffic AND portfolio/showroom sent in sales proposals
- Git push = publish. No admin panel. No database for content.

### LMS (Private — `/learn/*`, auth-required)
- Duolingo-style AI training platform with XP, streaks, badges, leaderboards, quizzes, video lessons
- Year 1: HKR internal team (~50-100 users)
- Later: Client teams (multi-tenant architecture)
- "What do you hate?" module as a sales trojan horse — aggregates team pain points, feeds proposals

### Landing Pages (Public — `/`)
- Supabase-inspired dark design with emerald green accents
- Section positioning inspired by hkr.team's layout structure
- Marketing for the AI consulting business

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

## LMS — Gamification

### Progression Tiers

| Level | Name | What they learn |
|-------|------|-----------------|
| Beginner | AI Literacy | Models, tokens, basic prompting |
| Intermediate | Tool Users | AI tools for their role (CS, Sales, Ops) |
| Advanced | Agent Builders | Building and deploying AI agents |

First badge = "AI Literat" — everyone in HKR must earn this.

### Game Mechanics
- **XP system** — points for completing lessons, quizzes, challenges
- **Levels** — XP thresholds unlock new levels
- **Streaks** — consecutive days of activity (Duolingo-style)
- **Badges** — milestone achievements
- **Leaderboard** — real-time via Supabase Realtime, top 10 visible
- **Team competitions** — departments compete on aggregate XP
- **Financial bonus** — tied to completing all modules
- **Slack integration** — announce achievements in team channels
- **Certificates** — LinkedIn-worthy, verifiable at hkr.ai

### Curriculum
- AI Literacy (mandatory for all)
- Prompt Engineering
- AI for Customer Support
- AI for Sales
- AI for Operations
- Agent Building (advanced)

### Content Model: Living Content
- Not fixed courses — living knowledge base, wiki-style, continuously updated
- But with gamified structure — paths, progression, quizzes, badges
- Retired courses: content goes away, but user XP stays forever

---

## Tech Stack

```
Next.js (App Router) + Supabase + Vercel + shadcn/ui
```

| Component | Role | Why |
|-----------|------|-----|
| **Next.js 15 (App Router)** | Framework | SSR/SSG, route groups, industry standard |
| **Supabase** | Auth + DB + Realtime + Storage + Edge Functions | Single backend for everything |
| **Vercel** | Hosting | Zero-config Next.js deploys, `vercel deploy` from CLI |
| **shadcn/ui** | Component library | Copy-paste, full ownership, Tailwind-native |
| **Supabase UI Library** | Auth, Realtime, Storage components | shadcn-compatible, drop-in features |
| **MDX / next-mdx-remote** | Article rendering | `.md` files to pages at build time |
| **Framer Motion** | Animations | Optional, for subtle UI polish |

### Why NOT alternatives
- **Payload CMS** — Overkill. Articles are just `.md` files.
- **Neon** — Unnecessary second database. Supabase Postgres handles everything.
- **Railway/Coolify** — Vercel is simpler for zero-config deploys.
- **Moodle/Open edX** — Heavy, outdated UX, impossible to make Duolingo-like.

### CLI Tools

```bash
brew install supabase/tap/supabase   # Local dev, migrations, DB management
npm install -g vercel                 # Deploy from terminal
npx shadcn@latest                    # Add UI components
```

---

## Architecture

```
apps/hkr.ai/
├── app/
│   ├── (marketing)/              # Public landing pages
│   │   ├── page.tsx              # Homepage
│   │   ├── about/
│   │   ├── solutions/
│   │   └── contact/
│   ├── (cms)/                    # Public articles
│   │   └── articles/
│   │       └── [slug]/page.tsx
│   ├── (lms)/                    # Auth-gated learning platform
│   │   ├── learn/
│   │   ├── dashboard/
│   │   ├── leaderboard/
│   │   └── layout.tsx            # Auth check wrapper
│   ├── layout.tsx                # Root layout (dark theme, fonts)
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── marketing/                # Hero, LogoBar, Testimonials, etc.
│   ├── cms/                      # ArticleCard, ArticleList, MDX components
│   └── lms/                      # CourseCard, Quiz, Leaderboard, XPBar, etc.
├── content/
│   └── articles/                 # .md files (git push = publish)
├── lib/
│   └── supabase/                 # Client setup (server + browser)
├── supabase/                     # Supabase CLI: migrations, seed, config
│   ├── migrations/
│   └── seed.sql
├── public/                       # Static assets
├── .env.local                    # Supabase keys, Vercel env
├── CLAUDE.md                     # AI context
├── README.md                     # This file
└── TODO.md                       # Build phases and task tracking
```

### Backend Architecture

```
┌──────────────────────────────────────────┐
│  Vercel                                  │
│  ┌────────────────────────────────────┐  │
│  │  Next.js App                       │  │
│  │  ├── /           (marketing)       │  │
│  │  ├── /articles/* (CMS - public)    │  │
│  │  │   └── rendered from .md files   │  │
│  │  ├── /learn/*    (LMS - auth)      │  │
│  │  └── /api/*      (API routes)      │  │
│  └────────────────────────────────────┘  │
│                    │                     │
│                    ▼                     │
│             Supabase                     │
│             ├── Auth (login)             │
│             ├── Postgres                 │
│             │   ├── courses, modules     │
│             │   ├── lessons, quizzes     │
│             │   ├── user_progress        │
│             │   ├── achievements         │
│             │   ├── streaks              │
│             │   └── leaderboard (view)   │
│             ├── Edge Functions            │
│             │   └── XP, streaks, badges  │
│             ├── Realtime                 │
│             │   └── live leaderboard     │
│             └── Storage                  │
│                 └── video, images, media │
└──────────────────────────────────────────┘
```

### Gamification Data Model

| Table | Purpose |
|-------|---------|
| `courses` | Course definitions (title, description, category, tier) |
| `modules` | Modules within courses |
| `lessons` | Individual lessons (content, video URL, duration) |
| `quizzes` | Quiz definitions with questions and answers |
| `user_progress` | Tracks lesson completion, XP earned per lesson |
| `achievements` | Badge definitions and unlock criteria |
| `user_achievements` | Join table — when a user earns a badge |
| `streaks` | Daily activity tracking |
| `leaderboard` | Materialized view computed from user_progress |
| `challenges` | Time-boxed team or individual challenges |

---

## Design Language

Supabase-inspired dark theme with HKR identity.

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#0A0A0A` | Page background |
| `--card` | `#171717` | Card backgrounds |
| `--card-border` | `#2A2A2A` | Card/section borders |
| `--accent` | `#3ECF8E` | CTAs, highlights, active states |
| `--accent-hover` | `#2BB57A` | Hover states |
| `--foreground` | `#FFFFFF` | Primary text |
| `--muted` | `#A1A1AA` | Secondary text |
| `--muted-foreground` | `#71717A` | Tertiary text |

### Landing Page Sections (hkr.team positioning, Supabase aesthetic)

| # | Section | Treatment |
|---|---------|-----------|
| 1 | Navbar | Dark bar, HKR.AI logo white, nav links gray, CTA green pill |
| 2 | Hero | Dark bg, headline white + green accent, two buttons (green primary + ghost) |
| 3 | Social proof | Client logos horizontal scroll, muted on dark bg |
| 4 | What we do | Bento grid feature cards with numbered steps |
| 5 | Services | Dark stacked cards — title left, bullets + green CTA right |
| 6 | Case studies | Dark tile cards with category tags |
| 7 | How we work | Pilot / Prove / Scale step cards |
| 8 | CTA section | Full-width, compelling copy, green button |
| 9 | Footer | Darker bg, multi-column links, social icons |

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
- [Supabase UI Library](https://supabase.com/ui/docs/getting-started/introduction)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [shadcn/ui docs](https://ui.shadcn.com)
- [Vercel CLI](https://vercel.com/docs/cli)
