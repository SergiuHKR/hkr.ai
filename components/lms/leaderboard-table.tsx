"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardRow } from "@/components/lms/leaderboard-row";

type LeaderboardEntry = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  level: number;
  total_xp?: number;
  weekly_xp?: number;
  rank: number;
};

export function LeaderboardTable({
  overall,
  weekly,
  season,
  currentUserId,
  seasonName,
}: {
  overall: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  season: LeaderboardEntry[];
  currentUserId: string;
  seasonName: string;
}) {
  return (
    <Tabs defaultValue="overall" className="w-full">
      <TabsList className="mb-4 w-full justify-start gap-1 bg-transparent p-0">
        <TabsTrigger
          value="overall"
          className="rounded-full border border-[var(--border)] bg-transparent px-4 py-1.5 text-xs data-[state=active]:border-[var(--primary)] data-[state=active]:bg-[var(--primary)]/10 data-[state=active]:text-[var(--primary)]"
        >
          Overall
        </TabsTrigger>
        <TabsTrigger
          value="weekly"
          className="rounded-full border border-[var(--border)] bg-transparent px-4 py-1.5 text-xs data-[state=active]:border-[var(--primary)] data-[state=active]:bg-[var(--primary)]/10 data-[state=active]:text-[var(--primary)]"
        >
          This Week
        </TabsTrigger>
        <TabsTrigger
          value="season"
          className="rounded-full border border-[var(--border)] bg-transparent px-4 py-1.5 text-xs data-[state=active]:border-[var(--primary)] data-[state=active]:bg-[var(--primary)]/10 data-[state=active]:text-[var(--primary)]"
        >
          {seasonName}
        </TabsTrigger>
      </TabsList>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <TabsContent value="overall" className="m-0">
          <div className="divide-y divide-[var(--border)]">
            {overall.length === 0 ? (
              <EmptyState />
            ) : (
              overall.map((entry) => (
                <LeaderboardRow
                  key={entry.user_id}
                  rank={entry.rank}
                  displayName={entry.display_name}
                  avatarUrl={entry.avatar_url}
                  level={entry.level}
                  xp={entry.total_xp || 0}
                  isCurrentUser={entry.user_id === currentUserId}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="m-0">
          <div className="divide-y divide-[var(--border)]">
            {weekly.length === 0 ? (
              <EmptyState />
            ) : (
              weekly.map((entry) => (
                <LeaderboardRow
                  key={entry.user_id}
                  rank={entry.rank}
                  displayName={entry.display_name}
                  avatarUrl={entry.avatar_url}
                  level={entry.level}
                  xp={entry.weekly_xp || 0}
                  isCurrentUser={entry.user_id === currentUserId}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="season" className="m-0">
          <div className="divide-y divide-[var(--border)]">
            {season.length === 0 ? (
              <EmptyState />
            ) : (
              season.map((entry) => (
                <LeaderboardRow
                  key={entry.user_id}
                  rank={entry.rank}
                  displayName={entry.display_name}
                  avatarUrl={entry.avatar_url}
                  level={entry.level}
                  xp={entry.total_xp || 0}
                  isCurrentUser={entry.user_id === currentUserId}
                />
              ))
            )}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

function EmptyState() {
  return (
    <div className="p-8 text-center">
      <p className="text-sm text-[var(--muted-foreground)]">
        No activity yet. Complete lessons to appear on the leaderboard!
      </p>
    </div>
  );
}
