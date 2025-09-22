"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

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
        router.replace(error ? "/login?err=exchange" : "/account");
        return;
      }
      const { data } = await supabase.auth.getSession();
      router.replace(data.session ? "/account" : "/login?verified=1");
    })();
  }, [sp, router]);

  return <main className="p-6">Confirmation en cours…</main>;
}