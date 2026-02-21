const services = [
  {
    title: "AI Consulting",
    bullets: [
      "Discovery workshop & AI readiness audit",
      "Process mapping & automation roadmap",
      "ROI modeling & business case",
      "Vendor-agnostic technology selection",
    ],
  },
  {
    title: "AI Development",
    bullets: [
      "Custom AI agents & chatbots",
      "RAG pipelines & knowledge bases",
      "Workflow automation (n8n, Zapier, custom)",
      "API integrations & data pipelines",
    ],
  },
  {
    title: "AI Training",
    bullets: [
      "Gamified LMS platform for your team",
      "Role-specific AI curricula",
      "Prompt engineering workshops",
      "Ongoing coaching & certification",
    ],
  },
];

export function Services() {
  return (
    <section className="border-t border-[var(--border)] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--primary)]">
          Services
        </p>
        <h2 className="mb-12 text-3xl font-bold md:text-4xl">
          Everything you need to go from zero to AI-native
        </h2>
        <div className="flex flex-col gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="flex flex-col gap-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 md:flex-row md:items-start md:justify-between"
            >
              <h3 className="text-2xl font-bold md:w-1/3">{s.title}</h3>
              <ul className="space-y-2 md:w-2/3">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-[var(--muted-foreground)]"
                  >
                    <span className="mt-1 text-[var(--primary)]">&#10003;</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
