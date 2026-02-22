import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles, getArticle } from "@/lib/articles";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import type { Metadata } from "next";
import { ArrowLeft, Clock } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  // Get related articles (same category, excluding current)
  const allArticles = getAllArticles();
  const related = allArticles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  // If not enough same-category, fill with recent
  if (related.length < 2) {
    const more = allArticles
      .filter(
        (a) => a.slug !== slug && !related.some((r) => r.slug === a.slug),
      )
      .slice(0, 2 - related.length);
    related.push(...more);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: { "@type": "Person", name: article.author },
    datePublished: article.date,
    publisher: {
      "@type": "Organization",
      name: "HKR.AI",
      url: "https://dev.hkr.ai",
    },
    mainEntityOfPage: `https://dev.hkr.ai/articles/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <article className="mx-auto max-w-3xl px-6 pt-28 pb-24">
        <Link
          href="/articles"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Case Studies
        </Link>

        <header className="mb-10">
          <span className="mb-3 inline-block rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
            {article.category}
          </span>
          <h1 className="mb-4 text-4xl font-bold leading-tight">
            {article.title}
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            {article.description}
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
            <span>{article.author}</span>
            <span>&middot;</span>
            <span>
              {new Date(article.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>&middot;</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {article.readingTime} min read
            </span>
          </div>
        </header>

        <div className="prose prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-[var(--muted-foreground)] prose-p:leading-relaxed prose-li:text-[var(--muted-foreground)] prose-strong:text-white prose-table:text-sm prose-th:text-left prose-th:px-4 prose-th:py-2 prose-th:border-b prose-th:border-[var(--border)] prose-td:px-4 prose-td:py-2 prose-td:border-b prose-td:border-[var(--border)] prose-code:text-[var(--primary)] prose-code:bg-[var(--card)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
          <MDXRemote
            source={article.content}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-[var(--border)] pt-12">
            <h2 className="mb-6 text-2xl font-bold">Related Case Studies</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/articles/${r.slug}`}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-colors hover:border-[var(--primary)]/30"
                >
                  <span className="mb-2 inline-block rounded-full bg-[var(--primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--primary)]">
                    {r.category}
                  </span>
                  <h3 className="text-base font-bold leading-snug transition-colors group-hover:text-[var(--primary)]">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {r.readingTime} min read
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
      <Footer />
    </>
  );
}
