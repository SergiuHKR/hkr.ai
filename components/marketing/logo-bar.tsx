const logos = [
  "Anthropic",
  "OpenAI",
  "Google Cloud",
  "AWS",
  "Microsoft",
  "Vercel",
];

export function LogoBar() {
  return (
    <section className="border-y border-[var(--border)] py-12">
      <p className="mb-8 text-center text-sm uppercase tracking-widest text-[var(--muted-foreground)]">
        Technologies we work with
      </p>
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-6 px-6">
        {logos.map((name) => (
          <span
            key={name}
            className="text-lg font-medium text-[var(--muted-foreground)]/60"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
