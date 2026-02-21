import { Users } from "lucide-react";

type TeamStanding = {
  team_id: string;
  team_name: string;
  member_count: number;
  team_xp: number;
};

export function TeamStandings({ teams }: { teams: TeamStanding[] }) {
  if (teams.length === 0) return null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <div className="border-b border-[var(--border)] px-5 py-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Users className="h-4 w-4 text-[var(--primary)]" />
          Team Standings
        </h3>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {teams.map((team, index) => (
          <div
            key={team.team_id}
            className="flex items-center justify-between px-5 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-[var(--muted-foreground)]">
                #{index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{team.team_name}</p>
                <p className="font-mono text-[10px] text-[var(--muted-foreground)]">
                  {team.member_count} member{team.member_count !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <span className="font-mono text-sm font-semibold text-[var(--primary)]">
              {team.team_xp.toLocaleString()} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
