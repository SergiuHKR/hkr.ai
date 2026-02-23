import { createClient } from "@/lib/supabase/server";
import { CreateTagButton, EditTagButton, DeleteTagButton } from "@/components/admin/tag-forms";

export default async function AdminTagsPage() {
  const supabase = await createClient();

  const { data: tags } = await supabase
    .from("tags")
    .select("*")
    .order("name");

  // Count usages
  const tagUsage = new Map<string, { users: number; courses: number }>();
  for (const tag of tags || []) {
    const { count: userCount } = await supabase
      .from("user_tags")
      .select("*", { count: "exact", head: true })
      .eq("tag_id", tag.id);
    const { count: courseCount } = await supabase
      .from("course_tags")
      .select("*", { count: "exact", head: true })
      .eq("tag_id", tag.id);
    tagUsage.set(tag.id, {
      users: userCount || 0,
      courses: courseCount || 0,
    });
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tags</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--muted-foreground)]">
            {tags?.length || 0} tags
          </span>
          <CreateTagButton />
        </div>
      </div>

      {(!tags || tags.length === 0) ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <p className="text-[var(--muted-foreground)]">
            No tags created yet. Tags control which courses users can see.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted-foreground)]">
                <th className="px-4 py-3 font-medium">Tag</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Users</th>
                <th className="px-4 py-3 font-medium">Courses</th>
                <th className="px-4 py-3 font-medium w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {tags.map((tag: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
              }) => {
                const usage = tagUsage.get(tag.id);
                return (
                  <tr key={tag.id} className="hover:bg-[var(--background)]">
                    <td className="px-4 py-3 font-medium text-white">{tag.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">{tag.slug}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{tag.description || "—"}</td>
                    <td className="px-4 py-3 font-mono">{usage?.users || 0}</td>
                    <td className="px-4 py-3 font-mono">{usage?.courses || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <EditTagButton tag={tag} />
                        <DeleteTagButton tagId={tag.id} name={tag.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
