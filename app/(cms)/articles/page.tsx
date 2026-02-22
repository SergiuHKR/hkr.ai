import { getAllArticles, getCategories } from "@/lib/articles";
import { ArticleCard } from "@/components/cms/article-card";
import { CategoryFilter } from "@/components/cms/category-filter";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata = {
  title: "Case Studies",
  description: "Real AI agents solving real business problems.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allArticles = getAllArticles();
  const categories = getCategories();
  const articles = category
    ? allArticles.filter((a) => a.category === category)
    : allArticles;

  return (
    <>
      <Navbar />
      <main id="main-content" className="mx-auto max-w-4xl px-6 pt-28 pb-24">
        <h1 className="mb-2 text-4xl font-bold">Case Studies</h1>
        <p className="mb-8 text-lg text-[var(--muted-foreground)]">
          Real AI agents solving real business problems.
        </p>

        <CategoryFilter categories={categories} active={category} />

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
