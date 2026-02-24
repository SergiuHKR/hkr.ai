import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LmsNavbar } from "@/components/lms/lms-navbar";
import { StatsHeader } from "@/components/lms/stats-header";
import { getUserRole } from "@/lib/lms/roles";
import { getOrCreateProfile } from "@/lib/lms/gamification";
import { getLevelForXp } from "@/lib/lms/levels";
import { SignOutButton } from "@/components/lms/sign-out-button";
import { ShieldX } from "lucide-react";

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
    // /learn is public — shows marketing page for unauthenticated visitors.
    // All other LMS routes require auth (middleware handles redirect,
    // this is a safety net).
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    if (pathname === "/learn") {
      return <>{children}</>;
    }
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

  // Gate: user must belong to an org (via domain or allowlist)
  if (!profile || !profile.org_id) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="max-w-sm rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <ShieldX className="mx-auto h-10 w-10 text-red-400" />
          <h1 className="mt-4 text-xl font-bold">Access Restricted</h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
            This is a private learning platform. Your email is not on the access
            list. Contact your manager or administrator for access.
          </p>
          <div className="mt-6">
            <SignOutButton />
          </div>
        </div>
      </div>
    );
  }

  const level = getLevelForXp(profile.total_xp);

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
