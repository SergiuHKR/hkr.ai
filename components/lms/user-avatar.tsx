"use client";

import Image from "next/image";

interface UserAvatarProps {
  avatarUrl?: string | null;
  displayName?: string | null;
  size?: number;
  className?: string;
}

export function UserAvatar({
  avatarUrl,
  displayName,
  size = 40,
  className = "",
}: UserAvatarProps) {
  const initials = (displayName ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={displayName ?? "User avatar"}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[var(--primary)]/20 font-bold text-[var(--primary)] ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}
