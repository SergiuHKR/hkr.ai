import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/lms/sign-out-button";

export default async function LearnPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Academy</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Welcome, {user?.email}
          </p>
        </div>
        <SignOutButton />
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
        <p className="text-lg text-[var(--muted-foreground)]">
          Courses coming soon.
        </p>
      </div>
    </main>
  );
}
