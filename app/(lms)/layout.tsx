import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LmsNavbar } from "@/components/lms/lms-navbar";
import { StatsHeader } from "@/components/lms/stats-header";
import { getUserRole } from "@/lib/lms/roles";
import { getOrCreateProfile } from "@/lib/lms/gamification";
import { getLevelForXp } from "@/lib/lms/levels";

export default async function LMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [role, profile] = await Promise.all([
    getUserRole(supabase, user.id),
    getOrCreateProfile(
      supabase,
      user.id,
      user.user_metadata?.full_name,
      user.user_metadata?.avatar_url,
      user.email
    ),
  ]);

  const level = profile ? getLevelForXp(profile.total_xp) : undefined;

  return (
    <>
      <LmsNavbar role={role} level={level} />
      <div id="main-content" className="pt-16">
        <StatsHeader />
        {children}
      </div>
    </>
  );
}
