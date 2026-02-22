import { SupabaseClient } from "@supabase/supabase-js";

export type XpReason = "lesson_completion" | "course_completion" | "achievement_grant" | "manual";

export type XpTransaction = {
  id: string;
  user_id: string;
  amount: number;
  reason: XpReason;
  reference_id: string | null;
  created_at: string;
};

/** Record an XP transaction and update user profile total */
export async function recordXpTransaction(
  supabase: SupabaseClient,
  userId: string,
  amount: number,
  reason: XpReason,
  referenceId?: string
): Promise<XpTransaction | null> {
  const { data, error } = await supabase
    .from("xp_transactions")
    .insert({
      user_id: userId,
      amount,
      reason,
      reference_id: referenceId || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to record XP transaction:", error.message);
    return null;
  }

  return data;
}

/** Get user's XP transaction history */
export async function getUserXpHistory(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 50
): Promise<XpTransaction[]> {
  const { data } = await supabase
    .from("xp_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data || [];
}
