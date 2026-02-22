import { SupabaseClient } from "@supabase/supabase-js";

export type Tag = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

/** Get all tags */
export async function getAllTags(supabase: SupabaseClient): Promise<Tag[]> {
  const { data } = await supabase
    .from("tags")
    .select("*")
    .order("name");

  return data || [];
}

/** Create a tag */
export async function createTag(
  supabase: SupabaseClient,
  name: string,
  slug: string,
  description?: string
): Promise<Tag | null> {
  const { data, error } = await supabase
    .from("tags")
    .insert({ name, slug, description: description || null })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Delete a tag */
export async function deleteTag(
  supabase: SupabaseClient,
  tagId: string
): Promise<void> {
  const { error } = await supabase
    .from("tags")
    .delete()
    .eq("id", tagId);

  if (error) throw new Error(error.message);
}

/** Assign tags to a course */
export async function setCourseTags(
  supabase: SupabaseClient,
  courseId: string,
  tagIds: string[]
): Promise<void> {
  // Remove existing
  await supabase.from("course_tags").delete().eq("course_id", courseId);

  // Insert new
  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ course_id: courseId, tag_id }));
    const { error } = await supabase.from("course_tags").insert(rows);
    if (error) throw new Error(error.message);
  }
}

/** Assign tags to a user */
export async function setUserTags(
  supabase: SupabaseClient,
  userId: string,
  tagIds: string[]
): Promise<void> {
  // Remove existing
  await supabase.from("user_tags").delete().eq("user_id", userId);

  // Insert new
  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ user_id: userId, tag_id }));
    const { error } = await supabase.from("user_tags").insert(rows);
    if (error) throw new Error(error.message);
  }
}

/** Get tags for a course */
export async function getCourseTags(
  supabase: SupabaseClient,
  courseId: string
): Promise<Tag[]> {
  const { data } = await supabase
    .from("course_tags")
    .select("tag_id")
    .eq("course_id", courseId);

  if (!data || data.length === 0) return [];

  const tagIds = data.map((ct: { tag_id: string }) => ct.tag_id);
  const { data: tags } = await supabase
    .from("tags")
    .select("*")
    .in("id", tagIds);

  return (tags || []) as Tag[];
}

/** Get tags for a user */
export async function getUserTagsList(
  supabase: SupabaseClient,
  userId: string
): Promise<Tag[]> {
  const { data } = await supabase
    .from("user_tags")
    .select("tag_id")
    .eq("user_id", userId);

  if (!data || data.length === 0) return [];

  const tagIds = data.map((ut: { tag_id: string }) => ut.tag_id);
  const { data: tags } = await supabase
    .from("tags")
    .select("*")
    .in("id", tagIds);

  return (tags || []) as Tag[];
}
