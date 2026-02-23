"use client";

import { useRef, useState, useTransition } from "react";
import { createTag, updateTag, deleteTag } from "@/app/(lms)/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// ─── Create Tag ─────────────────────────────────────────────────────────────

export function CreateTagButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createTag(formData);
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
          New Tag
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[var(--card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Name</label>
            <Input name="name" required placeholder="e.g. Sales" className="bg-[var(--background)]" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Slug (auto-generated if empty)</label>
            <Input name="slug" placeholder="sales" className="bg-[var(--background)] font-mono" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Description</label>
            <Input name="description" placeholder="Sales team members" className="bg-[var(--background)]" />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating..." : "Create Tag"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Tag ───────────────────────────────────────────────────────────────

export function EditTagButton({
  tag,
}: {
  tag: { id: string; name: string; slug: string; description: string | null };
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateTag(tag.id, formData);
      if (result?.error) setError(result.error);
      else setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-white">
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[var(--card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle>Edit Tag</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Name</label>
            <Input name="name" required defaultValue={tag.name} className="bg-[var(--background)]" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted-foreground)]">Description</label>
            <Input name="description" defaultValue={tag.description || ""} className="bg-[var(--background)]" />
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

// ─── Delete Tag ─────────────────────────────────────────────────────────────

export function DeleteTagButton({ tagId, name }: { tagId: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-400">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[var(--card)] border-[var(--border)]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{name}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the tag from all users and courses. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[var(--border)]">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => startTransition(async () => { await deleteTag(tagId); })}
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
