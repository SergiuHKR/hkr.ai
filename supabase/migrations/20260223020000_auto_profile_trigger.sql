-- ============================================================================
-- Auto-create user_profiles on auth.users INSERT
--
-- Problem: profiles were only created lazily (on first lesson completion).
-- Users who logged in but didn't complete a lesson had no profile — invisible
-- to the platform (leaderboards, admin panel, etc.).
--
-- Solution: Supabase trigger on auth.users that:
--   1. Extracts email domain
--   2. Looks up org via org_domains (domain match)
--   3. Falls back to org_allowlist (exact email match)
--   4. Finds default team (slug='general') in that org
--   5. Inserts user_profiles row
-- ============================================================================

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _email text;
  _domain text;
  _org_id uuid;
  _team_id uuid;
  _display_name text;
  _avatar_url text;
BEGIN
  _email := NEW.email;
  _domain := split_part(_email, '@', 2);
  _display_name := NEW.raw_user_meta_data->>'full_name';
  _avatar_url := NEW.raw_user_meta_data->>'avatar_url';

  -- Try domain-based org matching first
  SELECT od.org_id INTO _org_id
  FROM org_domains od
  WHERE od.domain = _domain
  LIMIT 1;

  -- Fallback: exact email match in org_allowlist
  IF _org_id IS NULL THEN
    SELECT oa.org_id INTO _org_id
    FROM org_allowlist oa
    WHERE oa.email = _email
    LIMIT 1;
  END IF;

  -- Find default team (slug='general') in the matched org
  IF _org_id IS NOT NULL THEN
    SELECT t.id INTO _team_id
    FROM teams t
    WHERE t.org_id = _org_id
    AND t.slug = 'general'
    LIMIT 1;
  END IF;

  -- Insert user profile (ON CONFLICT for safety — idempotent)
  INSERT INTO user_profiles (user_id, display_name, avatar_url, org_id, team_id)
  VALUES (NEW.id, _display_name, _avatar_url, _org_id, _team_id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 2. Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill: create profiles for any auth.users that lack one
-- Uses the same domain-matching logic as the trigger
INSERT INTO user_profiles (user_id, display_name, avatar_url, org_id, team_id)
SELECT
  au.id,
  au.raw_user_meta_data->>'full_name',
  au.raw_user_meta_data->>'avatar_url',
  -- Domain-based org match
  COALESCE(
    (SELECT od.org_id FROM org_domains od WHERE od.domain = split_part(au.email, '@', 2) LIMIT 1),
    (SELECT oa.org_id FROM org_allowlist oa WHERE oa.email = au.email LIMIT 1)
  ),
  -- Default team in matched org
  (SELECT t.id FROM teams t
   WHERE t.org_id = COALESCE(
     (SELECT od.org_id FROM org_domains od WHERE od.domain = split_part(au.email, '@', 2) LIMIT 1),
     (SELECT oa.org_id FROM org_allowlist oa WHERE oa.email = au.email LIMIT 1)
   )
   AND t.slug = 'general'
   LIMIT 1)
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles up WHERE up.user_id = au.id
)
ON CONFLICT (user_id) DO NOTHING;

-- 4. Fix existing profiles with null org_id that should be assigned
-- (e.g. Sergiu's profile was created before domain matching existed)
UPDATE user_profiles up
SET
  org_id = COALESCE(
    (SELECT od.org_id FROM org_domains od WHERE od.domain = split_part(au.email, '@', 2) LIMIT 1),
    (SELECT oa.org_id FROM org_allowlist oa WHERE oa.email = au.email LIMIT 1)
  ),
  team_id = (SELECT t.id FROM teams t
    WHERE t.org_id = COALESCE(
      (SELECT od.org_id FROM org_domains od WHERE od.domain = split_part(au.email, '@', 2) LIMIT 1),
      (SELECT oa.org_id FROM org_allowlist oa WHERE oa.email = au.email LIMIT 1)
    )
    AND t.slug = 'general'
    LIMIT 1)
FROM auth.users au
WHERE up.user_id = au.id
AND up.org_id IS NULL;
