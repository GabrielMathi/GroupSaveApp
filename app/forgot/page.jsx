"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/auth/reset",
    });
    setMsg(error ? "Erreur : " + error.message : "Email envoyé. Vérifie ta boîte mail.");
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">Réinitialiser le mot de passe</h1>
      <form onSubmit={onSubmit} className="bg-white border rounded p-4 space-y-3">
        <label className="block text-sm">
          Email
          <input
            type="email"
            className="mt-1 w-full border rounded px-2 py-2"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </label>
        <button className="px-3 py-2 rounded bg-black text-white w-full">
          Envoyer le lien
        </button>
      </form>
      {msg && <p className="text-sm">{msg}</p>}
      <p className="text-xs text-gray-600">Tu recevras un lien sécurisé pour définir un nouveau mot de passe.</p>
    </main>
  );
}