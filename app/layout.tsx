import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HKR.AI — AI Consulting Platform",
    template: "%s — HKR.AI",
  },
  description:
    "AI consulting, training, and transformation for mid-market companies. Real agentic workflows for real business cases.",
  metadataBase: new URL("https://dev.hkr.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dev.hkr.ai",
    siteName: "HKR.AI",
    title: "HKR.AI — AI Consulting Platform",
    description:
      "AI consulting, training, and transformation for mid-market companies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HKR.AI — AI Consulting Platform",
    description:
      "AI consulting, training, and transformation for mid-market companies.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HKR.AI",
    url: "https://dev.hkr.ai",
    logo: "https://dev.hkr.ai/icon.png",
    description:
      "AI consulting, training, and transformation for mid-market companies.",
    sameAs: [],
  };

  return (
    <html
      lang="en"
      className={`dark ${dmSans.variable} ${dmSerifDisplay.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
