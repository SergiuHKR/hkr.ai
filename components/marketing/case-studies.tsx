import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

const FEATURED_SLUGS = [
  "ai-sales-pipeline-agent",
  "ai-document-processing-agent",
  "ai-onboarding-agent",
];

const categoryIcons: Record<string, string> = {
  "Sales & Revenue": "📈",
  "Finance & Operations": "📄",
  "HR & People Ops": "👥",
};

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

        <div className="grid gap-6 md:grid-cols-3">
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
              <h3 className="mb-2 text-lg font-bold leading-snug group-hover:text-[var(--primary)] transition-colors">
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

        <div className="mt-8 text-center">
          <Link
            href="/articles"
            className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-white"
          >
            View all case studies →
          </Link>
        </div>
      </div>
    </section>
  );
}
