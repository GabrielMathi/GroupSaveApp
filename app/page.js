"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function Home() {
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
    location.href = "/"; // on recharge vers accueil
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Logo */}
      <img
        src="assets/logo.png"
        alt="GroupSave Logo"
        className="w-24 h-24 mb-6"
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">GroupSave</h1>
      <p className="text-gray-600 mb-8">Achetez mieux, ensemble</p>

      {!user ? (
        // Pas connecté
        <div className="space-y-3 text-center">
          <a
            href="/signup"
            className="block px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition"
          >
            Créer un compte
          </a>
          <a
            href="/login"
            className="block px-4 py-2 rounded border border-black text-black hover:bg-gray-100 transition"
          >
            Se connecter
          </a>
        </div>
      ) : (
        // Connecté
        <div className="space-y-3 text-center">
          <a
            href="/account"
            className="block px-4 py-3 rounded bg-black text-white text-lg font-semibold hover:bg-gray-800 transition"
          >
            Mon compte
          </a>
          <button
            onClick={signOut}
            className="block w-full px-4 py-3 rounded border border-black text-black hover:bg-gray-100 transition"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </main>
  );
}