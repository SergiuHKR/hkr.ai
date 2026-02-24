-- ============================================================================
-- Fix: Leaderboard views bypass RLS, showing users without org access
--
-- Problem: weekly_leaderboard and team_leaderboard views are owned by
-- `postgres` (superuser with BYPASSRLS). This means RLS policies on
-- user_profiles are NOT enforced when querying these views. Users with
-- org_id = NULL (denied access, e.g. personal Gmail signups) appear
-- on the weekly leaderboard but not on Overall/Season tabs (which query
-- user_profiles directly with RLS enforced).
--
-- Fix: Add explicit org scoping to both views using get_my_org_id().
-- This function reads auth.uid() from the PostgREST JWT context, so it
-- works correctly even inside postgres-owned views.
-- ============================================================================

-- 1. Recreate weekly_leaderboard with org scoping
CREATE OR REPLACE VIEW public.weekly_leaderboard AS
SELECT
  up.user_id,
  up.display_name,
  up.avatar_url,
  up.org_id,
  up.team_id,
  up.level,
  coalesce(sum(upr.xp_earned), 0)::int AS weekly_xp
FROM public.user_profiles up
LEFT JOIN public.user_progress upr
  ON upr.user_id = up.user_id
  AND upr.completed_at >= date_trunc('week', current_date)
  AND upr.completed_at < date_trunc('week', current_date) + interval '7 days'
WHERE up.org_id = public.get_my_org_id()
GROUP BY up.user_id, up.display_name, up.avatar_url, up.org_id, up.team_id, up.level
ORDER BY weekly_xp DESC;

-- 2. Recreate team_leaderboard with org scoping
CREATE OR REPLACE VIEW public.team_leaderboard AS
SELECT
  t.id AS team_id,
  t.name AS team_name,
  t.org_id,
  count(up.user_id)::int AS member_count,
  coalesce(sum(up.total_xp), 0)::int AS team_xp
FROM public.teams t
LEFT JOIN public.user_profiles up ON up.team_id = t.id
WHERE t.org_id = public.get_my_org_id()
GROUP BY t.id, t.name, t.org_id
ORDER BY team_xp DESC;
