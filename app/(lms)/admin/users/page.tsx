import { createClient } from "@/lib/supabase/server";
import type { SystemRole } from "@/lib/lms/roles";
import { UserManageButton } from "@/components/admin/user-actions";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("user_profiles")
    .select(
      "user_id, display_name, avatar_url, total_xp, level, system_role, org_id, team_id, last_activity_date"
    )
    .order("total_xp", { ascending: false });

  // Get current user's org for team lookup
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  const { data: currentProfile } = currentUser
    ? await supabase
        .from("user_profiles")
        .select("org_id")
        .eq("user_id", currentUser.id)
        .single()
    : { data: null };

  const orgId = currentProfile?.org_id;

  // Get teams for this org
  const { data: teams } = orgId
    ? await supabase.from("teams").select("id, name").eq("org_id", orgId).order("name")
    : { data: [] };

  // Get all tags
  const { data: tags } = await supabase
    .from("tags")
    .select("id, name")
    .order("name");

  // Get user-tag mappings
  const { data: userTags } = await supabase.from("user_tags").select("user_id, tag_id");
  const userTagMap = new Map<string, string[]>();
  for (const ut of userTags || []) {
    if (!userTagMap.has(ut.user_id)) userTagMap.set(ut.user_id, []);
    userTagMap.get(ut.user_id)!.push(ut.tag_id);
  }

  const roleColors: Record<SystemRole, string> = {
    super_admin: "text-red-400 bg-red-400/10",
    admin: "text-orange-400 bg-orange-400/10",
    team_leader: "text-blue-400 bg-blue-400/10",
    user: "text-[var(--muted-foreground)] bg-[var(--muted-foreground)]/10",
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <span className="text-sm text-[var(--muted-foreground)]">
          {users?.length || 0} total
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted-foreground)]">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Tags</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">XP</th>
                <th className="px-4 py-3 font-medium">Last Active</th>
                <th className="px-4 py-3 font-medium w-16">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {(users || []).map(
                (user: {
                  user_id: string;
                  display_name: string | null;
                  system_role: SystemRole;
                  team_id: string | null;
                  level: number;
                  total_xp: number;
                  last_activity_date: string | null;
                }) => {
                  const userTagIds = userTagMap.get(user.user_id) || [];
                  return (
                    <tr key={user.user_id} className="hover:bg-[var(--background)]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]/10 text-xs font-bold text-[var(--primary)]">
                            {(user.display_name || "?")[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-white">
                            {user.display_name || "Anonymous"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${roleColors[user.system_role] || roleColors.user}`}
                        >
                          {user.system_role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {userTagIds.map((tagId) => {
                            const tag = (tags || []).find(
                              (t: { id: string }) => t.id === tagId
                            );
                            return tag ? (
                              <span
                                key={tagId}
                                className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] text-[var(--primary)]"
                              >
                                {(tag as { name: string }).name}
                              </span>
                            ) : null;
                          })}
                          {userTagIds.length === 0 && (
                            <span className="text-xs text-[var(--muted-foreground)]">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[var(--primary)]">
                        {user.level}
                      </td>
                      <td className="px-4 py-3 font-mono">{user.total_xp}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {user.last_activity_date
                          ? new Date(
                              user.last_activity_date
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "Never"}
                      </td>
                      <td className="px-4 py-3">
                        <UserManageButton
                          userId={user.user_id}
                          displayName={user.display_name || "Anonymous"}
                          currentRole={user.system_role}
                          currentTeamId={user.team_id}
                          currentTagIds={userTagIds}
                          allTags={
                            (tags || []) as { id: string; name: string }[]
                          }
                          allTeams={
                            (teams || []) as { id: string; name: string }[]
                          }
                        />
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
