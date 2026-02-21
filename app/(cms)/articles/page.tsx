import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/cms/article-card";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata = {
  title: "Case Studies — HKR.AI",
  description: "Real AI agents solving real business problems.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pt-28 pb-24">
        <h1 className="mb-2 text-4xl font-bold">Case Studies</h1>
        <p className="mb-12 text-lg text-[var(--muted-foreground)]">
          Real AI agents solving real business problems.
        </p>
        <div className="grid gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
