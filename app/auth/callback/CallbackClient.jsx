"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseClient();
      if (!supabase) { router.replace("/login?err=env"); return; }

      const code = sp.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        router.replace(error ? "/login?err=exchange" : "/account");
      } else {
        router.replace("/login");
      }
    })();
  }, [sp, router]);

  return <main className="p-6">Connexion en cours…</main>;
}