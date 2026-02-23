import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { checkAndAwardAchievements } from "@/lib/lms/achievements";
import { getOrCreateProfile, updateProfileStats } from "@/lib/lms/gamification";
import { getLevelForXp } from "@/lib/lms/levels";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse request
  const { lessonId, xpReward } = await request.json();
  if (!lessonId || typeof xpReward !== "number") {
    return NextResponse.json(
      { error: "Missing lessonId or xpReward" },
      { status: 400 }
    );
  }

  // 1. Ensure user profile exists
  await getOrCreateProfile(
    supabase,
    user.id,
    user.user_metadata?.full_name,
    user.user_metadata?.avatar_url,
    user.email
  );

  // 2. Insert user_progress (idempotent — unique constraint will prevent duplicates)
  const { error: progressError } = await supabase
    .from("user_progress")
    .insert({
      user_id: user.id,
      lesson_id: lessonId,
      xp_earned: xpReward,
    });

  // If already completed, return early
  if (progressError?.code === "23505") {
    return NextResponse.json({
      xpEarned: 0,
      newAchievements: [],
      levelUp: false,
      alreadyCompleted: true,
    });
  }
  if (progressError) {
    return NextResponse.json(
      { error: progressError.message },
      { status: 500 }
    );
  }

  // 3. Update profile stats (XP, level)
  const { newTotalXp, newLevel, leveledUp } = await updateProfileStats(
    supabase,
    user.id,
    xpReward
  );

  // 4. Check for new achievements
  const newAchievements = await checkAndAwardAchievements(supabase, user.id);

  // 5. Get level info for response
  const levelInfo = getLevelForXp(newTotalXp);

  return NextResponse.json({
    xpEarned: xpReward,
    totalXp: newTotalXp,
    level: newLevel,
    levelTitle: levelInfo.title,
    levelUp: leveledUp,
    newAchievements: newAchievements.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      icon: a.icon,
    })),
    alreadyCompleted: false,
  });
}
