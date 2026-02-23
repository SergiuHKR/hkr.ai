import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/lms/sign-out-button";
import { CourseCard } from "@/components/lms/course-card";
import { getCoursesWithProgress } from "@/lib/lms/queries";

export default async function LearnPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const courses = await getCoursesWithProgress(supabase);

  // Fetch course tags for display
  const { data: courseTags } = await supabase
    .from("course_tags")
    .select("course_id, tags(name)");

  const courseTagMap = new Map<string, { name: string }[]>();
  for (const ct of courseTags || []) {
    if (!courseTagMap.has(ct.course_id)) courseTagMap.set(ct.course_id, []);
    if (ct.tags) courseTagMap.get(ct.course_id)!.push(ct.tags as unknown as { name: string });
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Academy</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Welcome, {user?.user_metadata?.full_name || user?.email}
          </p>
        </div>
        <SignOutButton />
      </div>

      {/* Course grid */}
      {courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              tags={courseTagMap.get(course.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <p className="text-lg text-[var(--muted-foreground)]">
            No courses available yet. Check back soon!
          </p>
        </div>
      )}
    </main>
  );
}
