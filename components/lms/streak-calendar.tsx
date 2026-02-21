"use client";

export function StreakCalendar({
  streakDates,
  days = 30,
}: {
  streakDates: string[];
  days?: number;
}) {
  const dateSet = new Set(streakDates);
  const today = new Date();
  const cells: { date: string; active: boolean; isToday: boolean }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    cells.push({
      date: dateStr,
      active: dateSet.has(dateStr),
      isToday: i === 0,
    });
  }

  // Group by weeks (rows of 7)
  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="space-y-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex gap-1">
          {week.map((cell) => (
            <div
              key={cell.date}
              title={cell.date}
              className={`h-4 w-4 rounded-sm transition-colors ${
                cell.active
                  ? "bg-[var(--primary)]"
                  : "bg-[var(--muted-foreground)]/10"
              } ${cell.isToday ? "ring-1 ring-white/30" : ""}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
