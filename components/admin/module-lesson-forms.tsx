"use client";

import { useRef, useState, useTransition } from "react";
import {
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
} from "@/app/(lms)/admin/actions";
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
import { Plus, Pencil, Trash2 } from "lucide-react";

// ─── Create Module ──────────────────────────────────────────────────────────

export function CreateModuleButton({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createModule(formData);
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
        <Button size="sm" variant="outline" className="gap-1.5 border-[var(--border)]">
          <Plus className="h-3.5 w-3.5" />
          Add Module
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[var(--card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle>Create Module</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <input type="hidden" name="course_id" value={courseId} />
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Title</label>
            <Input name="title" required className="bg-[var(--background)]" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Slug</label>
            <Input name="slug" required placeholder="module-1" className="bg-[var(--background)] font-mono" />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating..." : "Create Module"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Module ────────────────────────────────────────────────────────────

export function EditModuleButton({ moduleId, title }: { moduleId: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateModule(moduleId, formData);
      if (result?.error) setError(result.error);
      else setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-white">
          <Pencil className="h-3 w-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[var(--card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Title</label>
            <Input name="title" required defaultValue={title} className="bg-[var(--background)]" />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Module ──────────────────────────────────────────────────────────

export function DeleteModuleButton({ moduleId, title }: { moduleId: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-400">
          <Trash2 className="h-3 w-3" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[var(--card)] border-[var(--border)]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{title}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the module and all its lessons.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[var(--border)]">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => startTransition(async () => { await deleteModule(moduleId); })}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Create Lesson ──────────────────────────────────────────────────────────

export function CreateLessonButton({ moduleId }: { moduleId: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createLesson(formData);
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
        <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-white">
          <Plus className="h-3 w-3" />
          Lesson
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[var(--card)] border-[var(--border)] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Lesson</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <input type="hidden" name="module_id" value={moduleId} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Title</label>
              <Input name="title" required className="bg-[var(--background)]" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Slug</label>
              <Input name="slug" required placeholder="intro-to-ai" className="bg-[var(--background)] font-mono" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Type</label>
              <select
                name="type"
                defaultValue="text"
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm"
              >
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="quiz">Quiz</option>
                <option value="task">Task</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Duration (min)</label>
              <Input name="duration_minutes" type="number" defaultValue="5" min="1" className="bg-[var(--background)]" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--muted-foreground)]">XP Reward</label>
              <Input name="xp_reward" type="number" defaultValue="10" min="0" className="bg-[var(--background)]" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Content (Markdown)</label>
            <Textarea name="content_md" rows={10} placeholder="# Lesson Title&#10;&#10;Write your lesson content here..." className="bg-[var(--background)] font-mono text-sm" />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating..." : "Create Lesson"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Lesson ────────────────────────────────────────────────────────────

type LessonData = {
  id: string;
  title: string;
  slug: string;
  type: string;
  content_md: string | null;
  duration_minutes: number;
  xp_reward: number;
};

export function EditLessonButton({ lesson }: { lesson: LessonData }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateLesson(lesson.id, formData);
      if (result?.error) setError(result.error);
      else setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-white">
          <Pencil className="h-3 w-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[var(--card)] border-[var(--border)] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Title</label>
            <Input name="title" required defaultValue={lesson.title} className="bg-[var(--background)]" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Type</label>
              <select
                name="type"
                defaultValue={lesson.type}
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm"
              >
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="quiz">Quiz</option>
                <option value="task">Task</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Duration (min)</label>
              <Input name="duration_minutes" type="number" defaultValue={lesson.duration_minutes} min="1" className="bg-[var(--background)]" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--muted-foreground)]">XP Reward</label>
              <Input name="xp_reward" type="number" defaultValue={lesson.xp_reward} min="0" className="bg-[var(--background)]" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Content (Markdown)</label>
            <Textarea name="content_md" rows={12} defaultValue={lesson.content_md || ""} className="bg-[var(--background)] font-mono text-sm" />
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

// ─── Delete Lesson ──────────────────────────────────────────────────────────

export function DeleteLessonButton({ lessonId, title }: { lessonId: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-400">
          <Trash2 className="h-3 w-3" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[var(--card)] border-[var(--border)]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{title}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this lesson and any associated progress data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[var(--border)]">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => startTransition(async () => { await deleteLesson(lessonId); })}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
