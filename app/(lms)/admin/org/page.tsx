import { createClient } from "@/lib/supabase/server";
import { OrgDomains } from "@/components/admin/org-domains";
import { OrgAllowlist } from "@/components/admin/org-allowlist";

export default async function AdminOrgPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  const orgId = profile?.org_id;

  const { data: org } = orgId
    ? await supabase.from("organizations").select("*").eq("id", orgId).single()
    : { data: null };

  const { data: domains } = orgId
    ? await supabase.from("org_domains").select("*").eq("org_id", orgId).order("domain")
    : { data: [] };

  const { data: allowlist } = orgId
    ? await supabase.from("org_allowlist").select("*").eq("org_id", orgId).order("email")
    : { data: [] };

  const { data: teams } = orgId
    ? await supabase.from("teams").select("*").eq("org_id", orgId).order("name")
    : { data: [] };

  const { data: courseSettings } = orgId
    ? await supabase.from("org_course_settings").select("*, courses(title, slug)").eq("org_id", orgId)
    : { data: [] };

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Organization</h1>

      {org ? (
        <div className="space-y-8">
          {/* Org info */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h2 className="mb-4 text-sm font-semibold">Details</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-[var(--muted-foreground)]">Name:</span> {org.name}</p>
              <p><span className="text-[var(--muted-foreground)]">Slug:</span> <span className="font-mono">{org.slug}</span></p>
            </div>
          </div>

          {/* Domains — interactive */}
          <OrgDomains domains={(domains || []) as { id: string; domain: string }[]} />

          {/* Allowlist — interactive */}
          <OrgAllowlist allowlist={(allowlist || []) as { id: string; email: string }[]} />

          {/* Teams */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h2 className="mb-4 text-sm font-semibold">
              Teams ({teams?.length || 0})
            </h2>
            {teams && teams.length > 0 ? (
              <div className="space-y-1">
                {teams.map((t: { id: string; name: string; slug: string }) => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg bg-[var(--background)] px-3 py-2 text-sm">
                    <span>{t.name}</span>
                    <span className="font-mono text-xs text-[var(--muted-foreground)]">{t.slug}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--muted-foreground)]">No teams.</p>
            )}
          </div>

          {/* Mandatory courses */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h2 className="mb-4 text-sm font-semibold">
              Mandatory Courses ({courseSettings?.filter((cs: { is_mandatory: boolean }) => cs.is_mandatory).length || 0})
            </h2>
            <p className="mb-3 text-xs text-[var(--muted-foreground)]">
              Courses flagged as mandatory for this org (soft flag — shown in UI).
            </p>
            {courseSettings && courseSettings.filter((cs: { is_mandatory: boolean }) => cs.is_mandatory).length > 0 ? (
              <div className="space-y-1">
                {courseSettings
                  .filter((cs: { is_mandatory: boolean }) => cs.is_mandatory)
                  .map((cs: { course_id: string; courses: { title: string; slug: string } }) => (
                    <div key={cs.course_id} className="rounded-lg bg-[var(--background)] px-3 py-2 text-sm">
                      {cs.courses?.title || cs.course_id}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--muted-foreground)]">No mandatory courses.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <p className="text-[var(--muted-foreground)]">No organization associated with your profile.</p>
        </div>
      )}
    </div>
  );
}
