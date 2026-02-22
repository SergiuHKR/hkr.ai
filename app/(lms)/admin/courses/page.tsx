import { createClient } from "@/lib/supabase/server";

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title, tier, is_published, sort_order, created_at")
    .order("sort_order");

  // Count lessons per course
  const courseIds = (courses || []).map((c: { id: string }) => c.id);
  const lessonCounts = new Map<string, number>();

  if (courseIds.length > 0) {
    for (const courseId of courseIds) {
      const { count } = await supabase
        .from("lessons")
        .select("id, modules!inner(course_id)", { count: "exact", head: true })
        .eq("modules.course_id", courseId);
      lessonCounts.set(courseId, count || 0);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        <span className="text-sm text-[var(--muted-foreground)]">
          {courses?.length || 0} total
        </span>
      </div>

      <div className="space-y-3">
        {(courses || []).map((course: {
          id: string;
          slug: string;
          title: string;
          tier: string;
          is_published: boolean;
          sort_order: number;
        }) => (
          <div
            key={course.id}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-medium text-white">{course.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  /{course.slug} · {lessonCounts.get(course.id) || 0} lessons · {course.tier}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                  course.is_published
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "bg-[var(--muted-foreground)]/10 text-[var(--muted-foreground)]"
                }`}
              >
                {course.is_published ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
