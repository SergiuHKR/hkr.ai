-- ============================================================================
-- Gamification: organizations, teams, profiles, streaks, achievements, seasons
-- ============================================================================

-- Organizations: workspace containers (HKR, client orgs)
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  created_at timestamptz not null default now()
);

-- Teams: departments within an organization
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique(org_id, slug)
);

-- User profiles: denormalized for fast reads on leaderboards/dashboards
create table public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  org_id uuid references public.organizations(id) on delete set null,
  team_id uuid references public.teams(id) on delete set null,
  display_name text,
  avatar_url text,
  total_xp int not null default 0,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  level int not null default 1,
  last_activity_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seasons: quarterly periods for rankings
create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  starts_at date not null,
  ends_at date not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

-- Achievements: badge definitions
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  icon text not null default 'award', -- lucide icon name
  criteria_type text not null, -- 'first_lesson', 'course_complete', 'streak', 'xp_total', 'lessons_per_day', 'early_adopter'
  criteria_value jsonb not null default '{}', -- e.g. {"days": 7} or {"xp": 100}
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- User achievements: badges earned by users
create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  season_id uuid references public.seasons(id) on delete set null,
  earned_at timestamptz not null default now(),
  unique(user_id, achievement_id)
);

-- Streaks: one row per user per active day
create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique(user_id, activity_date)
);

-- Season rankings: snapshot at season end
create table public.season_rankings (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.seasons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rank int not null,
  xp_earned int not null default 0,
  created_at timestamptz not null default now(),
  unique(season_id, user_id)
);

-- ============================================================================
-- Indexes
-- ============================================================================
create index idx_teams_org_id on public.teams(org_id);
create index idx_user_profiles_org_id on public.user_profiles(org_id);
create index idx_user_profiles_team_id on public.user_profiles(team_id);
create index idx_user_profiles_total_xp on public.user_profiles(total_xp desc);
create index idx_user_achievements_user_id on public.user_achievements(user_id);
create index idx_user_achievements_achievement_id on public.user_achievements(achievement_id);
create index idx_streaks_user_id on public.streaks(user_id);
create index idx_streaks_activity_date on public.streaks(activity_date);
create index idx_season_rankings_season_id on public.season_rankings(season_id);

-- ============================================================================
-- Triggers
-- ============================================================================
create trigger user_profiles_updated_at before update on public.user_profiles
  for each row execute function public.handle_updated_at();

-- ============================================================================
-- Views
-- ============================================================================

-- Weekly leaderboard: XP earned in the current week (Mon-Sun)
create or replace view public.weekly_leaderboard as
select
  up.user_id,
  up.display_name,
  up.avatar_url,
  up.org_id,
  up.team_id,
  up.level,
  coalesce(sum(upr.xp_earned), 0)::int as weekly_xp
from public.user_profiles up
left join public.user_progress upr
  on upr.user_id = up.user_id
  and upr.completed_at >= date_trunc('week', current_date)
  and upr.completed_at < date_trunc('week', current_date) + interval '7 days'
group by up.user_id, up.display_name, up.avatar_url, up.org_id, up.team_id, up.level
order by weekly_xp desc;

-- Team leaderboard: aggregate XP per team
create or replace view public.team_leaderboard as
select
  t.id as team_id,
  t.name as team_name,
  t.org_id,
  count(up.user_id)::int as member_count,
  coalesce(sum(up.total_xp), 0)::int as team_xp
from public.teams t
left join public.user_profiles up on up.team_id = t.id
group by t.id, t.name, t.org_id
order by team_xp desc;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.organizations enable row level security;
alter table public.teams enable row level security;
alter table public.user_profiles enable row level security;
alter table public.seasons enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.streaks enable row level security;
alter table public.season_rankings enable row level security;

-- Organizations: users see their own org
create policy "Users can view their own organization"
  on public.organizations for select
  to authenticated
  using (
    id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

-- Teams: users see teams in their org
create policy "Users can view teams in their org"
  on public.teams for select
  to authenticated
  using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

-- User profiles: users see profiles in their org
create policy "Users can view profiles in their org"
  on public.user_profiles for select
  to authenticated
  using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

-- User profiles: users can update their own profile
create policy "Users can update their own profile"
  on public.user_profiles for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- User profiles: service role inserts (via API route)
-- We need insert policy for the API route using the user's auth context
create policy "Users can insert their own profile"
  on public.user_profiles for insert
  to authenticated
  with check (user_id = auth.uid());

-- Seasons: all authenticated users can read
create policy "Seasons are viewable by authenticated users"
  on public.seasons for select
  to authenticated
  using (true);

-- Achievements: all authenticated users can read
create policy "Achievements are viewable by authenticated users"
  on public.achievements for select
  to authenticated
  using (true);

-- User achievements: users see their org's achievements
create policy "Users can view achievements in their org"
  on public.user_achievements for select
  to authenticated
  using (
    user_id in (
      select up2.user_id from public.user_profiles up2
      where up2.org_id in (select org_id from public.user_profiles where user_id = auth.uid())
    )
  );

-- User achievements: users can insert their own
create policy "Users can insert their own achievements"
  on public.user_achievements for insert
  to authenticated
  with check (user_id = auth.uid());

-- Streaks: users see their own streaks
create policy "Users can view their own streaks"
  on public.streaks for select
  to authenticated
  using (user_id = auth.uid());

-- Streaks: users can insert their own
create policy "Users can insert their own streaks"
  on public.streaks for insert
  to authenticated
  with check (user_id = auth.uid());

-- Season rankings: users see their org's rankings
create policy "Users can view rankings in their org"
  on public.season_rankings for select
  to authenticated
  using (
    user_id in (
      select up2.user_id from public.user_profiles up2
      where up2.org_id in (select org_id from public.user_profiles where user_id = auth.uid())
    )
  );
