const features = [
  {
    number: "01",
    title: "AI Audit & Strategy",
    description:
      "We map your operations, identify automation opportunities, and build a phased roadmap.",
  },
  {
    number: "02",
    title: "Custom AI Agents",
    description:
      "Purpose-built agents for customer support, sales, ops, and internal workflows.",
  },
  {
    number: "03",
    title: "Team Training (LMS)",
    description:
      "Gamified AI training platform with courses, quizzes, streaks, and leaderboards.",
  },
  {
    number: "04",
    title: "Process Automation",
    description:
      "End-to-end automation of repetitive tasks — data entry, reporting, scheduling, QA.",
  },
  {
    number: "05",
    title: "RAG & Knowledge Bases",
    description:
      "Connect your docs, tickets, and data to AI that actually knows your business.",
  },
  {
    number: "06",
    title: "Ongoing Optimization",
    description:
      "We stay embedded in your team. Continuous improvement, not one-off projects.",
  },
];

export function WhatWeDo() {
  return (
    <section id="solutions" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--primary)]">
          What We Do
        </p>
        <h2 className="mb-12 text-3xl font-bold md:text-4xl">
          AI implementation, not just advice
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.number}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-colors hover:border-[var(--primary)]/30"
            >
              <span className="mb-3 inline-block text-3xl font-bold text-[var(--primary)]/30">
                {f.number}
              </span>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
