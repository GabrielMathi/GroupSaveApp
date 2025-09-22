"use client";
export const dynamic = 'force-dynamic';
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    (async () => {
      const code = sp.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        router.replace(error ? "/login?err=exchange" : "/account");
      } else {
        const { data } = await supabase.auth.getSession();
        router.replace(data.session ? "/account" : "/login?err=no-session");
      }
    })();
  }, [sp, router]);

  return <main className="p-6">Connexion en cours…</main>;
}