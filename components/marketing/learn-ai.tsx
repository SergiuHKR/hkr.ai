import Link from "next/link";

// Animated skill progress bars — simulates a live training dashboard
const SKILLS = [
  { name: "Prompt Engineering", pct: 82, delay: "0s" },
  { name: "AI Workflows", pct: 64, delay: "0.4s" },
  { name: "Agent Design", pct: 41, delay: "0.8s" },
  { name: "Data Analysis", pct: 97, delay: "1.2s" },
];

// Mini badge data for the dashboard mockup
const BADGES = [
  { icon: "👣", name: "First Steps", earned: true },
  { icon: "🔓", name: "AI Literate", earned: false },
  { icon: "💯", name: "Century Club", earned: false },
  { icon: "⚡", name: "Speed Learner", earned: false },
  { icon: "🚀", name: "Early Adopter", earned: true },
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

          {/* ── Right: gamification card with dashboard mockup (1col × 2row) ── */}
          <Link
            href="/academy"
            className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all hover:border-[var(--primary)]/30 hover:-translate-y-1 md:row-span-2"
          >
            {/* ── Dashboard mockup background ── */}
            <div className="pointer-events-none select-none px-4 pt-5 pb-2 opacity-60">
              {/* Profile header */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]/20 text-xs font-bold text-[var(--primary)]">
                  S
                </div>
                <div>
                  <div className="text-[11px] font-semibold leading-tight">
                    Sergiu Poenaru
                  </div>
                  <div className="text-[9px] text-[var(--muted-foreground)]">
                    Level 1 · Novice
                  </div>
                </div>
              </div>

              {/* XP card */}
              <div className="mt-3 rounded-lg border border-[var(--border)] bg-white/[0.02] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold">
                  <span className="text-[var(--primary)]">⚡</span> XP &amp;
                  Level
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-[var(--primary)]">
                    1
                  </span>
                  <div className="text-[9px] text-[var(--muted-foreground)]">
                    Novice
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-[8px] text-[var(--muted-foreground)]">
                  <span>10 XP</span>
                  <span>50 XP</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/5">
                  <div className="h-full w-1/4 rounded-full bg-[var(--primary)]" />
                </div>
                <div className="mt-1 text-center text-[8px] text-[var(--muted-foreground)]">
                  40 XP to Learner
                </div>
              </div>

              {/* Badges */}
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-semibold">
                    🏅 Badges (2/5)
                  </span>
                  <span className="text-[8px] text-[var(--primary)]">
                    View all →
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {BADGES.slice(0, 4).map((badge) => (
                    <div
                      key={badge.name}
                      className={`rounded-md border p-1.5 ${
                        badge.earned
                          ? "border-[var(--primary)]/30 bg-[var(--primary)]/5"
                          : "border-[var(--border)] bg-white/[0.02] opacity-50"
                      }`}
                    >
                      <div className="text-[10px]">{badge.icon}</div>
                      <div className="text-[8px] font-medium leading-tight">
                        {badge.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="mt-3">
                <div className="mb-1.5 text-[9px] font-semibold">
                  🕒 Recent Activity
                </div>
                <div className="space-y-1">
                  {[
                    { title: "A Brief History of AI", xp: "+10 XP" },
                    { title: "AI Is Not Magic", xp: "+10 XP" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center justify-between rounded-md border border-[var(--border)] bg-white/[0.02] px-2 py-1.5"
                    >
                      <span className="text-[8px]">{item.title}</span>
                      <span className="font-mono text-[8px] text-[var(--primary)]">
                        {item.xp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Gradient overlay + text content ── */}
            <div className="relative mt-auto bg-gradient-to-t from-[var(--card)] from-60% to-transparent p-6 pt-12">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                  Gamified
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold leading-snug transition-colors group-hover:text-[var(--primary)]">
                XP, levels, leaderboards. Learning that sticks.
              </h3>
              <span className="text-sm font-medium text-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100">
                Explore the platform →
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
