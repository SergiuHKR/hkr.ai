import Link from "next/link";

// Animated skill progress bars — simulates a live training dashboard
const SKILLS = [
  { name: "Prompt Engineering", pct: 82, delay: "0s" },
  { name: "AI Workflows", pct: 64, delay: "0.4s" },
  { name: "Agent Design", pct: 41, delay: "0.8s" },
  { name: "Data Analysis", pct: 97, delay: "1.2s" },
];

export function LearnAI() {
  return (
    <section className="px-6 pb-32 pt-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Learn AI
          </h2>
          <p className="mt-3 text-[var(--muted-foreground)]">
            Practical and pragmatic AI lessons tailored for B2B, not for PhDs.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* ── Left: training dashboard visualization (2col × 2row) ── */}
          <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] md:col-span-2 md:row-span-2">
            {/* Gradient wash */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--primary)]/8 via-transparent to-transparent" />

            {/* Content */}
            <div className="relative flex h-full flex-col justify-between p-8">
              <div>
                <span className="inline-block rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                  Private training platform
                </span>
                <h3 className="mt-5 text-2xl font-bold leading-snug md:text-3xl">
                  Make your team fluent in AI.
                </h3>
                <p className="mt-3 max-w-lg text-[var(--muted-foreground)]">
                  Structured courses, hands-on exercises, and real-world
                  scenarios — designed so your team actually uses AI at work, not
                  just reads about it.
                </p>
              </div>

              {/* Animated skill progress bars */}
              <div className="mt-8 max-w-md space-y-4">
                {SKILLS.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="text-[var(--muted-foreground)]">
                        {skill.name}
                      </span>
                      <span className="font-mono text-[var(--primary)]">
                        {skill.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-[var(--primary)]"
                        style={{
                          width: `${skill.pct}%`,
                          animation: "pulse 2.5s ease-in-out infinite",
                          animationDelay: skill.delay,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/academy"
                className="mt-8 inline-flex w-fit text-sm font-medium text-[var(--primary)] transition-opacity hover:opacity-80"
              >
                Start learning →
              </Link>
            </div>
          </div>

          {/* ── Right: gamification card (1col × 2row) ── */}
          <Link
            href="/academy"
            className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--primary)]/30 hover:-translate-y-1 md:row-span-2"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                Gamified
              </span>
            </div>
            <h3 className="mb-2 text-lg font-bold leading-snug transition-colors group-hover:text-[var(--primary)]">
              XP, levels, leaderboards. Learning that sticks.
            </h3>
            <p className="flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
              Every lesson earns XP. Every milestone unlocks a new level. Your
              team competes on a live leaderboard — turning AI training into
              something people actually want to finish.
            </p>
            <span className="mt-6 text-sm font-medium text-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100">
              Explore the platform →
            </span>
          </Link>

        </div>
      </div>
    </section>
  );
}
