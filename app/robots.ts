import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/articles"],
        disallow: ["/learn", "/dashboard", "/leaderboard", "/badges", "/login", "/admin", "/profile", "/certificates", "/api"],
      },
    ],
    sitemap: "https://dev.hkr.ai/sitemap.xml",
  };
}
