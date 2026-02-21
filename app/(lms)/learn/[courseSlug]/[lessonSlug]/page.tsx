import { createClient } from "@/lib/supabase/server";
import { getLesson, isLessonCompleted } from "@/lib/lms/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Clock, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { CompleteLessonButton } from "@/components/lms/complete-lesson-button";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const supabase = await createClient();

  const result = await getLesson(supabase, courseSlug, lessonSlug);
  if (!result) notFound();

  const { course, module, lesson, prevLesson, nextLesson } = result;
  const completed = await isLessonCompleted(supabase, lesson.id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-[var(--muted-foreground)]">
        <Link href="/learn" className="hover:text-white transition-colors">
          AI Academy
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/learn/${courseSlug}`}
          className="hover:text-white transition-colors"
        >
          {course.title}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-white">{module.title}</span>
      </nav>

      {/* Lesson meta */}
      <div className="mb-6 flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
        {lesson.duration_minutes && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {lesson.duration_minutes} min read
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Zap className="h-4 w-4" />
          {lesson.xp_reward} XP
        </span>
        {completed && (
          <span className="text-[var(--primary)] font-medium">✓ Completed</span>
        )}
      </div>

      {/* Lesson content */}
      {lesson.content_md && (
        <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-[var(--muted-foreground)] prose-p:leading-relaxed prose-strong:text-white prose-li:text-[var(--muted-foreground)] prose-table:text-sm prose-th:text-left prose-th:text-white prose-td:text-[var(--muted-foreground)] prose-blockquote:border-[var(--primary)] prose-blockquote:text-[var(--muted-foreground)] prose-code:text-[var(--primary)]">
          <MDXRemote
            source={lesson.content_md}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </article>
      )}

      {/* Complete button */}
      <div className="mt-10 border-t border-[var(--border)] pt-8">
        <CompleteLessonButton
          lessonId={lesson.id}
          xpReward={lesson.xp_reward}
          isCompleted={completed}
          courseSlug={courseSlug}
          nextLessonSlug={nextLesson?.slug || null}
        />
      </div>

      {/* Prev / Next navigation */}
      <div className="mt-8 flex items-center justify-between">
        {prevLesson ? (
          <Link
            href={`/learn/${courseSlug}/${prevLesson.slug}`}
            className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {prevLesson.title}
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            href={`/learn/${courseSlug}/${nextLesson.slug}`}
            className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
          >
            {nextLesson.title}
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href={`/learn/${courseSlug}`}
            className="flex items-center gap-2 text-sm text-[var(--primary)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Back to course overview
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </main>
  );
}
