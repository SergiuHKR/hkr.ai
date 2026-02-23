"use client";

import { useRef, useState, useTransition } from "react";
import { addOrgDomain, removeOrgDomain } from "@/app/(lms)/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

export function OrgDomains({
  domains,
}: {
  domains: { id: string; domain: string }[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleAdd(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addOrgDomain(formData);
      if (result?.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  function handleRemove(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await removeOrgDomain(id);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h2 className="mb-4 text-sm font-semibold">
        SSO Domains ({domains.length})
      </h2>
      <p className="mb-3 text-xs text-[var(--muted-foreground)]">
        Users with these email domains are auto-assigned to this org on login.
      </p>

      {domains.length > 0 && (
        <div className="mb-3 space-y-1">
          {domains.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-lg bg-[var(--background)] px-3 py-2 font-mono text-sm"
            >
              <span>@{d.domain}</span>
              <button
                onClick={() => handleRemove(d.id)}
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
          name="domain"
          placeholder="example.com"
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
