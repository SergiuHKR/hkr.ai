import { DynamicIcon } from "@/components/lms/dynamic-icon";
import { Lock } from "lucide-react";

type BadgeProps = {
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
};

export function BadgeCard({ title, description, icon, earned, earnedAt }: BadgeProps) {
  return (
    <div
      className={`relative rounded-xl border p-4 transition-all ${
        earned
          ? "border-[var(--primary)]/30 bg-[var(--primary)]/5 shadow-sm shadow-[var(--primary)]/10"
          : "border-[var(--border)] bg-[var(--card)] opacity-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            earned
              ? "bg-[var(--primary)]/10 text-[var(--primary)]"
              : "bg-[var(--muted-foreground)]/10 text-[var(--muted-foreground)]"
          }`}
        >
          {earned ? (
            <DynamicIcon name={icon} className="h-5 w-5" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className={`text-sm font-semibold ${earned ? "text-white" : "text-[var(--muted-foreground)]"}`}>
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)] line-clamp-2">
            {description}
          </p>
          {earned && earnedAt && (
            <p className="mt-1 font-mono text-[10px] text-[var(--primary)]">
              {new Date(earnedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
