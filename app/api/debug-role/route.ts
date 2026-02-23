import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not authenticated", authErr });
  }

  // Query system_role
  const { data: profile, error: profileErr } = await supabase
    .from("user_profiles")
    .select("user_id, display_name, system_role, org_id")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({
    authUserId: user.id,
    authEmail: user.email,
    profile,
    profileErr: profileErr?.message,
  });
}
