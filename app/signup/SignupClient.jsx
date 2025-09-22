"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function SignupClient() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "", agree: false });
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!form.agree) { setMsg("Accepte les CGU/Confidentialité."); return; }
    if (form.password !== form.confirm) { setMsg("Les mots de passe ne correspondent pas."); return; }

    const supabase = getSupabaseClient();
    if (!supabase) { setMsg("Configuration manquante."); return; }

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: `${location.origin}/auth/confirm` },
    });

    setMsg(error ? "Erreur : " + error.message : "Compte créé. Vérifie ton email pour confirmer.");
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <form onSubmit={onSubmit} className="bg-white border rounded p-4 space-y-3">
        <label className="block text-sm">Email
          <input type="email" className="mt-1 w-full border rounded px-2 py-2"
                 value={form.email}
                 onChange={e=>setForm({...form, email:e.target.value})}
                 required />
        </label>
        <label className="block text-sm">Mot de passe
          <input type="password" className="mt-1 w-full border rounded px-2 py-2"
                 value={form.password}
                 onChange={e=>setForm({...form, password:e.target.value})}
                 required />
        </label>
        <label className="block text-sm">Confirmer
          <input type="password" className="mt-1 w-full border rounded px-2 py-2"
                 value={form.confirm}
                 onChange={e=>setForm({...form, confirm:e.target.value})}
                 required />
        </label>
        <label className="block text-xs">
          <input type="checkbox"
                 checked={form.agree}
                 onChange={e=>setForm({...form, agree:e.target.checked})} />{" "}
          J’accepte les <a href="/legal/terms" className="underline">CGU</a> et la{" "}
          <a href="/legal/privacy" className="underline">Confidentialité</a>.
        </label>
        <button className="px-3 py-2 rounded bg-black text-white w-full">Créer mon compte</button>
        {msg && <p className="text-sm">{msg}</p>}
        <p className="text-sm"><a className="underline" href="/">← Retour à l’accueil</a></p>
      </form>
    </main>
  );
}