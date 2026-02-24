import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getLevelForXp } from "@/lib/lms/levels";

type Props = { params: Promise<{ id: string }> };

export default async function CertificatePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // The certificate ID is a user_achievement ID
  const { data: userAchievement } = await supabase
    .from("user_achievements")
    .select("*, achievements(title, description, icon)")
    .eq("id", id)
    .single();

  if (!userAchievement) notFound();

  // Get user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name, total_xp")
    .eq("user_id", userAchievement.user_id)
    .single();

  const levelInfo = profile ? getLevelForXp(profile.total_xp) : null;

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl border-2 border-[var(--primary)]/30 bg-gradient-to-br from-[var(--card)] to-[var(--primary)]/5 p-12 text-center shadow-2xl shadow-[var(--primary)]/10">
        {/* Header */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]/20">
            <span className="text-3xl">🏆</span>
          </div>
          <p className="text-xs uppercase tracking-widest text-[var(--primary)]">
            Certificate of Achievement
          </p>
        </div>

        {/* Achievement */}
        <h1 className="mb-2 text-3xl font-bold text-white">
          {userAchievement.achievements?.title}
        </h1>
        <p className="mb-8 text-[var(--muted-foreground)]">
          {userAchievement.achievements?.description}
        </p>

        {/* Awarded to */}
        <div className="mb-8">
          <p className="text-sm text-[var(--muted-foreground)]">Awarded to</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {profile?.display_name || "Anonymous"}
          </p>
          {levelInfo && (
            <p className="mt-1 text-sm text-[var(--primary)]">
              Level {levelInfo.level} — {levelInfo.title}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="mb-8 border-t border-[var(--border)] pt-6">
          <p className="text-sm text-[var(--muted-foreground)]">
            Earned on{" "}
            {new Date(userAchievement.earned_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1 text-sm">
          <span className="font-bold text-white">HKR</span>
          <span className="font-bold text-[var(--primary)]">.AI</span>
          <span className="ml-2 text-[var(--muted-foreground)]">Learning Platform</span>
        </div>
      </div>
    </main>
  );
}
