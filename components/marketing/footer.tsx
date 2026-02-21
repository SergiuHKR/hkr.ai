const columns = [
  {
    title: "Platform",
    links: [
      { label: "Articles", href: "/articles" },
      { label: "Training (LMS)", href: "/learn" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "hkr.team", href: "https://hkr.team" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "LinkedIn", href: "https://linkedin.com/company/hkr-team" },
      { label: "Email", href: "mailto:sergiu@hkr.ai" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[#080808] px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
        {/* Brand */}
        <div>
          <span className="text-xl font-bold">
            HKR<span className="text-[var(--primary)]">.AI</span>
          </span>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            AI consulting & transformation for mid-market companies.
          </p>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              {col.title}
            </h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted-foreground)]">
        &copy; {new Date().getFullYear()} HKR.AI. All rights reserved.
      </div>
    </footer>
  );
}
