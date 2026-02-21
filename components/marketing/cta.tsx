export function CTA() {
  return (
    <section
      id="contact"
      className="border-t border-[var(--border)] px-6 py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold md:text-5xl">
          Ready to make your team{" "}
          <span className="text-[var(--primary)]">unstoppable</span>?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--muted-foreground)]">
          Book a free 30-minute discovery call. We&apos;ll map your biggest
          automation opportunities and show you what&apos;s possible.
        </p>
        <a
          href="mailto:sergiu@hkr.ai"
          className="mt-8 inline-block rounded-full bg-[var(--primary)] px-8 py-3 text-base font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          Book a Discovery Call
        </a>
      </div>
    </section>
  );
}
