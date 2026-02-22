import { createClient } from "@/lib/supabase/server";
import {
  getOrCreateProfile,
  getUserAchievements,
  getAllAchievements,
  getRecentActivity,
} from "@/lib/lms/gamification";
import { getLevelForXp, getXpProgressPercent, getXpForNextLevel, LEVELS } from "@/lib/lms/levels";
import { BadgeGrid } from "@/components/lms/badge-grid";
import { Progress } from "@/components/ui/progress";
import { Zap, Trophy, Clock } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await getOrCreateProfile(
    supabase,
    user.id,
    user.user_metadata?.full_name,
    user.user_metadata?.avatar_url
  );

  const level = getLevelForXp(profile.total_xp);
  const progressPercent = getXpProgressPercent(profile.total_xp);
  const nextLevelXp = getXpForNextLevel(profile.total_xp);
  const nextLevel = LEVELS.find((l) => l.level === level.level + 1);

  const earnedAchievements = await getUserAchievements(supabase, user.id);
  const allAchievements = await getAllAchievements(supabase);
  const recentActivity = await getRecentActivity(supabase, user.id, 10);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Profile header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)]/10 font-mono text-xl font-bold text-[var(--primary)]">
          {(profile.display_name || user.email || "?")[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {profile.display_name || user.email}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Level {level.level} · {level.title}
          </p>
        </div>
      </div>

      {/* XP & Level card */}
      <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-[var(--primary)]" />
          <h2 className="text-sm font-semibold">XP & Level</h2>
        </div>

        {/* Large level display */}
        <div className="mb-4 text-center">
          <p className="font-mono text-5xl font-bold text-[var(--primary)]">
            {level.level}
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{level.title}</p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-mono text-[var(--muted-foreground)]">
              {profile.total_xp} XP
            </span>
            {nextLevelXp && (
              <span className="font-mono text-[var(--muted-foreground)]">
                {nextLevelXp} XP
              </span>
            )}
          </div>
          <Progress value={progressPercent} className="h-2.5" />
          {nextLevel && (
            <p className="text-center text-[10px] text-[var(--muted-foreground)]">
              {nextLevelXp! - profile.total_xp} XP to {nextLevel.title}
            </p>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[var(--primary)]" />
            <h2 className="text-sm font-semibold">
              Badges ({earnedAchievements.length}/{allAchievements.length})
            </h2>
          </div>
          <Link
            href="/badges"
            className="text-xs text-[var(--primary)] hover:text-[var(--accent-hover)] transition-colors"
          >
            View all badges →
          </Link>
        </div>
        <BadgeGrid
          allAchievements={allAchievements}
          earnedAchievements={earnedAchievements.map((ea) => ({
            id: ea.id,
            earned_at: ea.earned_at,
          }))}
        />
      </div>

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--muted-foreground)]" />
            <h2 className="text-sm font-semibold">Recent Activity</h2>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)]">
            {recentActivity.map((item) => (
              <div key={item.lesson_id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm text-white">
                    {item.lesson_title}
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    {new Date(item.completed_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold text-[var(--primary)]">
                  +{item.xp_earned} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
