import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import Link from "next/link";
import {
  GraduationCap,
  Trophy,
  Brain,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";

export const metadata = {
  title: "AI Academy | HKR.AI",
  description:
    "Private AI training platform for companies looking to onboard and upskill teams on AI. Gamified, structured, and measurable.",
};

const features = [
  {
    icon: Brain,
    title: "Structured AI Curriculum",
    description:
      "Courses designed by practitioners who build real agentic workflows. Not theory — hands-on, practical training your team can apply immediately.",
  },
  {
    icon: GraduationCap,
    title: "Gamified Learning",
    description:
      "XP, levels, badges, and leaderboards turn training into a competitive experience. Teams stay engaged and motivated to complete courses.",
  },
  {
    icon: TrendingUp,
    title: "Measurable Progress",
    description:
      "Track every team member's progress with detailed dashboards. Know exactly who's completed what and where skills gaps remain.",
  },
  {
    icon: Users,
    title: "Team Onboarding at Scale",
    description:
      "Onboard entire departments to AI in weeks, not months. Tag-based course visibility means each team sees only what's relevant to them.",
  },
  {
    icon: Trophy,
    title: "Certificates & Recognition",
    description:
      "Completions are rewarded with certificates and achievement badges. Give your team tangible proof of their AI skills.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your academy is invite-only. Content is restricted to your organization and select clients. No public signups.",
  },
];

export default function AcademyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        {/* Hero */}
        <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <span className="mb-4 inline-block rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--primary)]">
              Private Training Platform
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Train your team on AI.{" "}
              <span className="text-[var(--primary)]">Measurably.</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--muted-foreground)]">
              AI Academy is a gamified learning platform built for companies
              that want to onboard and upskill their teams on AI — with
              structured courses, progress tracking, and real accountability.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
              >
                Access the Platform
              </Link>
              <Link
                href="/#contact"
                className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:border-white/40 hover:text-white"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
              Why companies choose AI Academy
            </h2>
            <p className="mx-auto mb-16 max-w-2xl text-center text-[var(--muted-foreground)]">
              Purpose-built for teams that need to get up to speed on AI fast —
              without the noise of generic online courses.
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
                >
                  <feature.icon className="h-8 w-8 text-[var(--primary)]" />
                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-[var(--border)] px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-16 text-center text-2xl font-bold md:text-3xl">
              How it works
            </h2>
            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "We set up your organization",
                  description:
                    "Your team gets a private AI Academy instance. We configure courses, tags, and access control based on your company's structure.",
                },
                {
                  step: "02",
                  title: "Your team starts learning",
                  description:
                    "Team members log in with their work Google account and start taking AI courses tailored to their role. XP and levels keep them engaged.",
                },
                {
                  step: "03",
                  title: "You track everything",
                  description:
                    "Admin dashboards show who's completed what, who's falling behind, and what topics need more attention. Exportable reports for leadership.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <span className="font-mono text-3xl font-bold text-[var(--primary)]">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1 text-[var(--muted-foreground)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[var(--border)] px-6 py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold md:text-3xl">
              Ready to upskill your team?
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)]">
              AI Academy is currently available to HKR.AI clients and select
              partners. Get in touch to learn how we can set it up for your
              organization.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
