import { TerminalSpinner } from "@/components/ui/terminal-spinner";

export function Hero() {
  return (
    <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 pt-16 text-center">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          We&apos;ve used{" "}
          <span className="text-[var(--primary)]">
            <TerminalSpinner className="mr-2 font-mono" />
            HKR.AI
          </span>{" "}
          to train our own teams at HKR.TEAM on how to 10x using AI. Now
          we&apos;re making it available to a select group of clients.
        </h1>
      </div>
    </section>
  );
}
