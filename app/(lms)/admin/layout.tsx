import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRole, canAccessAdmin } from "@/lib/lms/roles";
import Link from "next/link";
import { Settings, Users, BookOpen, Tag, Trophy, Calendar, Building2 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: Settings },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/tags", label: "Tags", icon: Tag },
  { href: "/admin/achievements", label: "Achievements", icon: Trophy },
  { href: "/admin/seasons", label: "Seasons", icon: Calendar },
  { href: "/admin/org", label: "Organization", icon: Building2 },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = await getUserRole(supabase, user.id);
  if (!canAccessAdmin(role)) redirect("/dashboard");

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col md:flex-row">
      {/* Sidebar — horizontal scroll on mobile, vertical on desktop */}
      <aside className="shrink-0 border-b border-[var(--border)] bg-[var(--background)] md:w-56 md:border-b-0 md:border-r">
        <div className="hidden p-4 pb-0 md:block">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Admin Panel
          </h2>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 py-2 md:flex-col md:overflow-x-visible md:pb-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--card)] hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
