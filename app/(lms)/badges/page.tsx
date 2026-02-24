import { createClient } from "@/lib/supabase/server";
import { getAllAchievements, getUserAchievements } from "@/lib/lms/gamification";
import { LEVELS } from "@/lib/lms/levels";
import { DynamicIcon } from "@/components/lms/dynamic-icon";
import Link from "next/link";

export default async function BadgesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const allAchievements = await getAllAchievements(supabase);
  const earnedAchievements = await getUserAchievements(supabase, user.id);
  const earnedIds = new Set(
    earnedAchievements.map((ea) => ea.id)
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--muted-foreground)]">
        <Link href="/learn" className="hover:text-white transition-colors">
          Learning Platform
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <Link href="/dashboard" className="hover:text-white transition-colors">
          Dashboard
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-white">Badges</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Badges & Achievements</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Earn badges by completing lessons, courses, and leveling up.
          {" "}
          <span className="font-mono text-[var(--primary)]">
            {earnedAchievements.length}/{allAchievements.length}
          </span>
          {" "}unlocked.
        </p>
      </div>

      {/* Badge showcase grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allAchievements.map((achievement: {
          id: string;
          slug: string;
          title: string;
          description: string;
          icon: string;
          criteria_type: string;
          sort_order: number;
        }) => {
          const isEarned = earnedIds.has(achievement.id);
          const earnedData = earnedAchievements.find(
            (ea) => ea.id === achievement.id
          );

          return (
            <div
              key={achievement.id}
              className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
                isEarned
                  ? "border-[var(--primary)]/40 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/10 shadow-lg shadow-[var(--primary)]/5"
                  : "border-[var(--border)] bg-[var(--card)] opacity-60 hover:opacity-80"
              }`}
            >
              {/* Glow effect for earned */}
              {isEarned && (
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--primary)]/10 blur-2xl" />
              )}

              {/* Icon */}
              <div
                className={`relative mb-4 flex h-16 w-16 items-center justify-center rounded-xl ${
                  isEarned
                    ? "bg-[var(--primary)]/15 ring-2 ring-[var(--primary)]/20"
                    : "bg-[var(--muted-foreground)]/5 ring-1 ring-[var(--border)]"
                }`}
              >
                <DynamicIcon
                  name={achievement.icon}
                  className={`h-8 w-8 ${
                    isEarned ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]/40"
                  }`}
                />
              </div>

              {/* Title & description */}
              <h3
                className={`mb-1 font-semibold ${
                  isEarned ? "text-white" : "text-[var(--muted-foreground)]"
                }`}
              >
                {achievement.title}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                {achievement.description}
              </p>

              {/* Status */}
              <div className="mt-4">
                {isEarned ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2.5 py-1 font-mono text-[10px] text-[var(--primary)]">
                    Unlocked
                    {earnedData?.earned_at && (
                      <span className="text-[var(--primary)]/70">
                        {" "}· {new Date(earnedData.earned_at as string).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--muted-foreground)]/5 px-2.5 py-1 font-mono text-[10px] text-[var(--muted-foreground)]">
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Level progression */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold">Level Progression</h2>
        <p className="mb-6 text-sm text-[var(--muted-foreground)]">
          Earn XP by completing lessons. Each level unlocks a new title.
        </p>
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="divide-y divide-[var(--border)]">
            {LEVELS.map((level) => (
              <div
                key={level.level}
                className="flex items-center gap-4 px-5 py-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 font-mono text-sm font-bold text-[var(--primary)]">
                  {level.level}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{level.title}</p>
                </div>
                <span className="font-mono text-xs text-[var(--muted-foreground)]">
                  {level.xpRequired === 0 ? "Start" : `${level.xpRequired} XP`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
