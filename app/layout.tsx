import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HKR.AI — AI Consulting Platform",
  description:
    "AI consulting, training, and transformation for mid-market companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
