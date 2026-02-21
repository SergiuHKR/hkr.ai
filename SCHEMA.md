# SCHEMA.md — hkr.ai

Canonical data model for hkr.ai. This is the source of truth for all entities, fields, and relationships.

**AI guardrail:** Before modifying any schema, check against this file. Push back if a change drops a core field, renames a table without updating this file, or introduces a concept that conflicts with the decisions documented here.

---

## Open Questions (decide before implementing)

- [ ] Quiz retries — unlimited, limited, or score-tracked unlimited?
- [ ] Levels/ranks — XP thresholds and names (Apprentice, Practitioner, Expert, etc.)
- [ ] Video storage — embedded URLs (YouTube/Vimeo) or Supabase Storage?
- [ ] Article tags — share the unified `tags` table or a separate `article_categories` table?

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
| System role | Controls permissions (what actions a user can take) | Enum on `profiles` |
| User tags | Controls content visibility (which courses a user sees) | Many-to-many via `user_tags` |

These must never be conflated. System roles are not tags.

### Org-based access
The platform is org-gated. There is no public self-signup. Users gain access by matching their Google SSO email against an org's domain allowlist or email allowlist.

---

## Entities

### `profiles`
Extends Supabase `auth.users`. One row per authenticated user.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | References `auth.users.id` |
| `email` | `text` | Synced from auth |
| `full_name` | `text` | |
| `avatar_url` | `text` | |
| `system_role` | `enum` | `super_admin \| admin \| team_leader \| user` |
| `org_id` | `uuid FK → organizations` | Null for super_admin and admin |
| `xp_total` | `int` | Default 0 |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**System role permissions:**
- `super_admin` — unique; can CRUD admins; full platform access
- `admin` — can create organizations; can sudo into any org; cannot delete other admins
- `team_leader` — org-scoped; can CRUD users within their org
- `user` — can only consume learning content

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
| `updated_at` | `timestamptz` | |

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
| `user_id` | `uuid FK → profiles` | |
| `tag_id` | `uuid FK → tags` | |
| PK | composite `(user_id, tag_id)` | |

---

### `courses`
A course is a collection of lessons. Visibility is determined by tags.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `title` | `text` | |
| `slug` | `text` UNIQUE | |
| `description` | `text` | |
| `cover_image_url` | `text` | |
| `created_by` | `uuid FK → profiles` | Admin who created it |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Visibility logic (not stored, derived):**
- If a course has no tags → visible to all users (general course)
- If a course has tags → visible only to users who share at least one tag

---

### `course_tags`
Many-to-many: courses ↔ tags. Drives course visibility.

| Field | Type | Notes |
|-------|------|-------|
| `course_id` | `uuid FK → courses` | |
| `tag_id` | `uuid FK → tags` | |
| PK | composite `(course_id, tag_id)` | |

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

### `lessons`
A single learning unit inside a course. Position determines order.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `course_id` | `uuid FK → courses` | |
| `title` | `text` | |
| `slug` | `text` | Unique within course |
| `position` | `int` | Order within course |
| `type` | `enum` | `text \| video \| quiz \| task` |
| `body_markdown` | `text` | Used by `text` lessons |
| `video_url` | `text` | Used by `video` lessons (embed URL — TBD) |
| `xp_reward` | `int` | XP awarded on completion. Default e.g. 10 |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

---

### `quiz_questions`
Questions inside a `quiz`-type lesson.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `lesson_id` | `uuid FK → lessons` | |
| `question` | `text` | The question text |
| `type` | `enum` | `multiple_choice_multi \| free_text` |
| `position` | `int` | Order within quiz |

---

### `quiz_options`
Answer options for `multiple_choice_multi` questions.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `question_id` | `uuid FK → quiz_questions` | |
| `text` | `text` | Option label |
| `is_correct` | `bool` | Whether this option is a correct answer |
| `position` | `int` | Display order |

---

### `user_lesson_progress`
Tracks each user's completion status per lesson.

| Field | Type | Notes |
|-------|------|-------|
| `user_id` | `uuid FK → profiles` | |
| `lesson_id` | `uuid FK → lessons` | |
| `status` | `enum` | `not_started \| completed` |
| `completed_at` | `timestamptz` | Null if not completed |
| PK | composite `(user_id, lesson_id)` | |

---

### `user_quiz_submissions`
Records each quiz attempt. Supports multiple attempts (retries TBD).

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid FK → profiles` | |
| `lesson_id` | `uuid FK → lessons` | |
| `attempt_number` | `int` | 1-indexed |
| `answers` | `jsonb` | `{ question_id: [selected_option_ids] \| "free text" }` |
| `submitted_at` | `timestamptz` | |

---

### `user_task_submissions`
Records link submissions for `task`-type lessons.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid FK → profiles` | |
| `lesson_id` | `uuid FK → lessons` | |
| `submission_url` | `text` | GitHub repo, doc, etc. |
| `submitted_at` | `timestamptz` | |
| `reviewed_by` | `uuid FK → profiles` | Null until reviewed |
| `reviewed_at` | `timestamptz` | |

---

### `xp_transactions`
Immutable audit log of all XP earned. Source of truth for `profiles.xp_total`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid FK → profiles` | |
| `amount` | `int` | Always positive |
| `reason` | `enum` | `lesson_completion \| course_completion \| badge_grant \| manual` |
| `reference_id` | `uuid` | ID of the lesson, course, or badge that triggered this |
| `created_at` | `timestamptz` | |

---

### `badges`
Badge definitions. Both automatic (rule-based) and manually grantable.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `name` | `text` | |
| `description` | `text` | |
| `image_url` | `text` | |
| `trigger_type` | `enum` | `lesson_count \| course_completion \| xp_threshold \| manual` |
| `trigger_value` | `jsonb` | e.g. `{"count": 10}` or `{"course_id": "..."}` or `{"xp": 500}` |
| `xp_reward` | `int` | XP awarded when this badge is earned (can be 0) |
| `created_at` | `timestamptz` | |

---

### `user_badges`
Which badges each user has earned.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid FK → profiles` | |
| `badge_id` | `uuid FK → badges` | |
| `granted_at` | `timestamptz` | |
| `granted_by` | `uuid FK → profiles` | Null if auto-earned |

---

### `articles`
CMS content. Completely separate from LMS lessons.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` PK | |
| `title` | `text` | |
| `slug` | `text` UNIQUE | |
| `excerpt` | `text` | Short summary for listing pages |
| `body_markdown` | `text` | Full article content |
| `cover_image_url` | `text` | |
| `reading_time_minutes` | `int` | Estimated reading time |
| `author_id` | `uuid FK → profiles` | |
| `published_at` | `timestamptz` | Null = draft |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**TOC:** Generated dynamically at render time from H2/H3 headings in `body_markdown`. Not stored.

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
  ├── org_domains (1:many)
  ├── org_allowlist (1:many)
  ├── org_course_settings (1:many) ──→ courses
  └── profiles (1:many)
        ├── user_tags (many:many) ──→ tags ←── course_tags ←── courses
        ├── user_lesson_progress ──→ lessons ←── courses
        ├── user_quiz_submissions ──→ lessons
        ├── user_task_submissions ──→ lessons
        ├── xp_transactions
        └── user_badges ──→ badges

articles ──→ article_tags ──→ tags
lessons
  ├── quiz_questions
  │     └── quiz_options
  └── (content fields vary by lesson.type)
```

---

## Key Invariants (push back if violated)

1. **System role and tags are separate** — never use tags to control permissions
2. **Course visibility is tag-derived** — do not add a direct org→course assignment table without discussing
3. **`mandatory` is soft** — never enforce course completion as a hard gate
4. **XP is always logged** — never update `profiles.xp_total` directly without writing an `xp_transactions` row
5. **Articles and lessons are separate entities** — an article cannot be a lesson; they have different schemas and purposes
6. **One org per user** (except admins who have `org_id = null` and sudo access)
