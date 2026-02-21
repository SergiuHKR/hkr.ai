"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { DynamicIcon } from "@/components/lms/dynamic-icon";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export function AchievementCelebration({
  achievement,
  onClose,
}: {
  achievement: Achievement;
  onClose: () => void;
}) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [show, setShow] = useState(true);

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={() => {
        setShow(false);
        setTimeout(onClose, 300);
      }}
    >
      {/* Confetti — green/emerald palette */}
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={200}
        colors={["#3ECF8E", "#2BB57A", "#10B981", "#34D399", "#6EE7B7", "#A7F3D0"]}
        gravity={0.3}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Badge modal */}
      <div className="animate-in zoom-in-95 fade-in relative z-10 mx-4 max-w-sm rounded-2xl border border-[var(--primary)]/30 bg-[var(--card)] p-8 text-center shadow-2xl shadow-[var(--primary)]/10 duration-300">
        {/* Icon with glow */}
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]/30">
          <DynamicIcon name={achievement.icon} className="h-10 w-10 text-[var(--primary)]" />
        </div>

        {/* Badge unlocked label */}
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-[var(--primary)]">
          Badge Unlocked
        </p>

        {/* Title */}
        <h2 className="mb-2 text-2xl font-bold text-white">{achievement.title}</h2>

        {/* Description */}
        <p className="text-sm text-[var(--muted-foreground)]">
          {achievement.description}
        </p>

        {/* Tap to close */}
        <p className="mt-6 font-mono text-xs text-[var(--muted-foreground)]/50">
          tap to close
        </p>
      </div>
    </div>
  );
}
