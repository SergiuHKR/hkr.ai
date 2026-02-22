import { ImageResponse } from "next/og";
import { getArticle } from "@/lib/articles";

export const runtime = "nodejs";
export const alt = "Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  const title = article?.title ?? "Case Study";
  const category = article?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {category && (
          <span
            style={{
              fontSize: 20,
              color: "#3ECF8E",
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {category}
          </span>
        )}
        <h1
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {title}
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0px",
            marginTop: 40,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>
            HKR
          </span>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#3ECF8E" }}>
            .AI
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
