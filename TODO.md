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
- [ ] First deploy to Vercel (`vercel deploy`)
- [ ] Connect hkr.ai domain in Vercel

## Phase 1: Landing Page (Minimal)
- [x] Navbar component (dark, responsive, mobile menu — "AI Academy", "Use Cases")
- [x] Hero section ("Real agentic workflows examples for real business cases")
- [x] Footer (dark, multi-column, social links)
- [ ] Responsive pass (mobile + tablet)
- [ ] SEO: metadata, Open Graph, sitemap

## Phase 2: CMS (Use Cases / Articles)
- [ ] Set up `content/articles/` directory with sample `.md` files
- [ ] Configure MDX rendering (`next-mdx-remote` or `@next/mdx`)
- [ ] Article list page (`/articles`)
- [ ] Article detail page (`/articles/[slug]`)
- [ ] Article card component
- [ ] Category/tag filtering
- [ ] SEO per article (dynamic metadata from frontmatter)
- [ ] RSS feed (optional)

## Phase 3: LMS — Auth & User Foundation
- [x] Create Supabase hosted project (cloud — EU West Ireland)
- [x] Set up Auth (email/password via Supabase SSR)
- [x] Middleware for session refresh + route protection
- [x] Sign-in / sign-up pages (shadcn/ui forms)
- [x] Auth callback route (`/auth/callback`)
- [x] Auth-gated layout for `(lms)` route group
- [x] Sign-out button component
- [ ] User profile page
- [ ] `Current User Avatar` component

## Phase 4: LMS — Course Structure
- [ ] DB schema: `courses`, `modules`, `lessons`, `quizzes` tables
- [ ] Supabase migrations for schema
- [ ] RLS policies (users see their own progress, admins see all)
- [ ] Seed data: first course ("AI Literacy")
- [ ] Course list page (`/learn`)
- [ ] Course detail page (`/learn/[courseId]`)
- [ ] Module list within course
- [ ] Lesson view (video + text content)
- [ ] Quiz component (multiple choice, submit, score)
- [ ] Lesson completion tracking

## Phase 5: LMS — Gamification
- [ ] DB schema: `user_progress`, `achievements`, `user_achievements`, `streaks`
- [ ] XP system: award XP on lesson/quiz completion
- [ ] Streak tracking: daily activity check
- [ ] Badge definitions and unlock criteria
- [ ] Badge unlock triggers (Supabase Edge Functions or DB triggers)
- [ ] XP bar / level display component
- [ ] Streak counter component
- [ ] Badge showcase component
- [ ] Leaderboard (materialized view or computed query)
- [ ] Leaderboard page with Supabase Realtime subscription
- [ ] Team competitions (aggregate XP by department)

## Phase 6: LMS — Advanced Features
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
