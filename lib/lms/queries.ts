import { SupabaseClient } from "@supabase/supabase-js";

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  tier: string;
  cover_image: string | null;
  sort_order: number;
};

export type Module = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  course_id: string;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  content_md: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  xp_reward: number;
  sort_order: number;
  module_id: string;
};

export type UserProgress = {
  lesson_id: string;
  completed_at: string;
  xp_earned: number;
};

export type CourseWithProgress = Course & {
  total_lessons: number;
  completed_lessons: number;
  total_xp: number;
  earned_xp: number;
};

/** Fetch all published courses with user progress stats */
export async function getCoursesWithProgress(
  supabase: SupabaseClient
): Promise<CourseWithProgress[]> {
  // Get all published courses
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  if (coursesError) throw coursesError;
  if (!courses || courses.length === 0) return [];

  // Get modules for published courses
  const courseIds = courses.map((c: Course) => c.id);
  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("id, course_id")
    .in("course_id", courseIds);

  if (modulesError) throw modulesError;

  // Get lessons for those modules
  const moduleIds = (modules || []).map((m: { id: string }) => m.id);
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, xp_reward, module_id")
    .in("module_id", moduleIds);

  if (lessonsError) throw lessonsError;

  // Get user progress
  const lessonIds = (lessons || []).map((l: { id: string }) => l.id);
  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .in("lesson_id", lessonIds);

  if (progressError) throw progressError;

  const completedLessonIds = new Set(
    (progress || []).map((p: { lesson_id: string }) => p.lesson_id)
  );

  // Build module → course mapping
  const moduleToCourse = new Map<string, string>();
  for (const mod of modules || []) {
    moduleToCourse.set(mod.id, mod.course_id);
  }

  // Build course stats
  type LessonRow = { id: string; xp_reward: number; module_id: string };
  return courses.map((course: Course) => {
    const courseLessons = (lessons || []).filter(
      (l: LessonRow) => moduleToCourse.get(l.module_id) === course.id
    );
    const completedLessons = courseLessons.filter((l: LessonRow) =>
      completedLessonIds.has(l.id)
    );
    const totalXp = courseLessons.reduce(
      (sum: number, l: LessonRow) => sum + l.xp_reward,
      0
    );
    const earnedXp = completedLessons.reduce(
      (sum: number, l: LessonRow) => sum + l.xp_reward,
      0
    );

    return {
      ...course,
      total_lessons: courseLessons.length,
      completed_lessons: completedLessons.length,
      total_xp: totalXp,
      earned_xp: earnedXp,
    };
  });
}

/** Fetch a single course by slug with all modules and lessons */
export async function getCourseBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<{ course: Course; modules: Module[] } | null> {
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (courseError || !course) return null;

  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", course.id)
    .order("sort_order")
    .order("sort_order", { referencedTable: "lessons" });

  if (modulesError) throw modulesError;

  return { course, modules: modules || [] };
}

/** Fetch a single lesson by slug (within a module of a course) */
export async function getLesson(
  supabase: SupabaseClient,
  courseSlug: string,
  lessonSlug: string
): Promise<{
  course: Course;
  module: Module;
  lesson: Lesson;
  prevLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
} | null> {
  // Get course
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", courseSlug)
    .eq("is_published", true)
    .single();

  if (courseError || !course) return null;

  // Get all modules with lessons for this course (for prev/next navigation)
  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", course.id)
    .order("sort_order")
    .order("sort_order", { referencedTable: "lessons" });

  if (modulesError || !modules) return null;

  // Flatten all lessons in order
  const allLessons: { lesson: Lesson; module: Module }[] = [];
  for (const mod of modules) {
    for (const lesson of mod.lessons || []) {
      allLessons.push({ lesson, module: mod });
    }
  }

  // Find current lesson
  const currentIndex = allLessons.findIndex(
    (l) => l.lesson.slug === lessonSlug
  );
  if (currentIndex === -1) return null;

  const { lesson, module } = allLessons[currentIndex];
  const prevLesson =
    currentIndex > 0
      ? {
          slug: allLessons[currentIndex - 1].lesson.slug,
          title: allLessons[currentIndex - 1].lesson.title,
        }
      : null;
  const nextLesson =
    currentIndex < allLessons.length - 1
      ? {
          slug: allLessons[currentIndex + 1].lesson.slug,
          title: allLessons[currentIndex + 1].lesson.title,
        }
      : null;

  return { course, module, lesson, prevLesson, nextLesson };
}

/** Check if user completed a lesson */
export async function isLessonCompleted(
  supabase: SupabaseClient,
  lessonId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("user_progress")
    .select("id")
    .eq("lesson_id", lessonId)
    .maybeSingle();

  return !!data;
}

/** Get user's completed lesson IDs for a course */
export async function getCompletedLessonIds(
  supabase: SupabaseClient,
  courseId: string
): Promise<Set<string>> {
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, modules!inner(course_id)")
    .eq("modules.course_id", courseId);

  if (!lessons || lessons.length === 0) return new Set();

  const lessonIds = lessons.map((l: { id: string }) => l.id);

  const { data: progress } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .in("lesson_id", lessonIds);

  return new Set((progress || []).map((p: { lesson_id: string }) => p.lesson_id));
}
