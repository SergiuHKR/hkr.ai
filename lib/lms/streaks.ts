import { SupabaseClient } from "@supabase/supabase-js";

/** Record a daily activity and recalculate streak */
export async function recordDailyActivity(
  supabase: SupabaseClient,
  userId: string
): Promise<{ currentStreak: number; longestStreak: number }> {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Upsert today's streak entry (idempotent)
  await supabase
    .from("streaks")
    .upsert({ user_id: userId, activity_date: today }, { onConflict: "user_id,activity_date" });

  // Get all streak dates for the user, ordered descending
  const { data: streakDays } = await supabase
    .from("streaks")
    .select("activity_date")
    .eq("user_id", userId)
    .order("activity_date", { ascending: false });

  if (!streakDays || streakDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Calculate current streak (consecutive days ending today or yesterday)
  const dates = streakDays.map((s: { activity_date: string }) => s.activity_date);
  const currentStreak = calculateCurrentStreak(dates, today);

  // Calculate longest streak ever
  const longestStreak = calculateLongestStreak(dates);

  return { currentStreak, longestStreak };
}

/** Calculate current streak from sorted dates (descending) */
function calculateCurrentStreak(dates: string[], today: string): number {
  if (dates.length === 0) return 0;

  const todayDate = new Date(today + "T00:00:00Z");
  const firstDate = new Date(dates[0] + "T00:00:00Z");

  // If most recent activity is not today or yesterday, streak is 0
  const daysDiff = Math.floor(
    (todayDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysDiff > 1) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + "T00:00:00Z");
    const curr = new Date(dates[i] + "T00:00:00Z");
    const gap = Math.floor(
      (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (gap === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/** Calculate longest streak from sorted dates (descending) */
function calculateLongestStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  // Sort ascending for easier calculation
  const ascending = [...dates].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < ascending.length; i++) {
    const prev = new Date(ascending[i - 1] + "T00:00:00Z");
    const curr = new Date(ascending[i] + "T00:00:00Z");
    const gap = Math.floor(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (gap === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (gap > 1) {
      current = 1;
    }
    // gap === 0 means duplicate date, skip
  }
  return longest;
}

/** Get streak dates for the last N days (for streak calendar) */
export async function getStreakDates(
  supabase: SupabaseClient,
  userId: string,
  days: number = 30
): Promise<string[]> {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const { data } = await supabase
    .from("streaks")
    .select("activity_date")
    .eq("user_id", userId)
    .gte("activity_date", fromDate.toISOString().split("T")[0])
    .order("activity_date", { ascending: true });

  return (data || []).map((s: { activity_date: string }) => s.activity_date);
}
