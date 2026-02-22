import { getAllArticles } from "@/lib/articles";

const BASE_URL = "https://dev.hkr.ai";

export async function GET() {
  const articles = getAllArticles();

  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${BASE_URL}/articles/${article.slug}</link>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <guid>${BASE_URL}/articles/${article.slug}</guid>
      <category><![CDATA[${article.category}]]></category>
    </item>`,
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>HKR.AI Case Studies</title>
    <link>${BASE_URL}/articles</link>
    <description>Real AI agents solving real business problems.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/articles/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
