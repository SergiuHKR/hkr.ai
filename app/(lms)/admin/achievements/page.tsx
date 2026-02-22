import { createClient } from "@/lib/supabase/server";

export default async function AdminAchievementsPage() {
  const supabase = await createClient();

  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Achievements</h1>
        <span className="text-sm text-[var(--muted-foreground)]">
          {achievements?.length || 0} total
        </span>
      </div>

      <div className="space-y-3">
        {(achievements || []).map((a: {
          id: string;
          slug: string;
          title: string;
          description: string;
          icon: string;
          criteria_type: string;
          criteria_value: Record<string, unknown>;
          sort_order: number;
        }) => (
          <div
            key={a.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div>
              <h3 className="font-medium text-white">{a.title}</h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                {a.description}
              </p>
              <p className="mt-1 font-mono text-[10px] text-[var(--muted-foreground)]">
                Type: {a.criteria_type} · Criteria: {JSON.stringify(a.criteria_value)}
              </p>
            </div>
            <span className="rounded-full bg-[var(--primary)]/10 px-2.5 py-0.5 text-[10px] font-medium text-[var(--primary)]">
              #{a.sort_order}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
