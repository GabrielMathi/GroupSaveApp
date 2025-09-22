"use client";
export const dynamic = 'force-dynamic';
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ConfirmPage() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    (async () => {
      // GoTrue v2 : un paramètre ?code peut être présent
      const code = sp.get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code).catch(() => {});
      }
      // Quoi qu'il arrive, envoie l’utilisateur vers /account s’il est loggé, sinon /login
      const { data } = await supabase.auth.getSession();
      router.replace(data.session ? "/account" : "/login?verified=1");
    })();
  }, [sp, router]);

  return <main className="p-6">Confirmation en cours…</main>;
}