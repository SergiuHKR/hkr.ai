"use client";

import { useRef, useState, useTransition } from "react";
import { addAllowlistEmail, removeAllowlistEmail } from "@/app/(lms)/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

export function OrgAllowlist({
  allowlist,
}: {
  allowlist: { id: string; email: string }[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleAdd(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addAllowlistEmail(formData);
      if (result?.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  function handleRemove(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await removeAllowlistEmail(id);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h2 className="mb-4 text-sm font-semibold">
        Email Allowlist ({allowlist.length})
      </h2>
      <p className="mb-3 text-xs text-[var(--muted-foreground)]">
        Individual emails allowed access regardless of domain.
      </p>

      {allowlist.length > 0 && (
        <div className="mb-3 space-y-1">
          {allowlist.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-lg bg-[var(--background)] px-3 py-2 font-mono text-sm"
            >
              <span>{a.email}</span>
              <button
                onClick={() => handleRemove(a.id)}
                disabled={isPending}
                className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form ref={formRef} action={handleAdd} className="flex gap-2">
        <Input
          name="email"
          type="email"
          placeholder="user@example.com"
          className="h-9 flex-1 bg-[var(--background)] text-sm"
          disabled={isPending}
        />
        <Button type="submit" size="sm" disabled={isPending} className="h-9 gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </form>

      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
