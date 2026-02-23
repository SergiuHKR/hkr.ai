"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getUserRole, hasPermission } from "@/lib/lms/roles";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const role = await getUserRole(supabase, user.id);
  if (!hasPermission(role, "view_admin")) throw new Error("Not authorized");

  return { supabase, user, role };
}

async function getAdminOrgId() {
  const { supabase, user } = await requireAdmin();
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id")
    .eq("user_id", user.id)
    .single();
  if (!profile?.org_id) throw new Error("No organization found");
  return { supabase, orgId: profile.org_id };
}

// ─── Org Domains ────────────────────────────────────────────────────────────

export async function addOrgDomain(formData: FormData) {
  const domain = (formData.get("domain") as string)?.trim().toLowerCase();
  if (!domain) return { error: "Domain is required" };
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain))
    return { error: "Invalid domain format" };

  const { supabase, orgId } = await getAdminOrgId();
  const { error } = await supabase
    .from("org_domains")
    .insert({ org_id: orgId, domain });

  if (error) {
    if (error.code === "23505") return { error: "Domain already exists" };
    return { error: error.message };
  }

  revalidatePath("/admin/org");
  return { success: true };
}

export async function removeOrgDomain(domainId: string) {
  const { supabase } = await getAdminOrgId();
  const { error } = await supabase.from("org_domains").delete().eq("id", domainId);
  if (error) return { error: error.message };
  revalidatePath("/admin/org");
  return { success: true };
}

// ─── Org Allowlist ──────────────────────────────────────────────────────────

export async function addAllowlistEmail(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "Email is required" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Invalid email format" };

  const { supabase, orgId } = await getAdminOrgId();
  const { error } = await supabase
    .from("org_allowlist")
    .insert({ org_id: orgId, email });

  if (error) {
    if (error.code === "23505") return { error: "Email already in allowlist" };
    return { error: error.message };
  }

  revalidatePath("/admin/org");
  return { success: true };
}

export async function removeAllowlistEmail(emailId: string) {
  const { supabase } = await getAdminOrgId();
  const { error } = await supabase
    .from("org_allowlist")
    .delete()
    .eq("id", emailId);
  if (error) return { error: error.message };
  revalidatePath("/admin/org");
  return { success: true };
}

// ─── Tags ───────────────────────────────────────────────────────────────────

export async function createTag(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required" };

  const slug =
    (formData.get("slug") as string)?.trim().toLowerCase().replace(/\s+/g, "-") ||
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const description = (formData.get("description") as string)?.trim() || null;

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("tags").insert({ name, slug, description });

  if (error) {
    if (error.code === "23505") return { error: "Tag slug already exists" };
    return { error: error.message };
  }

  revalidatePath("/admin/tags");
  return { success: true };
}

export async function updateTag(tagId: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required" };
  const description = (formData.get("description") as string)?.trim() || null;

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("tags")
    .update({ name, description })
    .eq("id", tagId);

  if (error) return { error: error.message };
  revalidatePath("/admin/tags");
  return { success: true };
}

export async function deleteTag(tagId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("tags").delete().eq("id", tagId);
  if (error) return { error: error.message };
  revalidatePath("/admin/tags");
  return { success: true };
}

// ─── Courses ────────────────────────────────────────────────────────────────

export async function createCourse(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase().replace(/\s+/g, "-");
  const description = (formData.get("description") as string)?.trim() || null;
  const is_published = formData.get("is_published") === "true";

  if (!title) return { error: "Title is required" };
  if (!slug) return { error: "Slug is required" };

  const { supabase } = await requireAdmin();

  // Get next sort_order
  const { data: lastCourse } = await supabase
    .from("courses")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  const sort_order = (lastCourse?.sort_order || 0) + 1;

  const { error } = await supabase
    .from("courses")
    .insert({ title, slug, description, is_published, sort_order });

  if (error) {
    if (error.code === "23505") return { error: "Course slug already exists" };
    return { error: error.message };
  }

  revalidatePath("/admin/courses");
  return { success: true };
}

export async function updateCourse(courseId: string, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const is_published = formData.get("is_published") === "true";

  if (!title) return { error: "Title is required" };

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("courses")
    .update({ title, description, is_published })
    .eq("id", courseId);

  if (error) return { error: error.message };
  revalidatePath("/admin/courses");
  return { success: true };
}

export async function deleteCourse(courseId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("courses").delete().eq("id", courseId);
  if (error) return { error: error.message };
  revalidatePath("/admin/courses");
  return { success: true };
}

export async function toggleCoursePublish(courseId: string, isPublished: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("courses")
    .update({ is_published: isPublished })
    .eq("id", courseId);
  if (error) return { error: error.message };
  revalidatePath("/admin/courses");
  return { success: true };
}

// ─── Course Reorder ──────────────────────────────────────────────────────────

export async function reorderCourse(courseId: string, direction: "up" | "down") {
  const { supabase } = await requireAdmin();

  // Get the current course
  const { data: current } = await supabase
    .from("courses")
    .select("id, sort_order")
    .eq("id", courseId)
    .single();
  if (!current) return { error: "Course not found" };

  // Find the adjacent course
  const { data: adjacent } = await supabase
    .from("courses")
    .select("id, sort_order")
    .order("sort_order", { ascending: direction === "up" })
    .filter(
      "sort_order",
      direction === "up" ? "lt" : "gt",
      current.sort_order
    )
    .limit(1)
    .single();

  if (!adjacent) return { error: `No course to swap with (already at ${direction === "up" ? "top" : "bottom"})` };

  // Swap sort_order values
  const { error: e1 } = await supabase
    .from("courses")
    .update({ sort_order: adjacent.sort_order })
    .eq("id", current.id);
  if (e1) return { error: e1.message };

  const { error: e2 } = await supabase
    .from("courses")
    .update({ sort_order: current.sort_order })
    .eq("id", adjacent.id);
  if (e2) return { error: e2.message };

  revalidatePath("/admin/courses");
  return { success: true };
}

// ─── Modules ────────────────────────────────────────────────────────────────

export async function createModule(formData: FormData) {
  const course_id = (formData.get("course_id") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase().replace(/\s+/g, "-");

  if (!course_id || !title || !slug) return { error: "All fields are required" };

  const { supabase } = await requireAdmin();

  const { data: lastModule } = await supabase
    .from("modules")
    .select("sort_order")
    .eq("course_id", course_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  const sort_order = (lastModule?.sort_order || 0) + 1;

  const { error } = await supabase
    .from("modules")
    .insert({ course_id, title, slug, sort_order });

  if (error) {
    if (error.code === "23505") return { error: "Module slug already exists" };
    return { error: error.message };
  }

  revalidatePath("/admin/courses");
  return { success: true };
}

export async function updateModule(moduleId: string, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Title is required" };

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("modules")
    .update({ title })
    .eq("id", moduleId);

  if (error) return { error: error.message };
  revalidatePath("/admin/courses");
  return { success: true };
}

export async function deleteModule(moduleId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("modules").delete().eq("id", moduleId);
  if (error) return { error: error.message };
  revalidatePath("/admin/courses");
  return { success: true };
}

// ─── Lessons ────────────────────────────────────────────────────────────────

export async function createLesson(formData: FormData) {
  const module_id = (formData.get("module_id") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase().replace(/\s+/g, "-");
  const type = (formData.get("type") as string) || "text";
  const content_md = (formData.get("content_md") as string) || "";
  const duration_minutes = parseInt(formData.get("duration_minutes") as string) || 5;
  const xp_reward = parseInt(formData.get("xp_reward") as string) || 10;

  if (!module_id || !title || !slug) return { error: "Title and slug are required" };

  const { supabase } = await requireAdmin();

  const { data: lastLesson } = await supabase
    .from("lessons")
    .select("sort_order")
    .eq("module_id", module_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  const sort_order = (lastLesson?.sort_order || 0) + 1;

  const { error } = await supabase
    .from("lessons")
    .insert({ module_id, title, slug, type, content_md, duration_minutes, xp_reward, sort_order });

  if (error) {
    if (error.code === "23505") return { error: "Lesson slug already exists" };
    return { error: error.message };
  }

  revalidatePath("/admin/courses");
  return { success: true };
}

export async function updateLesson(
  lessonId: string,
  formData: FormData
) {
  const title = (formData.get("title") as string)?.trim();
  const content_md = (formData.get("content_md") as string) || "";
  const duration_minutes = parseInt(formData.get("duration_minutes") as string) || 5;
  const xp_reward = parseInt(formData.get("xp_reward") as string) || 10;
  const type = (formData.get("type") as string) || "text";

  if (!title) return { error: "Title is required" };

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("lessons")
    .update({ title, content_md, duration_minutes, xp_reward, type })
    .eq("id", lessonId);

  if (error) return { error: error.message };
  revalidatePath("/admin/courses");
  return { success: true };
}

export async function deleteLesson(lessonId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
  if (error) return { error: error.message };
  revalidatePath("/admin/courses");
  return { success: true };
}

// ─── Users ──────────────────────────────────────────────────────────────────

export async function updateUserRole(userId: string, newRole: string) {
  const validRoles = ["super_admin", "admin", "team_leader", "user"];
  if (!validRoles.includes(newRole)) return { error: "Invalid role" };

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("user_profiles")
    .update({ system_role: newRole })
    .eq("user_id", userId);

  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserTeam(userId: string, teamId: string | null) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("user_profiles")
    .update({ team_id: teamId })
    .eq("user_id", userId);

  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function setUserTags(userId: string, tagIds: string[]) {
  const { supabase } = await requireAdmin();

  // Delete existing tags
  await supabase.from("user_tags").delete().eq("user_id", userId);

  // Insert new tags
  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ user_id: userId, tag_id }));
    const { error } = await supabase.from("user_tags").insert(rows);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

// ─── Course Tags ────────────────────────────────────────────────────────────

export async function setCourseTags(courseId: string, tagIds: string[]) {
  const { supabase } = await requireAdmin();

  await supabase.from("course_tags").delete().eq("course_id", courseId);

  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ course_id: courseId, tag_id }));
    const { error } = await supabase.from("course_tags").insert(rows);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/courses");
  return { success: true };
}
