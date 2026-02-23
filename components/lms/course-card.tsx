import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import type { CourseWithProgress } from "@/lib/lms/queries";

export function CourseCard({ course, tags }: { course: CourseWithProgress; tags?: { name: string }[] }) {
  const progressPercent =
    course.total_lessons > 0
      ? Math.round((course.completed_lessons / course.total_lessons) * 100)
      : 0;

  const isCompleted = progressPercent === 100;
  const isStarted = course.completed_lessons > 0;

  return (
    <Link href={`/learn/${course.slug}`}>
      <div className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--primary)]/40 hover:shadow-lg hover:shadow-[var(--primary)]/5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(tags || []).map((tag) => (
              <span
                key={tag.name}
                className="rounded-full bg-[var(--primary)]/10 px-2.5 py-0.5 text-[10px] font-medium text-[var(--primary)]"
              >
                {tag.name}
              </span>
            ))}
          </div>
          {isCompleted && (
            <span className="text-sm text-[var(--primary)]">✓ Completed</span>
          )}
        </div>

        {/* Title & description */}
        <h3 className="mb-2 text-xl font-semibold group-hover:text-[var(--primary)] transition-colors">
          {course.title}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {course.description}
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span>
              {course.completed_lessons}/{course.total_lessons} lessons
            </span>
            <span>{course.earned_xp} / {course.total_xp} XP</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* CTA */}
        <div className="mt-4 text-sm font-medium text-[var(--primary)]">
          {isCompleted
            ? "Review course →"
            : isStarted
              ? "Continue learning →"
              : "Start course →"}
        </div>
      </div>
    </Link>
  );
}
