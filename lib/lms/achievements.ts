import { SupabaseClient } from "@supabase/supabase-js";

export type Achievement = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  criteria_type: string;
  criteria_value: Record<string, unknown>;
  sort_order: number;
};

export type EarnedAchievement = Achievement & {
  earned_at: string;
};

/** Check all achievement criteria and award any newly earned badges */
export async function checkAndAwardAchievements(
  supabase: SupabaseClient,
  userId: string
): Promise<Achievement[]> {
  // Get all achievements
  const { data: allAchievements } = await supabase
    .from("achievements")
    .select("*")
    .order("sort_order");

  if (!allAchievements || allAchievements.length === 0) return [];

  // Get already earned
  const { data: earned } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);

  const earnedIds = new Set((earned || []).map((e: { achievement_id: string }) => e.achievement_id));

  // Get user profile for stats
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("total_xp")
    .eq("user_id", userId)
    .single();

  // Get active season
  const { data: activeSeason } = await supabase
    .from("seasons")
    .select("id, slug")
    .eq("is_active", true)
    .single();

  // Get total lesson completions
  const { count: totalLessons } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Get today's lesson completions
  const today = new Date().toISOString().split("T")[0];
  const { count: todayLessons } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("completed_at", today + "T00:00:00Z")
    .lt("completed_at", today + "T23:59:59Z");

  // Check course completions
  const courseCompletions = await checkCourseCompletions(supabase, userId);

  const newAchievements: Achievement[] = [];

  for (const achievement of allAchievements) {
    if (earnedIds.has(achievement.id)) continue;

    const criteria = achievement.criteria_value as Record<string, unknown>;
    let earned = false;

    switch (achievement.criteria_type) {
      case "first_lesson":
        earned = (totalLessons || 0) >= ((criteria.count as number) || 1);
        break;

      case "course_complete":
        earned = courseCompletions.has(criteria.course_slug as string);
        break;

      case "xp_total":
        earned = (profile?.total_xp || 0) >= ((criteria.xp as number) || 100);
        break;

      case "lessons_per_day":
        earned = (todayLessons || 0) >= ((criteria.count as number) || 3);
        break;

      case "early_adopter":
        earned = activeSeason?.slug === criteria.season_slug;
        break;
    }

    if (earned) {
      const { error } = await supabase.from("user_achievements").insert({
        user_id: userId,
        achievement_id: achievement.id,
        season_id: activeSeason?.id || null,
      });
      if (!error) {
        newAchievements.push(achievement);
      }
    }
  }

  return newAchievements;
}

/** Check which courses the user has fully completed */
async function checkCourseCompletions(
  supabase: SupabaseClient,
  userId: string
): Promise<Set<string>> {
  // Get all published courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug")
    .eq("is_published", true);

  if (!courses || courses.length === 0) return new Set();

  const completedSlugs = new Set<string>();

  for (const course of courses) {
    // Count total lessons in course
    const { count: totalLessons } = await supabase
      .from("lessons")
      .select("id, modules!inner(course_id)", { count: "exact", head: true })
      .eq("modules.course_id", course.id);

    // Count completed lessons
    const { data: courseLessons } = await supabase
      .from("lessons")
      .select("id, modules!inner(course_id)")
      .eq("modules.course_id", course.id);

    if (!courseLessons || !totalLessons) continue;

    const lessonIds = courseLessons.map((l: { id: string }) => l.id);
    if (lessonIds.length === 0) continue;

    const { count: completedCount } = await supabase
      .from("user_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("lesson_id", lessonIds);

    if (completedCount && completedCount >= totalLessons) {
      completedSlugs.add(course.slug);
    }
  }

  return completedSlugs;
}
