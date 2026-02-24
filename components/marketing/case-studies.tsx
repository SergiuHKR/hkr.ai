import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

const FEATURED_SLUGS = [
  "ai-sales-pipeline-agent",
  "ai-document-processing-agent",
  "ai-onboarding-agent",
  "ai-customer-support-agent",
  "ai-email-triage-agent",
  "ai-lead-scoring-agent",
  "ai-meeting-summarizer-agent",
  "ai-knowledge-base-agent",
  "ai-compliance-monitoring-agent",
];

const categoryIcons: Record<string, string> = {
  "Sales & Revenue": "📈",
  "Finance & Operations": "📄",
  "HR & People Ops": "👥",
  "Customer Support": "💬",
  "Operations": "⚙️",
};

// Positions + delays for the pulsing agent-node animation
const NODES = [
  { top: "18%", left: "10%", delay: "0s",   size: "h-2 w-2" },
  { top: "68%", left: "18%", delay: "0.9s", size: "h-3 w-3" },
  { top: "32%", left: "46%", delay: "1.7s", size: "h-2 w-2" },
  { top: "74%", left: "56%", delay: "0.4s", size: "h-3 w-3" },
  { top: "14%", left: "74%", delay: "1.2s", size: "h-2 w-2" },
  { top: "52%", left: "88%", delay: "0.6s", size: "h-2 w-2" },
];

export function CaseStudies() {
  const allArticles = getAllArticles();
  const featured = FEATURED_SLUGS.map((slug) =>
    allArticles.find((a) => a.slug === slug)
  ).filter(Boolean);

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Case Studies
          </h2>
          <p className="mt-3 text-[var(--muted-foreground)]">
            The AI agents we built. The problems they solved.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* ── Bento hero: animated showcase (2col × 2row) ── */}
          <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] md:col-span-2 md:row-span-2">
            {/* Green gradient wash */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-transparent" />

            {/* Pulsing agent nodes */}
            {NODES.map((node, i) => (
              <span
                key={i}
                className={`pointer-events-none absolute flex ${node.size}`}
                style={{ top: node.top, left: node.left }}
              >
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-50"
                  style={{ animationDelay: node.delay }}
                />
                <span className="relative inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-80" />
              </span>
            ))}

            {/* Content */}
            <div className="relative flex h-full flex-col justify-between p-8">
              <div>
                <span className="inline-block rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                  Live in production
                </span>
                <h3 className="mt-5 text-2xl font-bold leading-snug md:text-3xl">
                  AI agents solving real business problems.
                </h3>
                <p className="mt-3 max-w-md text-[var(--muted-foreground)]">
                  We build and deploy autonomous agents across sales, finance,
                  HR, and operations. Every agent below is running for a real
                  client.
                </p>
              </div>
              <Link
                href="/articles"
                className="mt-8 inline-flex w-fit text-sm font-medium text-[var(--primary)] transition-opacity hover:opacity-80"
              >
                Browse all case studies →
              </Link>
            </div>
          </div>

          {/* ── Bento: Learning platform card (1col × 2row) ── */}
          <Link
            href="/academy"
            className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--primary)]/30 hover:-translate-y-1 md:row-span-2"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                Learning platform
              </span>
            </div>
            <h3 className="mb-2 text-lg font-bold leading-snug transition-colors group-hover:text-[var(--primary)]">
              Train your team on the same AI workflows we use.
            </h3>
            <p className="flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
              Gamified courses, XP, leaderboards, and certificates — built for
              companies that want measurable AI adoption across their teams.
            </p>
            <span className="mt-6 text-sm font-medium text-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100">
              Explore the platform →
            </span>
          </Link>

          {/* ── Regular case study cards ── */}
          {featured.map((article) => (
            <Link
              key={article!.slug}
              href={`/articles/${article!.slug}`}
              className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--primary)]/30 hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">
                  {categoryIcons[article!.category] ?? "🤖"}
                </span>
                <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                  {article!.category}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold leading-snug transition-colors group-hover:text-[var(--primary)]">
                {article!.title}
              </h3>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {article!.description}
              </p>
              <span className="text-sm font-medium text-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100">
                Read case study →
              </span>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}
