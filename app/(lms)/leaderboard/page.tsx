import { createClient } from "@/lib/supabase/server";
import {
  getOverallLeaderboard,
  getWeeklyLeaderboard,
  getActiveSeason,
  getSeasonLeaderboard,
  getTeamStandings,
} from "@/lib/lms/gamification";
import { LeaderboardTable } from "@/components/lms/leaderboard-table";
import { TeamStandings } from "@/components/lms/team-standings";
import Link from "next/link";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const overall = await getOverallLeaderboard(supabase);
  const weekly = await getWeeklyLeaderboard(supabase);
  const season = await getActiveSeason(supabase);
  const seasonLeaderboard = season
    ? await getSeasonLeaderboard(supabase, season.id)
    : [];
  const teams = await getTeamStandings(supabase);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--muted-foreground)]">
        <Link href="/learn" className="hover:text-white transition-colors">
          Learning Platform
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-white">Leaderboard</span>
      </nav>

      <h1 className="mb-6 text-2xl font-bold">Leaderboard</h1>

      {/* Leaderboard tabs */}
      <LeaderboardTable
        overall={overall}
        weekly={weekly}
        season={seasonLeaderboard}
        currentUserId={user.id}
        seasonName={season?.name || "Season"}
      />

      {/* Team standings */}
      <div className="mt-8">
        <TeamStandings teams={teams} />
      </div>
    </main>
  );
}
