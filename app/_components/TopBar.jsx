"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function TopBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  async function signOut() {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    location.href = "/"; // retour accueil
  }

  return (
    <header className="w-full max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
      <Link href="/" className="font-semibold">← Accueil</Link>
      <nav className="flex items-center gap-3 text-sm">
        {user ? (
          <>
            <button onClick={signOut} className="border px-3 py-1 rounded">Se déconnecter</button>
          </>
        ) : (
          <>
            <Link href="/login" className="underline">Se connecter</Link>
            <Link href="/signup" className="border px-3 py-1 rounded">Créer un compte</Link>
          </>
        )}
      </nav>
    </header>
  );
}