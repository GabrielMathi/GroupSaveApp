"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

function mustComplete(p){
  return !p?.completed_at || !p?.first_name || !p?.last_name || !p?.birth_date || !p?.gender || !p?.city;
}

export default function ConfirmClient() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseClient();
      if (!supabase) { router.replace("/login?err=env"); return; }

      const code = sp.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) { router.replace("/login?err=exchange"); return; }
      }

      const { data: u } = await supabase.auth.getUser();
      if (!u?.user) { router.replace("/login"); return; }

      const { data: p } = await supabase.from("profiles")
        .select("*").eq("user_id", u.user.id).maybeSingle();

      router.replace(mustComplete(p) ? "/onboarding" : "/");
    })();
  }, [router, sp]);

  return <main className="p-6">Confirmation en cours…</main>;
}