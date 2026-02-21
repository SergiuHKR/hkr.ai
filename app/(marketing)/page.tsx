import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { CaseStudies } from "@/components/marketing/case-studies";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <CaseStudies />
      <Footer />
    </>
  );
}
