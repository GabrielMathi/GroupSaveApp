"use client";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function AccountClient() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return; // sur Vercel build, évite crash
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  return (
    <main className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">Compte</h1>
      {email ? (
        <>
          <p>Connecté : <b>{email}</b></p>
          <button
            onClick={() => {
              const supabase = getSupabaseClient();
              if (!supabase) return;
              supabase.auth.signOut().then(()=>setEmail(null));
            }}
            className="px-3 py-2 rounded bg-black text-white"
          >
            Se déconnecter
          </button>
        </>
      ) : (
        <p>Non connecté. <a href="/login" className="underline">Se connecter</a></p>
      )}
    </main>
  );
}