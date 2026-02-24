import Link from "next/link";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Case Studies", href: "/articles" },
      { label: "Learning platform", href: "/learn" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "https://hkr.team/about" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={`border-t border-[var(--border)] bg-[#080808] px-6 py-16 ${className ?? ""}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-start">
        {/* Brand */}
        <div className="md:mr-auto">
          <span className="text-xl font-bold">
            HKR<span className="text-[var(--primary)]">.AI</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-[var(--muted-foreground)]">
            AI Education for elite career professionals.
          </p>
        </div>

        {/* Link columns */}
        <div className="flex flex-wrap gap-12 sm:gap-16">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-white"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted-foreground)]">
        &copy; {new Date().getFullYear()} HKR.AI. All rights reserved.
      </div>
    </footer>
  );
}
