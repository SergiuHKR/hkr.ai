import { DynamicIcon } from "@/components/lms/dynamic-icon";

type RowProps = {
  rank: number;
  displayName: string | null;
  avatarUrl: string | null;
  level: number;
  xp: number;
  isCurrentUser: boolean;
};

export function LeaderboardRow({
  rank,
  displayName,
  level,
  xp,
  isCurrentUser,
}: RowProps) {
  const rankIcon =
    rank === 1 ? "trophy" : rank === 2 ? "medal" : rank === 3 ? "award" : null;

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 transition-colors ${
        isCurrentUser
          ? "bg-[var(--primary)]/5 border-l-2 border-[var(--primary)]"
          : "hover:bg-white/[0.02]"
      }`}
    >
      {/* Rank */}
      <div className="flex w-8 shrink-0 items-center justify-center">
        {rankIcon ? (
          <DynamicIcon
            name={rankIcon}
            className={`h-5 w-5 ${
              rank === 1
                ? "text-yellow-400"
                : rank === 2
                  ? "text-gray-300"
                  : "text-amber-600"
            }`}
          />
        ) : (
          <span className="font-mono text-sm text-[var(--muted-foreground)]">
            {rank}
          </span>
        )}
      </div>

      {/* Avatar placeholder + name */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--muted-foreground)]/10 font-mono text-xs text-[var(--muted-foreground)]">
          {(displayName || "?")[0]?.toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className={`truncate text-sm ${isCurrentUser ? "font-semibold text-white" : "text-white"}`}>
            {displayName || "Anonymous"}
            {isCurrentUser && (
              <span className="ml-1.5 text-[10px] text-[var(--primary)]">(you)</span>
            )}
          </p>
          <p className="font-mono text-[10px] text-[var(--muted-foreground)]">
            LVL {level}
          </p>
        </div>
      </div>

      {/* XP */}
      <div className="text-right">
        <span className="font-mono text-sm font-semibold text-[var(--primary)]">
          {xp.toLocaleString()}
        </span>
        <span className="ml-1 font-mono text-[10px] text-[var(--muted-foreground)]">
          XP
        </span>
      </div>
    </div>
  );
}
