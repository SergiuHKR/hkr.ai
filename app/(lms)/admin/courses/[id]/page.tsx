import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  CreateModuleButton,
  EditModuleButton,
  DeleteModuleButton,
  CreateLessonButton,
  EditLessonButton,
  DeleteLessonButton,
} from "@/components/admin/module-lesson-forms";

type Lesson = {
  id: string;
  title: string;
  slug: string;
  type: string;
  content_md: string | null;
  duration_minutes: number;
  xp_reward: number;
  sort_order: number;
};

type Module = {
  id: string;
  title: string;
  slug: string;
  sort_order: number;
  lessons: Lesson[];
};

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (!course) notFound();

  const { data: modules } = await supabase
    .from("modules")
    .select("id, title, slug, sort_order")
    .eq("course_id", id)
    .order("sort_order");

  // Get lessons for all modules
  const moduleIds = (modules || []).map((m: { id: string }) => m.id);
  let allLessons: Lesson[] = [];
  if (moduleIds.length > 0) {
    const { data } = await supabase
      .from("lessons")
      .select("id, title, slug, type, content_md, duration_minutes, xp_reward, sort_order, module_id")
      .in("module_id", moduleIds)
      .order("sort_order");
    allLessons = (data || []) as (Lesson & { module_id: string })[];
  }

  // Group lessons by module
  const lessonsByModule = new Map<string, Lesson[]>();
  for (const lesson of allLessons as (Lesson & { module_id: string })[]) {
    if (!lessonsByModule.has(lesson.module_id))
      lessonsByModule.set(lesson.module_id, []);
    lessonsByModule.get(lesson.module_id)!.push(lesson);
  }

  const modulesWithLessons: Module[] = (modules || []).map(
    (m: { id: string; title: string; slug: string; sort_order: number }) => ({
      ...m,
      lessons: lessonsByModule.get(m.id) || [],
    })
  );

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/courses"
          className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Courses
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              /{course.slug} · {course.is_published ? "Published" : "Draft"}
            </p>
          </div>
          <CreateModuleButton courseId={id} />
        </div>
      </div>

      {modulesWithLessons.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <p className="text-[var(--muted-foreground)]">
            No modules yet. Add a module to start building this course.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {modulesWithLessons.map((mod, mi) => (
            <div
              key={mod.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)]"
            >
              {/* Module header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)]/10 text-xs font-bold text-[var(--primary)]">
                    {mi + 1}
                  </span>
                  <h2 className="text-sm font-semibold">{mod.title}</h2>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {mod.lessons.length} lesson{mod.lessons.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <CreateLessonButton moduleId={mod.id} />
                  <EditModuleButton moduleId={mod.id} title={mod.title} />
                  <DeleteModuleButton moduleId={mod.id} title={mod.title} />
                </div>
              </div>

              {/* Lessons */}
              {mod.lessons.length > 0 ? (
                <div className="divide-y divide-[var(--border)]">
                  {mod.lessons.map((lesson, li) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between px-5 py-3 hover:bg-[var(--background)]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center text-xs text-[var(--muted-foreground)]">
                          {li + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {lesson.type} · {lesson.duration_minutes}min ·{" "}
                            {lesson.xp_reward} XP
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="rounded-full bg-[var(--muted-foreground)]/10 px-2 py-0.5 text-[10px] text-[var(--muted-foreground)]">
                          {lesson.type}
                        </span>
                        <EditLessonButton lesson={lesson} />
                        <DeleteLessonButton
                          lessonId={lesson.id}
                          title={lesson.title}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-4 text-center text-xs text-[var(--muted-foreground)]">
                  No lessons in this module yet.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
