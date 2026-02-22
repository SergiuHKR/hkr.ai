# SCHEMA.md — hkr.ai

Canonical data model for hkr.ai. This is the source of truth for all entities, fields, and relationships.

**AI guardrail:** Before modifying any schema, check against this file. Push back if a change drops a core field, renames a table without updating this file, or introduces a concept that conflicts with the decisions documented here.

---

## Open Questions (decide before implementing)

- [ ] Quiz retries — unlimited, limited, or score-tracked unlimited?
- [ ] Levels/ranks — XP thresholds and names (Apprentice, Practitioner, Expert, etc.)
- [ ] Video storage — embedded URLs (YouTube/Vimeo) or Supabase Storage?
- [ ] Article tags — share the unified `tags` table or a separate `article_categories` table?
- [ ] Streaks removal — migration to drop `streaks` table, remove `current_streak`/`longest_streak` from `user_profiles`, remove UI components

---

## Core Mental Models

### Tag-based content targeting
Courses are not assigned to users directly. Instead:
- Courses have **tags** (e.g. `backend`, `ai-fundamentals`)
- Users have **tags** (their job role, e.g. `backend-developer`)
- A course is visible to a user if they share at least one tag, OR the course has no tags (general/public)

### Two-layer role system
Roles serve two completely separate purposes:

| Layer | Purpose | Type |
|-------|---------|------|
| System role | Controls permissions (what actions a user can take) | Enum on `user_profiles` |
| User tags | Controls content visibility (which courses a user sees) | Many-to-many via `user_tags` |

These must never be conflated. System roles are not tags.

### Course → Module → Lesson hierarchy
Modules are the grouping layer within courses. Do not flatten to Course → Lesson.

### Org-based access
The platform is org-gated. There is no public self-signup. Users gain access by matching their Google SSO email against an org's domain allowlist or email allowlist.

### Teams within orgs
Teams exist within orgs for leaderboard grouping and departmental organization.

---

## Built Entities

These tables exist in the database today (deployed via Supabase migrations).

### `courses`
A course is a collection of modules. Visibility will be determined by tags (not yet built).

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `slug` | `text` UNIQUE | |
| `title` | `text` | |
| `description` | `text` | |
| `tier` | `text` | `beginner \| intermediate \| advanced` (check constraint) |
| `cover_image` | `text` | |
| `is_published` | `bool` | Default `false` |
| `sort_order` | `int` | Default 0 |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

---

### `modules`
Sections within a course. Courses contain modules, modules contain lessons.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `course_id` | `uuid FK → courses` | `on delete cascade` |
| `slug` | `text` | Unique within course (composite `course_id, slug`) |
| `title` | `text` | |
| `description` | `text` | |
| `sort_order` | `int` | Default 0 |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

---

### `lessons`
Individual content pieces within a module.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `module_id` | `uuid FK → modules` | `on delete cascade` |
| `slug` | `text` | Unique within module (composite `module_id, slug`) |
| `title` | `text` | |
| `content_md` | `text` | Markdown content |
| `video_url` | `text` | Embed URL (TBD provider) |
| `duration_minutes` | `int` | Estimated reading/watching time |
| `xp_reward` | `int` | Default 10 |
| `sort_order` | `int` | Default 0 |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

---

### `user_progress`
Tracks which lessons a user has completed.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid FK → auth.users` | `on delete cascade` |
| `lesson_id` | `uuid FK → lessons` | `on delete cascade` |
| `completed_at` | `timestamptz` | Default `now()` |
| `xp_earned` | `int` | Default 0 |
| UNIQUE | `(user_id, lesson_id)` | |

---

### `organizations`
A company or team that uses the platform.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `name` | `text` | Display name |
| `slug` | `text` UNIQUE | URL-safe identifier |
| `logo_url` | `text` | |
| `created_at` | `timestamptz` | |

---

### `teams`
Departments within an organization. Used for team leaderboards.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `org_id` | `uuid FK → organizations` | `on delete cascade` |
| `name` | `text` | |
| `slug` | `text` | Unique within org (composite `org_id, slug`) |
| `created_at` | `timestamptz` | |

---

### `user_profiles`
Extends `auth.users`. Denormalized for fast leaderboard/dashboard reads.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid` UNIQUE | FK → `auth.users` (`on delete cascade`) |
| `org_id` | `uuid FK → organizations` | Null allowed (`on delete set null`) |
| `team_id` | `uuid FK → teams` | Null allowed (`on delete set null`) |
| `display_name` | `text` | |
| `avatar_url` | `text` | |
| `total_xp` | `int` | Default 0 |
| `current_streak` | `int` | Default 0. **Planned for removal** — see Open Questions |
| `longest_streak` | `int` | Default 0. **Planned for removal** — see Open Questions |
| `level` | `int` | Default 1 |
| `last_activity_date` | `date` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Note:** `user_id` is the FK to auth, `id` is the table's own PK. This differs from some Supabase patterns where `id` directly references `auth.users.id`.

---

### `seasons`
Quarterly periods for rankings and competitions.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `name` | `text` | e.g. "Season 1: Genesis" |
| `slug` | `text` UNIQUE | |
| `starts_at` | `date` | |
| `ends_at` | `date` | |
| `is_active` | `bool` | Default `false` |
| `created_at` | `timestamptz` | |

---

### `achievements`
Badge/achievement definitions. Both automatic (criteria-based) and manually grantable.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `slug` | `text` UNIQUE | |
| `title` | `text` | |
| `description` | `text` | |
| `icon` | `text` | Lucide icon name. Default `'award'` |
| `criteria_type` | `text` | `first_lesson \| course_complete \| streak \| xp_total \| lessons_per_day \| early_adopter` |
| `criteria_value` | `jsonb` | e.g. `{"days": 7}` or `{"xp": 100}` |
| `sort_order` | `int` | Default 0 |
| `created_at` | `timestamptz` | |

---

### `user_achievements`
Which achievements each user has earned.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid FK → auth.users` | `on delete cascade` |
| `achievement_id` | `uuid FK → achievements` | `on delete cascade` |
| `season_id` | `uuid FK → seasons` | Null allowed (`on delete set null`) |
| `earned_at` | `timestamptz` | Default `now()` |
| UNIQUE | `(user_id, achievement_id)` | |

---

### `streaks`
One row per user per active day. **Planned for removal** — see Open Questions.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid FK → auth.users` | `on delete cascade` |
| `activity_date` | `date` | Default `current_date` |
| `created_at` | `timestamptz` | |
| UNIQUE | `(user_id, activity_date)` | |

> **Streaks are deprecated.** Do not build new features on top of the streaks table or streak fields in `user_profiles`. A future migration will drop this table and remove `current_streak`/`longest_streak` from `user_profiles`.

---

### `season_rankings`
Snapshot of user rankings at season end.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `season_id` | `uuid FK → seasons` | `on delete cascade` |
| `user_id` | `uuid FK → auth.users` | `on delete cascade` |
| `rank` | `int` | |
| `xp_earned` | `int` | Default 0 |
| `created_at` | `timestamptz` | |
| UNIQUE | `(season_id, user_id)` | |

---

### Built Views

| View | Purpose |
|------|---------|
| `weekly_leaderboard` | XP earned in current week (Mon–Sun), per user |
| `team_leaderboard` | Aggregate XP per team |

---

## Planned Entities

These tables are designed but **not yet built**. They require migrations before use.

### `tags`
Unified tag entity. Used for both user job-role tags and course targeting tags.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `name` | `text` | Display name (e.g. `Backend Developer`) |
| `slug` | `text` UNIQUE | URL-safe (e.g. `backend-developer`) |
| `description` | `text` | Explain to admins what this tag means |
| `created_at` | `timestamptz` | |

---

### `user_tags`
Many-to-many: users ↔ tags (job roles / content targeting).

| Field | Type | Notes |
|-------|------|-------|
| `user_id` | `uuid FK → user_profiles` | |
| `tag_id` | `uuid FK → tags` | |
| PK | composite `(user_id, tag_id)` | |

---

### `course_tags`
Many-to-many: courses ↔ tags. Drives course visibility.

| Field | Type | Notes |
|-------|------|-------|
| `course_id` | `uuid FK → courses` | |
| `tag_id` | `uuid FK → tags` | |
| PK | composite `(course_id, tag_id)` | |

---

### `org_domains`
Domain-based SSO access. Any Google SSO with a matching email domain can join this org.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `org_id` | `uuid FK → organizations` | |
| `domain` | `text` | e.g. `acme.com` (no `@`) |
| `created_at` | `timestamptz` | |

---

### `org_allowlist`
Email-specific SSO access. Overrides domain rules for individual exceptions.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `org_id` | `uuid FK → organizations` | |
| `email` | `text` | Exact email address |
| `created_at` | `timestamptz` | |

---

### `org_course_settings`
Per-org course overrides. An org can mark a course as mandatory for their team.

| Field | Type | Notes |
|-------|------|-------|
| `org_id` | `uuid FK → organizations` | |
| `course_id` | `uuid FK → courses` | |
| `is_mandatory` | `bool` | Default `false`. Soft flag — shown in UI, not enforced |
| PK | composite `(org_id, course_id)` | |

---

### `xp_transactions`
Immutable audit log of all XP earned. Source of truth for `user_profiles.total_xp`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid FK → user_profiles` | |
| `amount` | `int` | Always positive |
| `reason` | `enum` | `lesson_completion \| course_completion \| achievement_grant \| manual` |
| `reference_id` | `uuid` | ID of the lesson, course, or achievement that triggered this |
| `created_at` | `timestamptz` | |

---

### `quiz_questions`
Questions inside a `quiz`-type lesson. Requires adding `type` enum to `lessons` first.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `lesson_id` | `uuid FK → lessons` | |
| `question` | `text` | The question text |
| `type` | `enum` | `multiple_choice_multi \| free_text` |
| `sort_order` | `int` | Order within quiz |

---

### `quiz_options`
Answer options for `multiple_choice_multi` questions.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `question_id` | `uuid FK → quiz_questions` | |
| `text` | `text` | Option label |
| `is_correct` | `bool` | Whether this option is a correct answer |
| `sort_order` | `int` | Display order |

---

### `user_quiz_submissions`
Records each quiz attempt. Supports multiple attempts (retries TBD).

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid FK → user_profiles` | |
| `lesson_id` | `uuid FK → lessons` | |
| `attempt_number` | `int` | 1-indexed |
| `answers` | `jsonb` | `{ question_id: [selected_option_ids] \| "free text" }` |
| `submitted_at` | `timestamptz` | |

---

### `user_task_submissions`
Records link submissions for `task`-type lessons. Requires adding `type` enum to `lessons` first.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid FK → user_profiles` | |
| `lesson_id` | `uuid FK → lessons` | |
| `submission_url` | `text` | GitHub repo, doc, etc. |
| `submitted_at` | `timestamptz` | |
| `reviewed_by` | `uuid FK → user_profiles` | Null until reviewed |
| `reviewed_at` | `timestamptz` | |

---

### `articles`
CMS content. Completely separate from LMS lessons. Currently stored as filesystem `.md` files in `content/articles/` — planned migration to Supabase.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `title` | `text` | |
| `slug` | `text` UNIQUE | |
| `excerpt` | `text` | Short summary for listing pages |
| `content_md` | `text` | Full article content (matches lesson field name) |
| `cover_image_url` | `text` | |
| `reading_time_minutes` | `int` | Estimated reading time |
| `author_id` | `uuid FK → user_profiles` | |
| `published_at` | `timestamptz` | Null = draft |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**TOC:** Generated dynamically at render time from H2/H3 headings in `content_md`. Not stored.

---

### `article_tags`
Many-to-many: articles ↔ tags. Used for CMS filtering and discovery.

> **Open question:** Do article tags share the unified `tags` table (same tags as courses/users) or a separate `article_categories` table? Decide based on whether content tags and job-role tags should overlap.

| Field | Type | Notes |
|-------|------|-------|
| `article_id` | `uuid FK → articles` | |
| `tag_id` | `uuid FK → tags` | |
| PK | composite `(article_id, tag_id)` | |

---

## Relationships Diagram

```
organizations
  ├── teams (1:many)
  │     └── user_profiles.team_id (many:1)
  └── user_profiles.org_id (many:1)

user_profiles
  ├── user_progress ──→ lessons ←── modules ←── courses
  ├── user_achievements ──→ achievements
  ├── season_rankings ──→ seasons
  ├── [planned] user_tags (many:many) ──→ tags ←── course_tags ←── courses
  ├── [planned] xp_transactions
  ├── [planned] user_quiz_submissions ──→ lessons
  └── [planned] user_task_submissions ──→ lessons

courses
  └── modules (1:many)
        └── lessons (1:many)
              ├── [planned] quiz_questions
              │     └── quiz_options
              └── (content fields vary by lesson type — type enum planned)

[planned] org_domains ──→ organizations
[planned] org_allowlist ──→ organizations
[planned] org_course_settings ──→ organizations + courses

[planned] articles ──→ article_tags ──→ tags

[deprecated] streaks ──→ auth.users
```

---

## Key Invariants (push back if violated)

1. **System role and tags are separate** — never use tags to control permissions
2. **Course visibility is tag-derived** — do not add a direct org→course assignment table without discussing
3. **`mandatory` is soft** — never enforce course completion as a hard gate
4. **XP is always logged** — once `xp_transactions` is built, never update `user_profiles.total_xp` directly without writing an `xp_transactions` row
5. **Articles and lessons are separate entities** — an article cannot be a lesson; they have different schemas and purposes
6. **One org per user** (except future admins who may have `org_id = null` and sudo access)
7. **Modules are the grouping layer within courses** — do not flatten to Course → Lesson
8. **Teams exist within orgs** for leaderboard grouping — do not remove this layer
9. **Streaks are deprecated** — do not build new features on the `streaks` table or streak fields. A removal migration is planned.
10. **Use actual DB names in code** — `user_profiles` (not `profiles`), `achievements` (not `badges`), `user_progress` (not `user_lesson_progress`), `total_xp` (not `xp_total`), `content_md` (not `body_markdown`), `sort_order` (not `position`)
