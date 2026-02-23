import { SupabaseClient } from "@supabase/supabase-js";
import { getLevelForXp } from "./levels";

export type UserProfile = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  level: number;
  last_activity_date: string | null;
  org_id: string | null;
  team_id: string | null;
};

export type LeaderboardEntry = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  level: number;
  total_xp: number;
  rank: number;
};

export type WeeklyLeaderboardEntry = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  level: number;
  weekly_xp: number;
  rank: number;
};

export type TeamStanding = {
  team_id: string;
  team_name: string;
  member_count: number;
  team_xp: number;
};

/**
 * Get or create user profile.
 *
 * Primary creation is handled by DB trigger `on_auth_user_created`
 * (migration 20260223020000). This function is a safety net — if the
 * trigger didn't fire, we create the profile here with domain-based org matching.
 */
export async function getOrCreateProfile(
  supabase: SupabaseClient,
  userId: string,
  displayName?: string | null,
  avatarUrl?: string | null,
  email?: string | null
): Promise<UserProfile> {
  const { data: existing } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (existing) return existing;

  // Profile missing (trigger may have failed) — create with domain matching
  let orgId: string | null = null;
  let teamId: string | null = null;

  try {
    if (email) {
      const domain = email.split("@")[1];
      if (domain) {
        const { data: domainMatch } = await supabase
          .from("org_domains")
          .select("org_id")
          .eq("domain", domain)
          .limit(1)
          .single();
        orgId = domainMatch?.org_id || null;
      }

      // Fallback: exact email match in org_allowlist
      if (!orgId) {
        const { data: emailMatch } = await supabase
          .from("org_allowlist")
          .select("org_id")
          .eq("email", email)
          .limit(1)
          .single();
        orgId = emailMatch?.org_id || null;
      }
    }

    if (orgId) {
      const { data: generalTeam } = await supabase
        .from("teams")
        .select("id")
        .eq("slug", "general")
        .eq("org_id", orgId)
        .single();
      teamId = generalTeam?.id || null;
    }
  } catch {
    // Org/team lookup failed — proceed without defaults
  }

  const { data: newProfile, error } = await supabase
    .from("user_profiles")
    .insert({
      user_id: userId,
      display_name: displayName || null,
      avatar_url: avatarUrl || null,
      org_id: orgId,
      team_id: teamId,
    })
    .select()
    .single();

  if (error) {
    // If insert fails (e.g. race condition with trigger), try reading again
    const { data: retryProfile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (retryProfile) return retryProfile;

    // Return a default profile object so the app doesn't crash
    return {
      user_id: userId,
      display_name: displayName || null,
      avatar_url: avatarUrl || null,
      total_xp: 0,
      level: 1,
      last_activity_date: null,
      org_id: null,
      team_id: null,
    } as UserProfile;
  }

  return newProfile;
}

/** Update profile XP and level after lesson completion */
export async function updateProfileStats(
  supabase: SupabaseClient,
  userId: string,
  xpToAdd: number
): Promise<{ newTotalXp: number; newLevel: number; leveledUp: boolean }> {
  const profile = await getOrCreateProfile(supabase, userId);
  const newTotalXp = profile.total_xp + xpToAdd;
  const oldLevel = profile.level;
  const newLevelInfo = getLevelForXp(newTotalXp);
  const newLevel = newLevelInfo.level;

  await supabase
    .from("user_profiles")
    .update({
      total_xp: newTotalXp,
      level: newLevel,
      last_activity_date: new Date().toISOString().split("T")[0],
    })
    .eq("user_id", userId);

  return {
    newTotalXp,
    newLevel,
    leveledUp: newLevel > oldLevel,
  };
}

/** Get overall leaderboard (all time, scoped to org) */
export async function getOverallLeaderboard(
  supabase: SupabaseClient,
  limit: number = 50
): Promise<LeaderboardEntry[]> {
  const { data } = await supabase
    .from("user_profiles")
    .select("user_id, display_name, avatar_url, level, total_xp")
    .order("total_xp", { ascending: false })
    .limit(limit);

  return (data || []).map(
    (entry: { user_id: string; display_name: string | null; avatar_url: string | null; level: number; total_xp: number }, index: number) => ({
      ...entry,
      rank: index + 1,
    })
  );
}

/** Get weekly leaderboard */
export async function getWeeklyLeaderboard(
  supabase: SupabaseClient,
  limit: number = 50
): Promise<WeeklyLeaderboardEntry[]> {
  const { data } = await supabase
    .from("weekly_leaderboard")
    .select("*")
    .limit(limit);

  return (data || []).map(
    (entry: { user_id: string; display_name: string | null; avatar_url: string | null; level: number; weekly_xp: number }, index: number) => ({
      ...entry,
      rank: index + 1,
    })
  );
}

/** Get team standings */
export async function getTeamStandings(
  supabase: SupabaseClient
): Promise<TeamStanding[]> {
  const { data } = await supabase
    .from("team_leaderboard")
    .select("*");

  return data || [];
}

/** Get active season */
export async function getActiveSeason(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_active", true)
    .single();

  return data;
}

/** Get season leaderboard (uses user_profiles total_xp for active season) */
export async function getSeasonLeaderboard(
  supabase: SupabaseClient,
  seasonId: string,
  limit: number = 50
): Promise<LeaderboardEntry[]> {
  // For active season, use live data from user_profiles
  const { data: season } = await supabase
    .from("seasons")
    .select("is_active")
    .eq("id", seasonId)
    .single();

  if (season?.is_active) {
    return getOverallLeaderboard(supabase, limit);
  }

  // For past seasons, use snapshots
  const { data } = await supabase
    .from("season_rankings")
    .select("user_id, rank, xp_earned")
    .eq("season_id", seasonId)
    .order("rank")
    .limit(limit);

  // Enrich with profile data
  if (!data || data.length === 0) return [];

  const userIds = data.map((r: { user_id: string }) => r.user_id);
  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("user_id, display_name, avatar_url, level")
    .in("user_id", userIds);

  const profileMap = new Map(
    (profiles || []).map((p: { user_id: string; display_name: string | null; avatar_url: string | null; level: number }) => [p.user_id, p])
  );

  return data.map((r: { user_id: string; rank: number; xp_earned: number }) => {
    const profile = profileMap.get(r.user_id);
    return {
      user_id: r.user_id,
      display_name: profile?.display_name || null,
      avatar_url: profile?.avatar_url || null,
      level: profile?.level || 1,
      total_xp: r.xp_earned,
      rank: r.rank,
    };
  });
}

/** Get user's earned achievements */
export type UserEarnedAchievement = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  earned_at: string;
};

export async function getUserAchievements(
  supabase: SupabaseClient,
  userId: string
): Promise<UserEarnedAchievement[]> {
  // Get user's earned achievement records
  const { data: earnedRecords } = await supabase
    .from("user_achievements")
    .select("earned_at, achievement_id")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  if (!earnedRecords || earnedRecords.length === 0) return [];

  // Get achievement details separately to avoid nested join type issues
  const achievementIds = earnedRecords.map((r: { achievement_id: string }) => r.achievement_id);
  const { data: achievements } = await supabase
    .from("achievements")
    .select("id, slug, title, description, icon")
    .in("id", achievementIds);

  const achievementMap = new Map(
    (achievements || []).map((a: { id: string; slug: string; title: string; description: string; icon: string }) => [a.id, a])
  );

  return earnedRecords.map((ua: { earned_at: string; achievement_id: string }) => {
    const achievement = achievementMap.get(ua.achievement_id);
    return {
      id: achievement?.id || ua.achievement_id,
      slug: achievement?.slug || "",
      title: achievement?.title || "",
      description: achievement?.description || "",
      icon: achievement?.icon || "award",
      earned_at: ua.earned_at,
    };
  });
}

/** Get all achievements (for badge grid) */
export async function getAllAchievements(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("achievements")
    .select("*")
    .order("sort_order");

  return data || [];
}

export type RecentActivityItem = {
  lesson_id: string;
  completed_at: string;
  xp_earned: number;
  lesson_title: string;
};

/** Get recent activity (last N lesson completions) */
export async function getRecentActivity(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 10
): Promise<RecentActivityItem[]> {
  const { data } = await supabase
    .from("user_progress")
    .select("lesson_id, completed_at, xp_earned")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(limit);

  if (!data || data.length === 0) return [];

  // Fetch lesson titles separately to avoid nested join type issues
  const lessonIds = data.map((d: { lesson_id: string }) => d.lesson_id);
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title")
    .in("id", lessonIds);

  const titleMap = new Map(
    (lessons || []).map((l: { id: string; title: string }) => [l.id, l.title])
  );

  return data.map((item: { lesson_id: string; completed_at: string; xp_earned: number }) => ({
    lesson_id: item.lesson_id,
    completed_at: item.completed_at,
    xp_earned: item.xp_earned,
    lesson_title: titleMap.get(item.lesson_id) || "Unknown lesson",
  }));
}
