import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Get counts
  const [
    { count: userCount },
    { count: courseCount },
    { count: lessonCount },
    { count: achievementCount },
    { count: tagCount },
  ] = await Promise.all([
    supabase.from("user_profiles").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("achievements").select("*", { count: "exact", head: true }),
    supabase.from("tags").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Users", value: userCount || 0 },
    { label: "Courses", value: courseCount || 0 },
    { label: "Lessons", value: lessonCount || 0 },
    { label: "Achievements", value: achievementCount || 0 },
    { label: "Tags", value: tagCount || 0 },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Admin Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <p className="text-xs text-[var(--muted-foreground)]">{stat.label}</p>
            <p className="mt-1 font-mono text-3xl font-bold text-[var(--primary)]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
