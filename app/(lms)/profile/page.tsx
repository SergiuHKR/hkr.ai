import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getOrCreateProfile } from "@/lib/lms/gamification";
import { getLevelForXp, getXpProgressPercent, getXpForNextLevel } from "@/lib/lms/levels";
import { UserAvatar } from "@/components/lms/user-avatar";
import { ProfileForm } from "@/components/lms/profile-form";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getOrCreateProfile(
    supabase,
    user.id,
    user.user_metadata?.full_name,
    user.user_metadata?.avatar_url,
  );

  const levelInfo = getLevelForXp(profile.total_xp);
  const progress = getXpProgressPercent(profile.total_xp);
  const nextLevelXp = getXpForNextLevel(profile.total_xp);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold">Profile</h1>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        {/* Avatar + Info */}
        <div className="mb-8 flex items-center gap-5">
          <UserAvatar
            avatarUrl={profile.avatar_url}
            displayName={profile.display_name}
            size={72}
          />
          <div>
            <h2 className="text-xl font-bold">
              {profile.display_name || "Anonymous"}
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {user.email}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--primary)]">
              Level {levelInfo.level} — {levelInfo.title}
            </p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">XP Progress</span>
            <span className="font-mono text-[var(--primary)]">
              {profile.total_xp} XP
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          {nextLevelXp && (
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {nextLevelXp - profile.total_xp} XP to next level
            </p>
          )}
        </div>

        {/* Edit Form */}
        <ProfileForm
          userId={user.id}
          currentName={profile.display_name || ""}
        />
      </div>
    </main>
  );
}
