import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LmsNavbar } from "@/components/lms/lms-navbar";
import { StatsHeader } from "@/components/lms/stats-header";

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

  return (
    <>
      <LmsNavbar />
      <div id="main-content" className="pt-16">
        <StatsHeader />
        {children}
      </div>
    </>
  );
}
