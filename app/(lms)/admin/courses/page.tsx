import { createClient } from "@/lib/supabase/server";
import {
  CreateCourseButton,
  EditCourseButton,
  DeleteCourseButton,
  TogglePublishButton,
  CourseTagsButton,
  ReorderCourseButtons,
} from "@/components/admin/course-form";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title, description, is_published, sort_order, created_at")
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

  // Get all tags + course-tag mappings
  const { data: allTags } = await supabase
    .from("tags")
    .select("id, name, slug")
    .order("name");

  const { data: courseTags } = await supabase
    .from("course_tags")
    .select("course_id, tag_id");

  const courseTagMap = new Map<string, string[]>();
  for (const ct of courseTags || []) {
    if (!courseTagMap.has(ct.course_id)) courseTagMap.set(ct.course_id, []);
    courseTagMap.get(ct.course_id)!.push(ct.tag_id);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--muted-foreground)]">
            {courses?.length || 0} total
          </span>
          <CreateCourseButton />
        </div>
      </div>

      <div className="space-y-3">
        {(courses || []).map(
          (course: {
            id: string;
            slug: string;
            title: string;
            description: string | null;
            is_published: boolean;
            sort_order: number;
          }, index: number) => (
            <div
              key={course.id}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="flex items-center gap-4">
                <ReorderCourseButtons
                  courseId={course.id}
                  isFirst={index === 0}
                  isLast={index === (courses?.length || 1) - 1}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{course.title}</h3>
                    {(courseTagMap.get(course.id) || []).length > 0 && (
                      <div className="flex gap-1">
                        {(courseTagMap.get(course.id) || []).map((tagId) => {
                          const tag = (allTags || []).find(
                            (t: { id: string }) => t.id === tagId
                          );
                          return tag ? (
                            <span
                              key={tagId}
                              className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] text-[var(--primary)]"
                            >
                              {(tag as { name: string }).name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    /{course.slug} · {lessonCounts.get(course.id) || 0} lessons
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TogglePublishButton
                  courseId={course.id}
                  isPublished={course.is_published}
                />
                <CourseTagsButton
                  courseId={course.id}
                  currentTagIds={courseTagMap.get(course.id) || []}
                  allTags={
                    (allTags || []) as { id: string; name: string; slug: string }[]
                  }
                />
                <EditCourseButton course={course} />
                <DeleteCourseButton courseId={course.id} title={course.title} />
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="rounded p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )
        )}

        {(!courses || courses.length === 0) && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
            <p className="text-[var(--muted-foreground)]">
              No courses yet. Create your first course to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
