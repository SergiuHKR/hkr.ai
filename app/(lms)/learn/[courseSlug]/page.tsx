import { createClient } from "@/lib/supabase/server";
import { getCourseBySlug, getCompletedLessonIds } from "@/lib/lms/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, Zap } from "lucide-react";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const supabase = await createClient();

  const result = await getCourseBySlug(supabase, courseSlug);
  if (!result) notFound();

  const { course, modules } = result;
  const completedIds = await getCompletedLessonIds(supabase, course.id);

  // Stats
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => completedIds.has(l.id)).length,
    0
  );
  const totalXp = modules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.xp_reward, 0),
    0
  );
  const earnedXp = modules.reduce(
    (sum, m) =>
      sum +
      m.lessons
        .filter((l) => completedIds.has(l.id))
        .reduce((s, l) => s + l.xp_reward, 0),
    0
  );
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Find first incomplete lesson for "Continue" button
  let nextLessonSlug: string | null = null;
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (!completedIds.has(lesson.id)) {
        nextLessonSlug = lesson.slug;
        break;
      }
    }
    if (nextLessonSlug) break;
  }

  // Fetch course tags
  const { data: courseTagRows } = await supabase
    .from("course_tags")
    .select("tags(name)")
    .eq("course_id", course.id);
  const courseTags = (courseTagRows || [])
    .map((ct) => (ct.tags as unknown as { name: string })?.name)
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--muted-foreground)]">
        <Link href="/learn" className="hover:text-white transition-colors">
          Learning Platform
        </Link>
        <span className="mx-2">›</span>
        <span className="text-white">{course.title}</span>
      </nav>

      {/* Course header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          {courseTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--primary)]"
            >
              {tag}
            </span>
          ))}
          <span className="text-xs text-[var(--muted-foreground)]">
            {totalLessons} lessons
          </span>
        </div>
        <h1 className="mb-3 text-3xl font-bold">{course.title}</h1>
        <p className="text-[var(--muted-foreground)] leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-[var(--muted-foreground)]">
            {completedCount}/{totalLessons} lessons completed
          </span>
          <span className="font-medium text-[var(--primary)]">
            {earnedXp}/{totalXp} XP
          </span>
        </div>
        <Progress value={progressPercent} className="h-2.5" />

        {nextLessonSlug && (
          <Link
            href={`/learn/${courseSlug}/${nextLessonSlug}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            {completedCount > 0 ? "Continue learning" : "Start course"}
            <span>→</span>
          </Link>
        )}

        {progressPercent === 100 && (
          <p className="mt-4 text-sm font-medium text-[var(--primary)]">
            🎉 Course completed! You earned {earnedXp} XP.
          </p>
        )}
      </div>

      {/* Modules & lessons */}
      <div className="space-y-6">
        {modules.map((mod) => {
          const moduleCompleted = mod.lessons.every((l) =>
            completedIds.has(l.id)
          );
          const moduleLessonsCompleted = mod.lessons.filter((l) =>
            completedIds.has(l.id)
          ).length;

          return (
            <div
              key={mod.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
            >
              {/* Module header */}
              <div className="border-b border-[var(--border)] px-5 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">{mod.title}</h2>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {moduleLessonsCompleted}/{mod.lessons.length}
                    {moduleCompleted && " ✓"}
                  </span>
                </div>
                {mod.description && (
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {mod.description}
                  </p>
                )}
              </div>

              {/* Lessons list */}
              <div className="divide-y divide-[var(--border)]">
                {mod.lessons.map((lesson) => {
                  const isCompleted = completedIds.has(lesson.id);

                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/${courseSlug}/${lesson.slug}`}
                      className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-[var(--muted-foreground)]/50" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-medium ${isCompleted ? "text-[var(--muted-foreground)]" : "text-white"}`}
                        >
                          {lesson.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                        {lesson.duration_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lesson.duration_minutes}m
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {lesson.xp_reward} XP
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
