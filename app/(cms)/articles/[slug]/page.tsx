import { notFound } from "next/navigation";
import { getAllArticles, getArticle } from "@/lib/articles";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} — HKR.AI`,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <Navbar />
      <article className="mx-auto max-w-3xl px-6 pt-28 pb-24">
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
          <div className="mt-4 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <span>{article.author}</span>
            <span>&middot;</span>
            <span>
              {new Date(article.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        <div className="prose prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-[var(--muted-foreground)] prose-p:leading-relaxed prose-li:text-[var(--muted-foreground)] prose-strong:text-white prose-table:text-sm prose-th:text-left prose-th:px-4 prose-th:py-2 prose-th:border-b prose-th:border-[var(--border)] prose-td:px-4 prose-td:py-2 prose-td:border-b prose-td:border-[var(--border)] prose-code:text-[var(--primary)] prose-code:bg-[var(--card)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
          <MDXRemote source={article.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>
      </article>
      <Footer />
    </>
  );
}
