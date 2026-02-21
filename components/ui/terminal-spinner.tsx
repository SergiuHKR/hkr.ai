"use client";

import { useEffect, useState } from "react";

const FRAMES = ["✶", "✸", "✹", "✺", "✹", "✸"];

interface TerminalSpinnerProps {
  fps?: number;
  className?: string;
}

export function TerminalSpinner({ fps = 8, className }: TerminalSpinnerProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const ms = 1000 / fps;
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), ms);
    return () => clearInterval(id);
  }, [fps]);

  return (
    <span aria-hidden className={className}>
      {FRAMES[frame]}
    </span>
  );
}
