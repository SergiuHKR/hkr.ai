# TODO — HKR.AI Build Phases

## Phase 0: Foundation
- [ ] Install CLI tools (`brew install supabase/tap/supabase`, `npm i -g vercel`)
- [ ] Scaffold Next.js app (`npx create-next-app@latest . --app --tailwind --typescript --eslint --src-dir=false`)
- [ ] Initialize shadcn/ui (`npx shadcn@latest init`)
- [ ] Initialize Supabase (`supabase init`)
- [ ] Configure dark theme with design tokens in `globals.css`
- [ ] Set up Supabase client helpers (`lib/supabase/server.ts`, `lib/supabase/client.ts`)
- [ ] Create route group structure: `(marketing)`, `(cms)`, `(lms)`
- [ ] First deploy to Vercel (`vercel deploy`)
- [ ] Connect hkr.ai domain in Vercel

## Phase 1: Marketing / Landing Pages
- [ ] Navbar component (dark, responsive, mobile sheet menu)
- [ ] Hero section (headline + green accent + two CTAs)
- [ ] Social proof / logo bar (horizontal scroll)
- [ ] "What we do" bento grid (numbered feature cards)
- [ ] Services section (stacked dark cards with bullet lists)
- [ ] Case studies section (dark tile cards with category tags)
- [ ] "How we work" section (Pilot / Prove / Scale steps)
- [ ] CTA section (full-width, green button)
- [ ] Footer (dark, multi-column, social links)
- [ ] Responsive pass (mobile + tablet)
- [ ] SEO: metadata, Open Graph, sitemap

## Phase 2: CMS (Public Articles)
- [ ] Set up `content/articles/` directory with sample `.md` files
- [ ] Configure MDX rendering (`next-mdx-remote` or `@next/mdx`)
- [ ] Article list page (`/articles`)
- [ ] Article detail page (`/articles/[slug]`)
- [ ] Article card component
- [ ] Category/tag filtering
- [ ] SEO per article (dynamic metadata from frontmatter)
- [ ] RSS feed (optional)

## Phase 3: LMS — Auth & User Foundation
- [ ] Create Supabase hosted project (supabase.com dashboard)
- [ ] Set up Auth (email/password + optional social)
- [ ] Install Supabase UI auth components (`Password-Based Auth`, `Social Auth`)
- [ ] Sign-in / sign-up pages
- [ ] Auth-gated layout for `(lms)` route group
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
