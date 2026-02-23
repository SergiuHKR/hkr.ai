"use client";

import { useRef, useState, useTransition } from "react";
import { createCourse, updateCourse, deleteCourse, toggleCoursePublish, setCourseTags } from "@/app/(lms)/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  tier: string;
  is_published: boolean;
  sort_order: number;
};

type TagItem = { id: string; name: string; slug: string };

// ─── Create Course Dialog ───────────────────────────────────────────────────

export function CreateCourseButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createCourse(formData);
      if (result?.error) setError(result.error);
      else {
        formRef.current?.reset();
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          New Course
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[var(--card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Title</label>
            <Input name="title" required className="bg-[var(--background)]" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Slug</label>
            <Input name="slug" required placeholder="ai-literacy" className="bg-[var(--background)] font-mono" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Description</label>
            <Textarea name="description" rows={3} className="bg-[var(--background)]" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Difficulty</label>
              <select
                name="tier"
                defaultValue="beginner"
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex items-end gap-2 pb-1">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_published" value="true" className="rounded" />
                Published
              </label>
            </div>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Course Dialog ─────────────────────────────────────────────────────

export function EditCourseButton({ course }: { course: Course }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateCourse(course.id, formData);
      if (result?.error) setError(result.error);
      else setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-white">
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[var(--card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Title</label>
            <Input name="title" required defaultValue={course.title} className="bg-[var(--background)]" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Description</label>
            <Textarea name="description" rows={3} defaultValue={course.description || ""} className="bg-[var(--background)]" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Difficulty</label>
              <select
                name="tier"
                defaultValue={course.tier}
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex items-end gap-2 pb-1">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="is_published"
                  value="true"
                  defaultChecked={course.is_published}
                  className="rounded"
                />
                Published
              </label>
            </div>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Course ──────────────────────────────────────────────────────────

export function DeleteCourseButton({ courseId, title }: { courseId: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteCourse(courseId);
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="rounded p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-400">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[var(--card)] border-[var(--border)]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{title}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the course and all its modules and lessons. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[var(--border)]">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Toggle Publish ─────────────────────────────────────────────────────────

export function TogglePublishButton({
  courseId,
  isPublished,
}: {
  courseId: string;
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(async () => { await toggleCoursePublish(courseId, !isPublished); })}
      disabled={isPending}
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors ${
        isPublished
          ? "bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20"
          : "bg-[var(--muted-foreground)]/10 text-[var(--muted-foreground)] hover:bg-[var(--muted-foreground)]/20"
      } disabled:opacity-50`}
    >
      {isPublished ? "Published" : "Draft"}
    </button>
  );
}

// ─── Course Tag Assignment ──────────────────────────────────────────────────

export function CourseTagsButton({
  courseId,
  currentTagIds,
  allTags,
}: {
  courseId: string;
  currentTagIds: string[];
  allTags: TagItem[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(currentTagIds));
  const [isPending, startTransition] = useTransition();

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSave() {
    startTransition(async () => {
      await setCourseTags(courseId, Array.from(selected));
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-white">
          <Tag className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[var(--card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle>Course Tags</DialogTitle>
        </DialogHeader>
        {allTags.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">No tags exist. Create tags first.</p>
        ) : (
          <div className="space-y-2">
            {allTags.map((tag) => (
              <label
                key={tag.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[var(--background)]"
              >
                <input
                  type="checkbox"
                  checked={selected.has(tag.id)}
                  onChange={() => toggle(tag.id)}
                  className="rounded"
                />
                <span className="text-sm">{tag.name}</span>
                <span className="text-xs text-[var(--muted-foreground)]">{tag.slug}</span>
              </label>
            ))}
          </div>
        )}
        <Button onClick={handleSave} disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Save Tags"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
