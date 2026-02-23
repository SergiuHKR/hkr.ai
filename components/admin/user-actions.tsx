"use client";

import { useState, useTransition } from "react";
import { updateUserRole, updateUserTeam, setUserTags } from "@/app/(lms)/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";
import type { SystemRole } from "@/lib/lms/roles";

type TagItem = { id: string; name: string };
type TeamItem = { id: string; name: string };

const ROLES: { value: SystemRole; label: string; color: string }[] = [
  { value: "super_admin", label: "Super Admin", color: "text-red-400" },
  { value: "admin", label: "Admin", color: "text-orange-400" },
  { value: "team_leader", label: "Team Leader", color: "text-blue-400" },
  { value: "user", label: "User", color: "text-[var(--muted-foreground)]" },
];

export function UserManageButton({
  userId,
  displayName,
  currentRole,
  currentTeamId,
  currentTagIds,
  allTags,
  allTeams,
}: {
  userId: string;
  displayName: string;
  currentRole: SystemRole;
  currentTeamId: string | null;
  currentTagIds: string[];
  allTags: TagItem[];
  allTeams: TeamItem[];
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<SystemRole>(currentRole);
  const [teamId, setTeamId] = useState<string>(currentTeamId || "");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(currentTagIds)
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggleTag(id: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const results = await Promise.all([
        role !== currentRole ? updateUserRole(userId, role) : null,
        teamId !== (currentTeamId || "")
          ? updateUserTeam(userId, teamId || null)
          : null,
        JSON.stringify([...selectedTags].sort()) !==
        JSON.stringify([...currentTagIds].sort())
          ? setUserTags(userId, Array.from(selectedTags))
          : null,
      ]);

      const firstError = results.find((r) => r?.error);
      if (firstError?.error) setError(firstError.error);
      else setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-white">
          <Settings2 className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[var(--card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle>Manage {displayName || "User"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          {/* Role */}
          <div>
            <label className="mb-2 block text-xs font-medium text-[var(--muted-foreground)]">
              System Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    role === r.value
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--border)] hover:border-[var(--muted-foreground)]"
                  }`}
                >
                  <span className={r.color}>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Team */}
          {allTeams.length > 0 && (
            <div>
              <label className="mb-2 block text-xs font-medium text-[var(--muted-foreground)]">
                Team
              </label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm"
              >
                <option value="">No team</option>
                {allTeams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tags */}
          {allTags.length > 0 && (
            <div>
              <label className="mb-2 block text-xs font-medium text-[var(--muted-foreground)]">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      selectedTags.has(tag.id)
                        ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                        : "bg-[var(--background)] text-[var(--muted-foreground)] hover:text-white"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <Button onClick={handleSave} disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
