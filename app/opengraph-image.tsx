import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HKR.AI — AI Consulting Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0px",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: 72, fontWeight: 700, color: "#FFFFFF" }}>
            HKR
          </span>
          <span style={{ fontSize: 72, fontWeight: 700, color: "#3ECF8E" }}>
            .AI
          </span>
        </div>
        <p
          style={{
            fontSize: 28,
            color: "#A1A1AA",
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Real agentic workflows for real business cases
        </p>
      </div>
    ),
    { ...size }
  );
}
