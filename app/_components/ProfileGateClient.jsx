"use client";
import { useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function ProfileGateClient() {
  useEffect(() => {
    (async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user) return;
      const { data: p } = await supabase.from("profiles")
        .select("first_name,last_name,birth_date,gender,city,completed_at")
        .eq("user_id", u.user.id).maybeSingle();
      const must = !p?.completed_at || !p?.first_name || !p?.last_name || !p?.birth_date || !p?.gender || !p?.city;
      if (must) location.href = "/onboarding";
    })();
  }, []);
  return null;
}