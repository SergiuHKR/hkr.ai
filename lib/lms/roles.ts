import { SupabaseClient } from "@supabase/supabase-js";

export type SystemRole = "super_admin" | "admin" | "team_leader" | "user";

/** Permission matrix: what each role can do */
const PERMISSIONS: Record<SystemRole, Set<string>> = {
  super_admin: new Set([
    "manage_orgs",
    "manage_users",
    "manage_courses",
    "manage_tags",
    "manage_achievements",
    "manage_seasons",
    "manage_org_domains",
    "manage_org_allowlist",
    "manage_org_settings",
    "review_tasks",
    "view_admin",
    "view_all_users",
  ]),
  admin: new Set([
    "manage_users",
    "manage_courses",
    "manage_tags",
    "manage_achievements",
    "manage_seasons",
    "manage_org_domains",
    "manage_org_allowlist",
    "manage_org_settings",
    "review_tasks",
    "view_admin",
    "view_all_users",
  ]),
  team_leader: new Set([
    "review_tasks",
    "view_all_users",
  ]),
  user: new Set([]),
};

/** Check if a role has a specific permission */
export function hasPermission(role: SystemRole, permission: string): boolean {
  return PERMISSIONS[role]?.has(permission) ?? false;
}

/** Check if a role can access admin panel */
export function canAccessAdmin(role: SystemRole): boolean {
  return hasPermission(role, "view_admin");
}

/** Get user's system role from their profile */
export async function getUserRole(
  supabase: SupabaseClient,
  userId: string
): Promise<SystemRole> {
  const { data } = await supabase
    .from("user_profiles")
    .select("system_role")
    .eq("user_id", userId)
    .single();

  return (data?.system_role as SystemRole) || "user";
}

/** Get user's tags */
export async function getUserTags(
  supabase: SupabaseClient,
  userId: string
): Promise<{ id: string; name: string; slug: string }[]> {
  const { data } = await supabase
    .from("user_tags")
    .select("tag_id")
    .eq("user_id", userId);

  if (!data || data.length === 0) return [];

  const tagIds = data.map((ut: { tag_id: string }) => ut.tag_id);
  const { data: tags } = await supabase
    .from("tags")
    .select("id, name, slug")
    .in("id", tagIds);

  return (tags || []) as { id: string; name: string; slug: string }[];
}

/** Get courses visible to a user based on their tags */
export async function getVisibleCourses(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  // Get user's tag IDs
  const userTags = await getUserTags(supabase, userId);
  const userTagIds = userTags.map((t) => t.id);

  // Get all published courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug")
    .eq("is_published", true);

  if (!courses) return [];

  // Get course-tag mappings
  const { data: courseTags } = await supabase
    .from("course_tags")
    .select("course_id, tag_id");

  // Build course -> tags map
  const courseTagMap = new Map<string, Set<string>>();
  for (const ct of courseTags || []) {
    if (!courseTagMap.has(ct.course_id)) {
      courseTagMap.set(ct.course_id, new Set());
    }
    courseTagMap.get(ct.course_id)!.add(ct.tag_id);
  }

  // Filter: show courses with no tags (general) OR matching at least one user tag
  return courses
    .filter((course: { id: string }) => {
      const tags = courseTagMap.get(course.id);
      if (!tags || tags.size === 0) return true; // General course
      return userTagIds.some((tagId) => tags.has(tagId));
    })
    .map((course: { id: string }) => course.id);
}
