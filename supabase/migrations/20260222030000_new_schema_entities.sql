-- Phase 5.5: New schema entities per SCHEMA.md

-- 1. Add system_role to user_profiles
DO $$ BEGIN
  CREATE TYPE system_role AS ENUM ('super_admin', 'admin', 'team_leader', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS system_role system_role NOT NULL DEFAULT 'user';

-- 2. Add lesson type enum
DO $$ BEGIN
  CREATE TYPE lesson_type AS ENUM ('text', 'video', 'quiz', 'task');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS type lesson_type NOT NULL DEFAULT 'text';

-- 3. Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. User tags (many-to-many: users <-> tags)
CREATE TABLE IF NOT EXISTS user_tags (
  user_id uuid NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, tag_id)
);

-- 5. Course tags (many-to-many: courses <-> tags)
CREATE TABLE IF NOT EXISTS course_tags (
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, tag_id)
);

-- 6. Org domains (domain-based SSO access)
CREATE TABLE IF NOT EXISTS org_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  domain text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, domain)
);

-- 7. Org allowlist (email-specific SSO access)
CREATE TABLE IF NOT EXISTS org_allowlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, email)
);

-- 8. Org course settings (per-org course overrides)
CREATE TABLE IF NOT EXISTS org_course_settings (
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  is_mandatory boolean NOT NULL DEFAULT false,
  PRIMARY KEY (org_id, course_id)
);

-- 9. XP transactions (immutable audit log)
DO $$ BEGIN
  CREATE TYPE xp_reason AS ENUM ('lesson_completion', 'course_completion', 'achievement_grant', 'manual');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS xp_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  amount int NOT NULL CHECK (amount > 0),
  reason xp_reason NOT NULL,
  reference_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created ON xp_transactions(created_at);

-- 10. Articles table (CMS content in DB)
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content_md text NOT NULL,
  cover_image_url text,
  reading_time_minutes int,
  author_id uuid REFERENCES user_profiles(user_id) ON DELETE SET NULL,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);

-- 11. Article tags (many-to-many: articles <-> tags)
CREATE TABLE IF NOT EXISTS article_tags (
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- 12. Quiz questions
DO $$ BEGIN
  CREATE TYPE question_type AS ENUM ('multiple_choice_multi', 'free_text');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question text NOT NULL,
  type question_type NOT NULL DEFAULT 'multiple_choice_multi',
  sort_order int NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_lesson ON quiz_questions(lesson_id);

-- 13. Quiz options
CREATE TABLE IF NOT EXISTS quiz_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  text text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_quiz_options_question ON quiz_options(question_id);

-- 14. User quiz submissions
CREATE TABLE IF NOT EXISTS user_quiz_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  attempt_number int NOT NULL DEFAULT 1,
  answers jsonb NOT NULL DEFAULT '{}',
  submitted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_user ON user_quiz_submissions(user_id, lesson_id);

-- 15. User task submissions
CREATE TABLE IF NOT EXISTS user_task_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  submission_url text NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES user_profiles(user_id) ON DELETE SET NULL,
  reviewed_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_task_submissions_user ON user_task_submissions(user_id, lesson_id);

-- ============================================================
-- RLS Policies
-- ============================================================

-- Tags: everyone can read, admins can write
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_read" ON tags FOR SELECT USING (true);
CREATE POLICY "tags_write" ON tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.system_role IN ('super_admin', 'admin')
  )
);

-- User tags: users see own, admins see all
ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_tags_own" ON user_tags FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "user_tags_admin" ON user_tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.system_role IN ('super_admin', 'admin')
  )
);

-- Course tags: everyone reads, admins write
ALTER TABLE course_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "course_tags_read" ON course_tags FOR SELECT USING (true);
CREATE POLICY "course_tags_admin" ON course_tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.system_role IN ('super_admin', 'admin')
  )
);

-- Org domains: admins only
ALTER TABLE org_domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_domains_admin" ON org_domains FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.system_role IN ('super_admin', 'admin')
  )
);

-- Org allowlist: admins only
ALTER TABLE org_allowlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_allowlist_admin" ON org_allowlist FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.system_role IN ('super_admin', 'admin')
  )
);

-- Org course settings: org members read, admins write
ALTER TABLE org_course_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_course_settings_read" ON org_course_settings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.org_id = org_course_settings.org_id
  )
);
CREATE POLICY "org_course_settings_admin" ON org_course_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.system_role IN ('super_admin', 'admin')
  )
);

-- XP transactions: users see own
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "xp_transactions_own" ON xp_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "xp_transactions_insert" ON xp_transactions FOR INSERT WITH CHECK (user_id = auth.uid());

-- Articles: public read, admins write
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles_read" ON articles FOR SELECT USING (published_at IS NOT NULL);
CREATE POLICY "articles_admin" ON articles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.system_role IN ('super_admin', 'admin')
  )
);

-- Article tags: public read, admins write
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "article_tags_read" ON article_tags FOR SELECT USING (true);
CREATE POLICY "article_tags_admin" ON article_tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.system_role IN ('super_admin', 'admin')
  )
);

-- Quiz questions/options: authenticated read
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_questions_read" ON quiz_questions FOR SELECT USING (auth.uid() IS NOT NULL);

ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_options_read" ON quiz_options FOR SELECT USING (auth.uid() IS NOT NULL);

-- Quiz submissions: users see own
ALTER TABLE user_quiz_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_submissions_own" ON user_quiz_submissions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "quiz_submissions_insert" ON user_quiz_submissions FOR INSERT WITH CHECK (user_id = auth.uid());

-- Task submissions: users see own, reviewers see all
ALTER TABLE user_task_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "task_submissions_own" ON user_task_submissions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "task_submissions_insert" ON user_task_submissions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "task_submissions_review" ON user_task_submissions FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.system_role IN ('super_admin', 'admin', 'team_leader')
  )
);

-- Seed initial HKR org domain
INSERT INTO org_domains (org_id, domain)
SELECT id, 'hkr.team' FROM organizations WHERE slug = 'hkr'
ON CONFLICT DO NOTHING;

INSERT INTO org_domains (org_id, domain)
SELECT id, 'hkr.ai' FROM organizations WHERE slug = 'hkr'
ON CONFLICT DO NOTHING;
