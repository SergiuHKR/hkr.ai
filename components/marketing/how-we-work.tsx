const steps = [
  {
    step: "01",
    title: "Pilot",
    description:
      "2-week discovery sprint. We audit your operations, identify the highest-impact automation opportunity, and build a working prototype.",
  },
  {
    step: "02",
    title: "Prove",
    description:
      "4-8 week implementation. We deploy the solution, measure results, and prove ROI with real data from your business.",
  },
  {
    step: "03",
    title: "Scale",
    description:
      "Expand across departments. We train your team, build more agents, and embed AI into your daily operations.",
  },
];

export function HowWeWork() {
  return (
    <section id="about" className="border-t border-[var(--border)] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--primary)]">
          How We Work
        </p>
        <h2 className="mb-12 text-3xl font-bold md:text-4xl">
          Pilot &rarr; Prove &rarr; Scale
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8"
            >
              <span className="mb-4 inline-block text-4xl font-bold text-[var(--primary)]">
                {s.step}
              </span>
              <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
