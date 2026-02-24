"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SystemRole } from "@/lib/lms/roles";
import type { Level } from "@/lib/lms/levels";

const baseLinks = [
  { label: "Learning Platform", href: "/learn" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Use Cases", href: "/articles" },
];

interface LmsNavbarProps {
  role?: SystemRole;
  level?: Level;
}

function RoleBadge({ role }: { role: SystemRole }) {
  if (role === "super_admin") {
    return (
      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
        Super Admin
      </span>
    );
  }
  if (role === "admin") {
    return (
      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
        Admin
      </span>
    );
  }
  return null;
}

export function LmsNavbar({ role = "user", level }: LmsNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = role === "admin" || role === "super_admin";

  const navLinks = isAdmin
    ? [...baseLinks, { label: "Admin", href: "/admin" }]
    : baseLinks;

  return (
    <nav aria-label="Academy navigation" className="fixed top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight">
            HKR<span className="text-[var(--primary)]">.AI</span>
          </Link>
          <RoleBadge role={role} />
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "text-white font-medium"
                    : "text-[var(--muted-foreground)] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Level indicator */}
          {level && (
            <>
              <span className="text-[var(--border)]">|</span>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-white"
              >
                <span className="font-mono font-bold text-[var(--primary)]">
                  LVL {level.level}
                </span>
                <span className="hidden text-xs lg:inline">{level.title}</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-6 py-4 md:hidden">
          {/* Role badge + level on mobile */}
          <div className="mb-3 flex items-center gap-3 pb-3 border-b border-[var(--border)]">
            <RoleBadge role={role} />
            {level && (
              <span className="text-xs text-[var(--muted-foreground)]">
                <span className="font-mono font-bold text-[var(--primary)]">
                  LVL {level.level}
                </span>{" "}
                {level.title}
              </span>
            )}
          </div>
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm ${
                  isActive ? "text-white font-medium" : "text-[var(--muted-foreground)] hover:text-white"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
