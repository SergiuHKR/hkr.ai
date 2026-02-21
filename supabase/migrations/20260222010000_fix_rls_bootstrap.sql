-- ============================================================================
-- Fix RLS bootstrap: new users need to read orgs/teams to create their profile
-- ============================================================================

-- Drop restrictive org/team/profile SELECT policies
drop policy if exists "Users can view their own organization" on public.organizations;
drop policy if exists "Users can view teams in their org" on public.teams;
drop policy if exists "Users can view profiles in their org" on public.user_profiles;

-- Organizations: all authenticated users can read (org names are not sensitive)
create policy "Organizations are viewable by authenticated users"
  on public.organizations for select
  to authenticated
  using (true);

-- Teams: all authenticated users can read (team names are not sensitive)
create policy "Teams are viewable by authenticated users"
  on public.teams for select
  to authenticated
  using (true);

-- User profiles: users can read their own profile (bootstrap) OR profiles in their org
create policy "Users can view profiles in their org or their own"
  on public.user_profiles for select
  to authenticated
  using (
    user_id = auth.uid()
    or org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );
