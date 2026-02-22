import { createClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/lms/gamification";
import { getLevelForXp, getXpProgressPercent, getXpForNextLevel } from "@/lib/lms/levels";
import Link from "next/link";
import { Award } from "lucide-react";

export async function StatsHeader() {
  try {
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

    if (!profile) return null;

    const level = getLevelForXp(profile.total_xp);
    const progressPercent = getXpProgressPercent(profile.total_xp);
    const nextLevelXp = getXpForNextLevel(profile.total_xp);

    // Count badges
    const { count: badgeCount } = await supabase
      .from("user_achievements")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return (
      <div className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto flex h-10 max-w-6xl items-center gap-6 px-6 text-xs">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[var(--muted-foreground)] transition-colors hover:text-white"
          >
            {/* Level badge */}
            <span className="font-mono font-bold text-[var(--primary)]">
              LVL {level.level}
            </span>
            <span className="hidden text-[var(--muted-foreground)] sm:inline">
              {level.title}
            </span>

            {/* XP progress bar */}
            <span className="flex items-center gap-1.5">
              <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-[var(--muted-foreground)]/20 sm:block">
                <span
                  className="block h-full rounded-full bg-[var(--primary)] transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </span>
              <span className="font-mono">
                {profile.total_xp}
                {nextLevelXp ? `/${nextLevelXp}` : ""} XP
              </span>
            </span>
          </Link>

          <span className="text-[var(--border)]">|</span>

          {/* Badges */}
          <Link
            href="/badges"
            className="flex items-center gap-1 text-[var(--muted-foreground)] transition-colors hover:text-white"
          >
            <Award className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span className="font-mono">{badgeCount || 0}</span>
            <span className="hidden sm:inline">badges</span>
          </Link>
        </div>
      </div>
    );
  } catch {
    // If profile creation fails, show a minimal stats bar
    return null;
  }
}
