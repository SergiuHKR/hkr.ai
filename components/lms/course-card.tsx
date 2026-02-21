import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { CourseWithProgress } from "@/lib/lms/queries";

const tierColors: Record<string, string> = {
  beginner:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
  intermediate:
    "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  advanced:
    "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
};

export function CourseCard({ course }: { course: CourseWithProgress }) {
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
          <Badge
            variant="outline"
            className={tierColors[course.tier] || tierColors.beginner}
          >
            {course.tier}
          </Badge>
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
