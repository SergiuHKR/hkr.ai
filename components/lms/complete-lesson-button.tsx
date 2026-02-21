"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Loader2 } from "lucide-react";
import { AchievementCelebration } from "@/components/lms/achievement-celebration";

type NewAchievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export function CompleteLessonButton({
  lessonId,
  xpReward,
  isCompleted,
  courseSlug,
  nextLessonSlug,
}: {
  lessonId: string;
  xpReward: number;
  isCompleted: boolean;
  courseSlug: string;
  nextLessonSlug: string | null;
}) {
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);
  const [showXpAnim, setShowXpAnim] = useState(false);
  const [celebration, setCelebration] = useState<NewAchievement | null>(null);
  const [levelUp, setLevelUp] = useState(false);
  const router = useRouter();

  async function handleComplete() {
    setLoading(true);

    try {
      const res = await fetch("/api/lms/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, xpReward }),
      });

      const data = await res.json();

      if (res.ok && !data.alreadyCompleted) {
        setCompleted(true);
        setShowXpAnim(true);
        setTimeout(() => setShowXpAnim(false), 2000);

        // Show level up
        if (data.levelUp) {
          setLevelUp(true);
          setTimeout(() => setLevelUp(false), 3000);
        }

        // Show achievement celebration (first one)
        if (data.newAchievements?.length > 0) {
          setCelebration(data.newAchievements[0]);
        }

        router.refresh();
      } else if (data.alreadyCompleted) {
        setCompleted(true);
      }
    } catch {
      // Silently fail — user can retry
    }

    setLoading(false);
  }

  function handleNext() {
    if (nextLessonSlug) {
      router.push(`/learn/${courseSlug}/${nextLessonSlug}`);
    } else {
      router.push(`/learn/${courseSlug}`);
    }
  }

  return (
    <>
      {celebration && (
        <AchievementCelebration
          achievement={celebration}
          onClose={() => setCelebration(null)}
        />
      )}

      {completed ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Lesson completed!</span>
            {showXpAnim && (
              <span className="ml-2 animate-bounce font-bold text-[var(--primary)]">
                +{xpReward} XP
              </span>
            )}
            {levelUp && (
              <span className="ml-2 animate-pulse font-bold text-amber-400">
                LEVEL UP!
              </span>
            )}
          </div>
          <Button
            onClick={handleNext}
            className="ml-auto bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--accent-hover)]"
          >
            {nextLessonSlug ? "Next lesson \u2192" : "Back to course"}
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleComplete}
          disabled={loading}
          className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--accent-hover)] px-6"
          size="lg"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Zap className="mr-2 h-4 w-4" />
          )}
          Mark as complete · +{xpReward} XP
        </Button>
      )}
    </>
  );
}
