"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ExternalLink, Clock } from "lucide-react";

type TaskSubmissionProps = {
  lessonId: string;
  userId: string;
  existingSubmission?: {
    id: string;
    submission_url: string;
    submitted_at: string;
    reviewed_at: string | null;
  } | null;
};

export function TaskSubmission({ lessonId, userId, existingSubmission }: TaskSubmissionProps) {
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(existingSubmission || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setSubmitting(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_task_submissions")
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        submission_url: url.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setSubmission(data);
    }
    setSubmitting(false);
  };

  if (submission) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-start gap-3">
          {submission.reviewed_at ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
          ) : (
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
          )}
          <div>
            <p className="font-medium text-white">
              {submission.reviewed_at ? "Reviewed" : "Pending Review"}
            </p>
            <a
              href={submission.submission_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
            >
              {submission.submission_url}
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Submitted {new Date(submission.submitted_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h3 className="mb-2 text-sm font-semibold">Submit Your Work</h3>
      <p className="mb-4 text-xs text-[var(--muted-foreground)]">
        Paste a link to your completed task (GitHub repo, Google Doc, etc.)
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/..."
          className="flex-1 bg-[var(--background)]"
          type="url"
          required
        />
        <Button type="submit" disabled={submitting} size="sm">
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
