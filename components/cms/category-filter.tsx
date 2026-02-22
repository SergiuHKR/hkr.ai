"use client";

import Link from "next/link";

export function CategoryFilter({
  categories,
  active,
}: {
  categories: string[];
  active?: string;
}) {

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <Link
        href="/articles"
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          !active
            ? "bg-[var(--primary)] text-black"
            : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:text-white"
        }`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/articles?category=${encodeURIComponent(cat)}`}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === cat
              ? "bg-[var(--primary)] text-black"
              : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:text-white"
          }`}
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}
