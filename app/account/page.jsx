export const dynamic = 'force-dynamic';
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Account() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setEmail(null);
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">Compte</h1>
      {email ? (
        <>
          <p>Connecté : <b>{email}</b></p>
          <button onClick={signOut} className="px-3 py-2 rounded bg-black text-white">
            Se déconnecter
          </button>
        </>
      ) : (
        <p>Non connecté. <a href="/login" className="underline">Se connecter</a></p>
      )}
    </main>
  );
}