# TODO — HKR.AI Build Phases

## Phase 0: Foundation
- [x] Install CLI tools (supabase, vercel)
- [x] Scaffold Next.js 15 app (App Router, Tailwind v4, TypeScript)
- [x] Initialize shadcn/ui (new-york style, dark theme)
- [x] Initialize Supabase CLI + link cloud project (`bsmhtqzzzhaieruwxixl`)
- [x] Configure dark theme with HKR design tokens in `globals.css`
- [x] Set up Supabase client helpers (`lib/supabase/server.ts`, `lib/supabase/client.ts`)
- [x] Create route group structure: `(marketing)`, `(cms)`, `(lms)`
- [x] Configure `.env.local` with Supabase cloud keys
- [x] First deploy to Vercel
- [x] Connect dev.hkr.ai domain (Route53 + Vercel)

## Phase 1: Landing Page (Minimal)
- [x] Navbar component (dark, responsive, mobile menu — "AI Academy", "Use Cases")
- [x] Hero section ("Real agentic workflows examples for real business cases")
- [x] Footer (dark, multi-column, social links)
- [ ] Responsive pass (mobile + tablet)
- [ ] SEO: metadata, Open Graph, sitemap

## Phase 2: CMS (Use Cases / Articles)
- [x] Set up `content/articles/` directory with sample `.md` files
- [x] Configure MDX rendering (`next-mdx-remote` + `remark-gfm`)
- [x] Article list page (`/articles`)
- [x] Article detail page (`/articles/[slug]`)
- [x] Article card component
- [ ] Category/tag filtering
- [ ] SEO per article (dynamic metadata from frontmatter)
- [ ] RSS feed (optional)

## Phase 3: LMS — Auth & User Foundation
- [x] Create Supabase hosted project (cloud — EU West Ireland)
- [x] Set up Auth (Google SSO via Supabase)
- [x] Middleware for session refresh + route protection
- [x] Google SSO login page
- [x] Auth callback route (`/auth/callback`)
- [x] Auth-gated layout for `(lms)` route group
- [x] Sign-out button component
- [ ] User profile page
- [ ] `Current User Avatar` component

## Phase 4: LMS — Course Structure
- [x] DB schema: `courses`, `modules`, `lessons` tables
- [x] DB schema: `user_progress` table
- [x] Supabase migrations for schema
- [x] RLS policies (users see their own progress)
- [x] Seed data: first course ("AI Literacy" — 3 modules, 9 lessons)
- [x] Course list page (`/learn`)
- [x] Course detail page (`/learn/[courseSlug]`)
- [x] Module list within course
- [x] Lesson view (MDX markdown content)
- [x] Lesson completion tracking
- [x] Progress bar per course
- [x] Prev/next lesson navigation

## Phase 5: LMS — Gamification
- [x] DB schema: `organizations`, `teams`, `user_profiles`, `seasons`
- [x] DB schema: `achievements`, `user_achievements`, `streaks`, `season_rankings`
- [x] DB views: `weekly_leaderboard`, `team_leaderboard`
- [x] RLS policies scoped per organization
- [x] Seed data: HKR org, General team, Season 1 (Genesis), 7 achievement definitions
- [x] XP level system (9 levels: Novice → Legend)
- [x] Streak tracking (daily activity, consecutive day calculation)
- [x] Achievement criteria checker (7 badge types)
- [x] Server-side API route (`/api/lms/complete-lesson`) for atomic lesson completion
- [x] Updated CompleteLessonButton (calls API, shows celebrations)
- [x] Stats header strip (level, XP progress, streak, badges — always visible)
- [x] LMS navbar with Dashboard + Leaderboard links
- [x] Achievement celebration modal with react-confetti (green palette)
- [x] Badge cards (earned glow vs locked dimmed)
- [x] Streak calendar (30-day grid)
- [x] Dashboard page (`/dashboard`) — profile, XP, streak, badges, activity
- [x] Leaderboard page (`/leaderboard`) — Overall/Weekly/Season tabs + team standings
- [x] Badges showcase page (`/badges`) — aspirational grid with level progression
- [x] Deploy to Vercel production

## Phase 6: LMS — Advanced Features
- [ ] Quiz component (multiple choice, submit, score)
- [ ] "What do you hate?" survey module
- [ ] Mandatory video player (no skip, 1x/1.5x speed)
- [ ] Certificate generation (verifiable URL at hkr.ai)
- [ ] Slack integration (post achievements to channel)
- [ ] Multi-tenant: client team isolation
- [ ] Admin panel: manage courses, view analytics, export data
- [ ] Challenge system (time-boxed competitions)

## Phase 7: Polish & Scale
- [ ] Performance audit (Core Web Vitals)
- [ ] Accessibility pass (a11y)
- [ ] Analytics integration
- [ ] Error monitoring (Sentry or similar)
- [ ] Content: populate initial articles and courses
- [ ] User testing with HKR internal team
- [ ] Iterate based on feedback
