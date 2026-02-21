import type { ArticleMeta } from "@/lib/articles";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <a
      href={`/articles/${article.slug}`}
      className="group block rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-colors hover:border-[var(--primary)]/30"
    >
      <span className="mb-3 inline-block rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
        {article.category}
      </span>
      <h2 className="mb-2 text-xl font-bold group-hover:text-[var(--primary)] transition-colors">
        {article.title}
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
        {article.description}
      </p>
      <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
        <span>{article.author}</span>
        <span>&middot;</span>
        <span>{new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      </div>
    </a>
  );
}
