import { createClient } from "@/lib/supabase/server";

export default async function AdminSeasonsPage() {
  const supabase = await createClient();

  const { data: seasons } = await supabase
    .from("seasons")
    .select("*")
    .order("starts_at", { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Seasons</h1>
        <span className="text-sm text-[var(--muted-foreground)]">
          {seasons?.length || 0} total
        </span>
      </div>

      <div className="space-y-3">
        {(seasons || []).map((season: {
          id: string;
          name: string;
          slug: string;
          starts_at: string;
          ends_at: string;
          is_active: boolean;
        }) => (
          <div
            key={season.id}
            className={`flex items-center justify-between rounded-xl border p-4 ${
              season.is_active
                ? "border-[var(--primary)]/30 bg-[var(--primary)]/5"
                : "border-[var(--border)] bg-[var(--card)]"
            }`}
          >
            <div>
              <h3 className="font-medium text-white">{season.name}</h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                {new Date(season.starts_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {" — "}
                {new Date(season.ends_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                season.is_active
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "bg-[var(--muted-foreground)]/10 text-[var(--muted-foreground)]"
              }`}
            >
              {season.is_active ? "Active" : "Ended"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
