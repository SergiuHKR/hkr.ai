# PRODUCT.md — hkr.ai

Product constitution for hkr.ai. Defines what this product IS, what it is NOT, and the guardrails any AI must enforce.

**AI instruction:** Read this file before any architectural decision, schema change, or new feature. Push back if a request contradicts the constitution. Ask the user to explicitly confirm before proceeding with a deviation.

---

## What This Product IS

HKR.AI is a gamified corporate AI training platform that helps mid-market companies upskill their teams on real AI workflows. It combines a public-facing CMS (case studies and playbooks) with a private, org-gated LMS that uses Duolingo-style gamification (XP, levels, achievements, leaderboards, seasons) to drive engagement and course completion. The platform is dark-themed, developer-friendly, and built for teams of 10–500 people.

---

## What This Product Is NOT

- **Not a public MOOC** — there is no self-signup. Access is gated by org domain or email allowlist.
- **Not a content marketplace** — HKR creates all content. Users do not author or sell courses.
- **Not a generic LMS** — this platform is purpose-built for AI/automation training. It is not trying to compete with Udemy, Coursera, or Teachable.
- **Not a consulting CRM** — the articles (case studies) are marketing content, not project management tools.
- **Not a social network** — leaderboards and achievements exist for motivation, not socializing. There are no comments, DMs, or profiles visible to other users (beyond leaderboard rankings).
- **Not hkr.team** — hkr.ai is a separate product and brand. hkr.team is the legacy FTE outsourcing brand that will be absorbed over 3 years.

---

## Core User Journeys (must always work)

1. **Onboarding:** A new user from an org logs in via Google SSO → their email domain matches an org → they're auto-assigned to the org and default team → they see courses relevant to their role tags.
2. **Learning:** A user opens a course → navigates through modules and lessons → completes a lesson → earns XP → sees celebration animation → XP bar updates → new level/achievement unlocked if criteria met.
3. **Progress tracking:** A user visits their dashboard → sees current level, XP progress, earned badges, and recent activity at a glance.
4. **Competition:** A user visits the leaderboard → sees their rank among colleagues (overall, weekly, seasonal) → sees team standings → motivated to complete more lessons.
5. **Discovery:** A visitor lands on the public site → reads case studies → understands what HKR.AI offers → clicks "Get Started" to contact sales or log in.

---

## Non-Negotiables

- [x] The LMS must always be gamified (XP, levels, achievements, leaderboards, seasons)
- [x] Articles and courses are always separate content types with separate schemas
- [x] Course visibility is determined by tags, not direct user-course assignments
- [x] The platform is org-gated — no public self-signup
- [x] Dark mode is the only mode — no light theme
- [x] System roles and user tags are separate systems (roles = permissions, tags = content targeting)
- [x] Modules are a valid grouping layer — never flatten Course → Lesson
- [x] Mandatory courses are a soft UI flag only — never a hard gate
- [x] Streaks have been removed by design decision — do not re-introduce
- [x] All XP changes must be logged in `xp_transactions` (once built) — never update `total_xp` directly without a transaction record

---

## Schema

See `SCHEMA.md` for the canonical data model. Any feature that requires a new table or modifies existing fields must update `SCHEMA.md` first.

---

## Design Language

- Background: `#0A0A0A`
- Cards: `#171717` with border `#2A2A2A`
- Accent (green): `#3ECF8E` (hover: `#2BB57A`)
- Text primary: `#FFFFFF`
- Text muted: `#A1A1AA`
- Text tertiary: `#71717A`
- Fonts: DM Sans (body), DM Serif Display (headings/hero)
- Dark mode is the only mode
- Supabase-inspired aesthetic — clean, developer-friendly, minimal
- Green accent for all interactive/success states
- Cards use rounded-xl corners with subtle borders

---

## AI Guardrails

Push back (ask for explicit confirmation) if a request would:

- [ ] Remove or weaken gamification (XP, achievements, progress tracking)
- [ ] Merge articles and lessons into a single content type
- [ ] Add a system role that bypasses the two-layer role model
- [ ] Store XP totals without writing to `xp_transactions` (once built)
- [ ] Add a mandatory course enforcement gate (mandatory is a soft UI flag only)
- [ ] Change the tag-based course visibility system to a direct assignment model
- [ ] Flatten Course → Module → Lesson to Course → Lesson (modules are a valid grouping layer)
- [ ] Re-add streaks (streaks were removed by design decision — do not re-introduce without discussion)
- [ ] Use incorrect entity names — always use actual DB names per SCHEMA.md invariant #10 (e.g. `user_profiles` not `profiles`, `achievements` not `badges`, `total_xp` not `xp_total`)
- [ ] Add light mode or theme switching — dark mode is the only mode
- [ ] Allow public self-signup — the platform is org-gated by design
- [ ] Add social features (comments, DMs, user profiles visible to others beyond leaderboard)
