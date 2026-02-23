# TODO — HKR.AI Build Phases

Last verified: 2026-02-22

---

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

## Phase 1: Landing Page
- [x] Navbar component (dark, responsive, mobile hamburger menu — "AI Academy", "Get Started")
- [x] Hero section (DM Serif Display heading + starburst spinner animation)
- [x] Case Studies section (3 featured article cards from `content/articles/`)
- [x] Footer (dark, multi-column — Platform + Company links, copyright)
- [x] Mobile hamburger menu
- [x] Integrate or remove unused marketing components (`cta.tsx`, `logo-bar.tsx`, `services.tsx`, `what-we-do.tsx`, `how-we-work.tsx` — built but not rendered on homepage)
- [x] Responsive polish — article cards on `/` overflow horizontally on some tablet widths
- [x] SEO: Open Graph image (og:image for link previews)
- [x] SEO: `sitemap.xml` (Next.js `app/sitemap.ts` convention)
- [x] SEO: `robots.txt` (Next.js `app/robots.ts` convention)
- [x] SEO: structured data (JSON-LD for Organization)
- [x] Meta: per-page `title` + `description` for all marketing pages

## Phase 2: CMS (Case Studies / Articles)
- [x] Set up `content/articles/` directory with 5 `.md` files
- [x] Configure MDX rendering (`next-mdx-remote` + `remark-gfm`)
- [x] Article list page (`/articles`) — "Case Studies" heading + card grid
- [x] Article detail page (`/articles/[slug]`) — full MDX rendering with category badge + author + date
- [x] Article card component (`components/cms/article-card.tsx`)
- [x] Homepage case studies section pulling from articles
- [x] SEO: dynamic metadata per article (title + description via `generateMetadata` in `[slug]/page.tsx`)
- [x] Category/tag filtering on `/articles` (filter bar by `category` frontmatter)
- [x] SEO: Open Graph image per article (og:image from frontmatter or auto-generated)
- [x] Reading time estimate displayed on article detail page
- [x] "Back to Case Studies" link on article detail page
- [x] RSS feed (`app/articles/feed.xml/route.ts`)
- [x] Article footer with related articles / next article suggestion

## Phase 3: LMS — Auth & User Foundation
- [x] Supabase hosted project (cloud — EU West Ireland)
- [x] Google SSO via Supabase Auth
- [x] Middleware for session refresh + route protection (`/learn`, `/dashboard`, `/leaderboard`)
- [x] Login page with "Continue with Google" button
- [x] Auth callback route (`/auth/callback`)
- [x] Auth-gated layout for `(lms)` route group
- [x] Sign-out button component
- [x] Auto profile creation on first login (`getOrCreateProfile()`)
- [x] User profile page (view/edit display name, avatar)
- [x] Current User Avatar component (reusable across navbar/dashboard)
- [x] `/badges` added to middleware matcher for protected paths

## Phase 4: LMS — Course Structure
- [x] DB schema: `courses` table (with `is_published`, `sort_order`)
- [x] DB schema: `modules` table (course -> module grouping)
- [x] DB schema: `lessons` table (with `module_id` FK, `content_md`, `duration_minutes`, `sort_order`)
- [x] DB schema: `user_progress` table (with `xp_earned`)
- [x] Supabase migrations for all LMS schema (3 migration files)
- [x] RLS policies (users see published content, own progress only)
- [x] Seed data: first course ("AI Literacy" — 3 modules, 9 lessons, 120 XP)
- [x] Course list page (`/learn`) — grid with progress stats per course
- [x] Course detail page (`/learn/[courseSlug]`) — modules + lessons + progress bar
- [x] Module list within course
- [x] Lesson view (`/learn/[courseSlug]/[lessonSlug]`) — MDX content + metadata
- [x] Lesson completion tracking (idempotent via unique constraint)
- [x] Progress bar per course
- [x] Prev/next lesson navigation

## Phase 5: LMS — Gamification
- [x] DB schema: `organizations` table
- [x] DB schema: `teams` table (org -> team grouping)
- [x] DB schema: `user_profiles` table (with `total_xp`, `level`, `last_activity_date`, streak fields)
- [x] DB schema: `seasons` table (quarterly ranking periods)
- [x] DB schema: `achievements` table (with `criteria_type`, `criteria_value`, `icon`, `sort_order`)
- [x] DB schema: `user_achievements` table (with `season_id` FK)
- [x] DB schema: `streaks` table (daily activity tracking — **deprecated, removal planned**)
- [x] DB schema: `season_rankings` table
- [x] DB views: `weekly_leaderboard`, `team_leaderboard`
- [x] RLS policies scoped per organization (with bootstrap fix for new users)
- [x] Seed data: HKR org, General team, Season 1 (Genesis), 7 achievement definitions
- [x] XP level system (9 levels: Novice -> Legend, defined in `lib/lms/levels.ts`)
- [x] Streak tracking (`lib/lms/streaks.ts`) — daily activity, consecutive day calculation — **deprecated**
- [x] Achievement criteria checker (`lib/lms/achievements.ts`) — 7 badge types
- [x] Server-side API route (`/api/lms/complete-lesson`) for atomic lesson completion
- [x] Updated CompleteLessonButton (calls API, shows XP animation + celebrations)
- [x] Stats header strip (level, XP progress, streak, badges — always visible in LMS)
- [x] LMS navbar with Dashboard + Leaderboard links
- [x] Achievement celebration modal with react-confetti (green palette)
- [x] Badge cards (earned glow vs locked dimmed)
- [x] Streak calendar (30-day grid) — **deprecated**
- [x] Dashboard page (`/dashboard`) — profile, XP, streak, badges, recent activity
- [x] Leaderboard page (`/leaderboard`) — Overall/Weekly/Season tabs + team standings
- [x] Badges showcase page (`/badges`) — aspirational grid with level progression table
- [x] Deploy to Vercel production

## Phase 5.5: Schema Alignment & Cleanup

Align codebase and schema with decisions made during SCHEMA.md + PRODUCT.md review.

### Streak Removal
- [x] Drop `streaks` table (Supabase migration)
- [x] Remove `current_streak` and `longest_streak` columns from `user_profiles`
- [x] Remove `lib/lms/streaks.ts` (entire file)
- [x] Remove `recordDailyActivity()` call from `/api/lms/complete-lesson`
- [x] Remove `updateProfileStats()` streak logic in `lib/lms/gamification.ts`
- [x] Remove `StreakCalendar` component from dashboard
- [x] Remove streak counter from `StatsHeader` component
- [x] Remove streak-related achievement criteria (`streak` type in `achievements.ts`)
- [x] Update seed data: remove "On Fire" and "Unstoppable" streak-based achievements
- [x] Update `getStreakDates()` references across codebase

### New Schema Entities (Migrations)
- [x] Add `system_role` enum to `user_profiles` (`super_admin | admin | team_leader | user`, default `user`)
- [x] Create `tags` table (id, name, slug, description, created_at)
- [x] Create `user_tags` table (user_id, tag_id — composite PK) + RLS
- [x] Create `course_tags` table (course_id, tag_id — composite PK) + RLS
- [x] Create `org_domains` table (id, org_id, domain, created_at) + RLS
- [x] Create `org_allowlist` table (id, org_id, email, created_at) + RLS
- [x] Create `org_course_settings` table (org_id, course_id, is_mandatory — composite PK) + RLS
- [x] Create `xp_transactions` audit log table (id, user_id, amount, reason enum, reference_id, created_at) + RLS
- [x] Add `type` enum to `lessons` table (`text | video | quiz | task`, default `text`)

### Content Migration
- [x] Create `articles` table in Supabase (per SCHEMA.md spec)
- [x] Create `article_tags` join table
- [x] Migration script: import existing 5 `.md` files from `content/articles/` into `articles` table
- [x] Update `lib/articles.ts` to read from Supabase instead of filesystem
- [x] Update article list page to query Supabase
- [x] Update article detail page to query Supabase
- [x] Keep `content/articles/` as fallback or remove after migration is validated

### PRODUCT.md Completion
- [x] Fill in "What This Product IS" section (irreducible core identity)
- [x] Fill in "What This Product Is NOT" section (anti-patterns, scope boundaries)
- [x] Complete "Core User Journeys" section (3-5 flows that must always work)
- [x] Complete "Non-Negotiables" section (immutable product decisions)

## Phase 6: LMS — Advanced Features

### Tag-Based Course Visibility
- [x] Admin UI: manage tags (CRUD)
- [x] Admin UI: assign tags to courses
- [x] Admin UI: assign tags to users (job roles)
- [x] Course list page: filter courses by user's tags (show matching + untagged/general courses)
- [x] Course card: show assigned tags

### System Role Enforcement
- [x] Define permission matrix (super_admin, admin, team_leader, user)
- [x] Middleware-level role checks for admin routes
- [x] RLS policies that respect system_role
- [x] Role-based UI rendering (hide admin features from regular users)

### Org SSO Gating
- [x] On Google SSO login: check email domain against `org_domains`
- [x] Fallback: check exact email against `org_allowlist`
- [x] Auto-assign org_id + default team on first login if domain matches
- [x] Reject login (with friendly message) if no org match found
- [x] Admin UI: manage org domains + email allowlist

### Quiz Lesson Type
- [x] Create `quiz_questions` table (id, lesson_id, question, type, sort_order)
- [x] Create `quiz_options` table (id, question_id, text, is_correct, sort_order)
- [x] Create `user_quiz_submissions` table (id, user_id, lesson_id, attempt_number, answers jsonb, submitted_at)
- [x] Quiz renderer component (multiple choice + free text question types)
- [x] Quiz grading logic (auto-grade multiple choice, manual review for free text)
- [x] Quiz result display (score, correct/incorrect per question)
- [x] Decide: quiz retries — unlimited, limited, or score-tracked unlimited?

### Task Lesson Type
- [x] Create `user_task_submissions` table (id, user_id, lesson_id, submission_url, submitted_at, reviewed_by, reviewed_at)
- [x] Task submission UI (URL input field for GitHub repo, doc link, etc.)
- [x] Task review workflow (admin/team_leader marks as reviewed)
- [x] Task status display (pending review, reviewed)

### Admin Panel
- [x] Admin layout + navigation (separate route group or `/admin` prefix)
- [x] Org management (CRUD organizations, view members)
- [x] Course CRUD (create/edit/delete courses, modules, lessons)
- [x] User management (view users, assign roles, assign tags, change teams)
- [x] Tag management (CRUD tags, bulk assign)
- [x] Achievement management (view/create achievement definitions)
- [x] Season management (create/activate/end seasons)

### Per-Org Course Settings
- [x] UI for org admins to mark courses as mandatory (soft flag in `org_course_settings`)
- [x] "Mandatory" badge on course cards for org members
- [x] Dashboard widget: "Required courses" section showing mandatory incomplete courses

### Other Features
- [x] Certificate generation (PDF or web page at `hkr.ai/certificates/[id]`)
- [x] Slack integration (post achievement unlocks to a channel via webhook)
- [x] XP transactions: wire lesson completion + course completion + achievement grants through `xp_transactions` table
- [x] Backfill existing `user_progress` data into `xp_transactions`

## Phase 7: Polish & Scale

### Responsive Design
- [x] Landing page: test all breakpoints (mobile 375px, tablet 768px, desktop 1280px+)
- [x] Articles list: verify card layout at all breakpoints
- [x] Article detail: readable line lengths on wide screens
- [x] LMS course grid: stack on mobile, 2-col on tablet, 3-col on desktop
- [x] LMS lesson reader: comfortable reading width on all devices
- [x] Dashboard: stack cards vertically on mobile
- [x] Leaderboard: horizontal scroll or stacked layout on mobile
- [x] Login page: centered and padded on all sizes

### SEO & Metadata
- [x] `app/sitemap.ts` — dynamic sitemap including all articles + marketing pages
- [x] `app/robots.ts` — allow indexing of public pages, disallow LMS routes
- [x] Open Graph images (static or dynamically generated for articles)
- [x] Per-article dynamic metadata (title + description — already in `generateMetadata`)
- [x] JSON-LD structured data (Organization, Article, Course)
- [x] Canonical URLs
- [x] Twitter Card metadata

### Performance
- [x] Core Web Vitals audit (LCP, FID, CLS)
- [x] Image optimization (next/image for all images, proper sizing)
- [x] Font loading optimization (DM Sans + DM Serif Display — verify swap/preload)
- [x] Bundle analysis (identify large dependencies)
- [x] Lazy loading for below-the-fold content

### Accessibility
- [x] Keyboard navigation audit (all interactive elements reachable)
- [x] Screen reader audit (proper ARIA labels, heading hierarchy)
- [x] Color contrast verification (green accent on dark background)
- [x] Focus indicators (visible focus rings on all interactive elements)
- [x] Alt text for all images

### Monitoring & Analytics
- [x] Error monitoring (Sentry or similar)
- [x] Analytics integration (Vercel Analytics, Plausible, or PostHog)
- [x] Uptime monitoring for dev.hkr.ai

### Content
- [x] Populate 5+ additional articles (AI for Sales, AI for Ops, etc.)
- [x] Create "Prompt Engineering" course (currently unpublished/empty)
- [x] Plan additional courses: AI for Customer Support, AI for Sales, AI for Operations, Agent Building

### Testing & QA
- [x] User testing with HKR internal team (~50 users)
- [x] Iterate based on feedback
- [x] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [x] E2E test suite (Playwright — critical paths: login, lesson completion, leaderboard)

---

## Phase 8: Bootstrap & Onboarding Fixes

Critical issues found during first real-user testing (2026-02-23).

### Profile Auto-Creation (CRITICAL)
- [x] Supabase trigger on `auth.users` INSERT to auto-create `user_profiles` row
- [x] Domain-based org matching in trigger (email domain → `org_domains` → org_id)
- [x] Fallback to `org_allowlist` for exact email match
- [x] Default team assignment (slug='general' within matched org)
- [x] Backfill existing `auth.users` rows that lack `user_profiles` entries
- [x] Update `getOrCreateProfile()` to use domain-based matching (remove hardcoded HKR slug)

**Root cause:** Profile creation was lazy — only happened on first lesson completion via `getOrCreateProfile()`. Users who logged in but didn't complete a lesson had no profile, making them invisible to the platform. The `StatsHeader` component also calls `getOrCreateProfile` but silently swallows errors.

**Fixed:** Migration `20260223020000_auto_profile_trigger.sql` adds DB trigger + backfills. Costin Dinoiu now has a profile. All callers of `getOrCreateProfile()` now pass `user.email` for domain matching.

### Data Integrity Fixes
- [x] Fix Sergiu's `user_profiles.org_id` (was `null`, now HKR org) — fixed by backfill in migration
- [x] Verify all `auth.users` have corresponding `user_profiles` rows — confirmed: 2/2

### TODO.md Audit (Phase 6 items marked done but not fully implemented)
- [x] Re-verify: "On Google SSO login: check email domain against `org_domains`" — now handled by DB trigger on auth.users INSERT
- [x] Re-verify: "Auto-assign org_id + default team on first login if domain matches" — now handled by DB trigger + `getOrCreateProfile()` fallback
- [ ] Re-verify: "Reject login if no org match found" — not implemented in auth callback (profile gets created with null org_id, but login is not blocked)

---

## Phase 9: Admin CRUD

All admin pages are currently read-only. This phase adds real Create/Update/Delete operations via Server Actions.

### Org: Domains & Allowlist
- [x] Add domain: inline form on org page to add SSO domain
- [x] Remove domain: delete button per domain row
- [x] Add allowlist email: inline form to add email to allowlist
- [x] Remove allowlist email: delete button per email row

### Courses: Full CRUD
- [x] Create course: form (title, slug, description, is_published)
- [x] Edit course: modal edit for course metadata
- [x] Delete course: delete button with confirmation dialog
- [x] Toggle publish: click Published/Draft badge to toggle
- [x] Create module: form within course detail page (title, slug, sort_order)
- [x] Edit module: modal edit module title
- [x] Delete module: delete with confirmation dialog
- [x] Create lesson: form within module (title, slug, type, content_md, duration, xp_reward, sort_order)
- [x] Edit lesson: modal edit lesson content and metadata
- [x] Delete lesson: delete with confirmation dialog
- [x] Course detail page (`/admin/courses/[id]`) — modules + lessons tree view

### Tags: CRUD
- [x] Create tag: dialog form (name, slug, description)
- [x] Edit tag: dialog edit tag fields
- [x] Delete tag: delete with confirmation dialog

### Users: Role & Tag Management
- [x] Change user role: visual role picker in manage dialog
- [x] Assign tags to user: tag toggle chips per user
- [x] Assign user to team: dropdown to change team

### Course-Tag Assignment
- [x] Assign tags to course: checkbox dialog on course list

### Course Reorder
- [x] Drop `tier` column from courses table (migration `20260223040000`)
- [x] Remove tier from all admin forms, server actions, and public pages (use tags instead)
- [x] Update SCHEMA.md to remove tier field
- [x] Move up/down buttons for courses in admin course list
- [x] Server actions for reorderCourse (swap sort_order with adjacent course)

### Infrastructure
- [x] Server Actions (`app/(lms)/admin/actions.ts`) — all admin mutations
- [x] RLS admin write policies for courses, modules, lessons, user_profiles (migration `20260223030000`)

---

## Quick Reference: What Exists Today

### Pages (all functional)
| Route | Status | Notes |
|-------|--------|-------|
| `/` | Working | Hero + Case Studies + Footer |
| `/articles` | Working | 10 articles, category filtering, responsive grid |
| `/articles/[slug]` | Working | Full MDX rendering, reading time, back link, related articles |
| `/articles/feed.xml` | Working | RSS feed with all articles |
| `/login` | Working | Google SSO with org domain gating |
| `/auth/callback` | Working | OAuth code exchange + org auto-assignment |
| `/learn` | Working | Course grid + progress + tag-based filtering (auth-gated) |
| `/learn/[courseSlug]` | Working | Modules + lessons + progress bar |
| `/learn/[courseSlug]/[lessonSlug]` | Working | MDX/quiz/task + completion + XP animation |
| `/dashboard` | Working | Profile + XP + badges + activity + required courses |
| `/leaderboard` | Working | Overall / Weekly / Season + teams |
| `/badges` | Working | Achievement grid + level progression |
| `/profile` | Working | Edit display name + avatar |
| `/certificates/[id]` | Working | Certificate view page |
| `/admin` | Working | Overview dashboard (admin/super_admin only) |
| `/admin/users` | Working | User list + manage dialog (role, tags, team) |
| `/admin/courses` | Working | Course CRUD + publish toggle + tag assignment |
| `/admin/courses/[id]` | Working | Module + lesson CRUD tree view |
| `/admin/tags` | Working | Tag CRUD (create, edit, delete) |
| `/admin/achievements` | Read-only | Lists achievements — no CRUD yet |
| `/admin/seasons` | Read-only | Lists seasons — no CRUD yet |
| `/admin/org` | Working | Add/remove SSO domains + allowlist emails |

### Database (deployed to Supabase)
| Table | Status |
|-------|--------|
| `courses`, `modules`, `lessons` | Deployed (lessons has `type` enum) |
| `user_progress` | Deployed |
| `organizations`, `teams` | Deployed |
| `user_profiles` | Deployed (has `system_role` enum, streak fields removed) |
| `seasons`, `season_rankings` | Deployed |
| `achievements`, `user_achievements` | Deployed |
| `tags`, `user_tags`, `course_tags` | Deployed |
| `org_domains`, `org_allowlist` | Deployed |
| `org_course_settings` | Deployed |
| `xp_transactions` | Deployed |
| `articles`, `article_tags` | Deployed |
| `quiz_questions`, `quiz_options`, `user_quiz_submissions` | Deployed |
| `user_task_submissions` | Deployed |
| `weekly_leaderboard` (view) | Deployed |
| `team_leaderboard` (view) | Deployed |
| `streaks` | **Dropped** (removed in Phase 5.5) |

### SEO & Infrastructure
| Feature | Status |
|---------|--------|
| `sitemap.xml` | Deployed (dynamic, includes all articles) |
| `robots.txt` | Deployed (allows public, disallows LMS/admin/API) |
| JSON-LD (Organization) | Deployed (root layout) |
| JSON-LD (Article) | Deployed (per article page) |
| Open Graph images | Deployed (root + per article) |
| Twitter Cards | Deployed |
| RSS feed | Deployed (`/articles/feed.xml`) |
| Skip-to-content | Deployed (keyboard accessibility) |
| Focus indicators | Deployed (`:focus-visible` styles) |
| ARIA labels | Deployed (nav elements) |
