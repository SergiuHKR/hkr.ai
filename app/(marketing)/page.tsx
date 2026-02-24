import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { LearnAI } from "@/components/marketing/learn-ai";
import { CaseStudies } from "@/components/marketing/case-studies";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content">
        <Hero />
        <LearnAI />
        <CaseStudies />
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}
