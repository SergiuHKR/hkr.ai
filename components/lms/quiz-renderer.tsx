"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Circle } from "lucide-react";

type QuizQuestion = {
  id: string;
  question: string;
  type: "multiple_choice_multi" | "free_text";
  sort_order: number;
  options: {
    id: string;
    text: string;
    is_correct: boolean;
    sort_order: number;
  }[];
};

type QuizRendererProps = {
  lessonId: string;
  questions: QuizQuestion[];
  userId: string;
};

export function QuizRenderer({ lessonId, questions, userId }: QuizRendererProps) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [freeTextAnswers, setFreeTextAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleToggleOption = (questionId: string, optionId: string) => {
    if (submitted) return;
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter((id) => id !== optionId) };
      }
      return { ...prev, [questionId]: [...current, optionId] };
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    // Grade locally
    const graded: Record<string, boolean> = {};
    for (const q of questions) {
      if (q.type === "multiple_choice_multi") {
        const selected = new Set(answers[q.id] || []);
        const correct = new Set(q.options.filter((o) => o.is_correct).map((o) => o.id));
        graded[q.id] =
          selected.size === correct.size &&
          [...selected].every((id) => correct.has(id));
      } else {
        // Free text — always mark as "submitted" (needs manual review)
        graded[q.id] = true;
      }
    }

    setResults(graded);

    // Save submission to DB
    const supabase = createClient();
    const answersPayload: Record<string, string[] | string> = {};
    for (const q of questions) {
      if (q.type === "free_text") {
        answersPayload[q.id] = freeTextAnswers[q.id] || "";
      } else {
        answersPayload[q.id] = answers[q.id] || [];
      }
    }

    await supabase.from("user_quiz_submissions").insert({
      user_id: userId,
      lesson_id: lessonId,
      attempt_number: 1,
      answers: answersPayload,
    });

    setSubmitted(true);
    setSubmitting(false);
  };

  const correctCount = Object.values(results).filter(Boolean).length;
  const totalQuestions = questions.length;

  return (
    <div className="space-y-6">
      {submitted && (
        <div className={`rounded-xl border p-4 ${
          correctCount === totalQuestions
            ? "border-[var(--primary)]/30 bg-[var(--primary)]/5"
            : "border-orange-400/30 bg-orange-400/5"
        }`}>
          <p className="font-medium">
            Score: {correctCount}/{totalQuestions}
            {correctCount === totalQuestions ? " — Perfect!" : ""}
          </p>
        </div>
      )}

      {questions.map((q, idx) => (
        <div key={q.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="mb-4 font-medium">
            <span className="text-[var(--primary)]">{idx + 1}.</span> {q.question}
          </p>

          {q.type === "multiple_choice_multi" ? (
            <div className="space-y-2">
              {q.options.map((opt) => {
                const isSelected = (answers[q.id] || []).includes(opt.id);
                const showResult = submitted;
                let bgClass = "bg-[var(--background)] hover:bg-[var(--background)]/80";
                let IconComponent = Circle;

                if (showResult) {
                  if (opt.is_correct) {
                    bgClass = "bg-[var(--primary)]/10 border-[var(--primary)]/30";
                    IconComponent = CheckCircle2;
                  } else if (isSelected && !opt.is_correct) {
                    bgClass = "bg-red-500/10 border-red-500/30";
                    IconComponent = XCircle;
                  }
                } else if (isSelected) {
                  bgClass = "bg-[var(--primary)]/10 border-[var(--primary)]/30";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleToggleOption(q.id, opt.id)}
                    disabled={submitted}
                    className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${bgClass} ${
                      submitted ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 shrink-0 ${
                      showResult && opt.is_correct
                        ? "text-[var(--primary)]"
                        : showResult && isSelected && !opt.is_correct
                        ? "text-red-400"
                        : isSelected
                        ? "text-[var(--primary)]"
                        : "text-[var(--muted-foreground)]"
                    }`} />
                    {opt.text}
                  </button>
                );
              })}
            </div>
          ) : (
            <textarea
              value={freeTextAnswers[q.id] || ""}
              onChange={(e) =>
                setFreeTextAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
              disabled={submitted}
              placeholder="Type your answer..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
              rows={4}
            />
          )}
        </div>
      ))}

      {!submitted && (
        <Button onClick={handleSubmit} disabled={submitting} size="sm">
          {submitting ? "Submitting..." : "Submit Quiz"}
        </Button>
      )}
    </div>
  );
}
