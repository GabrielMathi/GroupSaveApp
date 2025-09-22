"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", confirm: "", agree: false });
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!form.agree) return setMsg("Veuillez accepter les CGU & Confidentialité.");
    if (form.password !== form.confirm) return setMsg("Les mots de passe ne correspondent pas.");

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: "http://localhost:3000/auth/confirm" }
    });

    if (error) setMsg("Erreur : " + error.message);
    else setMsg("Compte créé. Vérifiez votre email pour confirmer.");
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <form onSubmit={onSubmit} className="bg-white border rounded p-4 space-y-3">
        <label className="block text-sm">Email
          <input type="email" className="mt-1 w-full border rounded px-2 py-2"
                 value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        </label>
        <label className="block text-sm">Mot de passe
          <input type="password" className="mt-1 w-full border rounded px-2 py-2"
                 value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        </label>
        <label className="block text-sm">Confirmer le mot de passe
          <input type="password" className="mt-1 w-full border rounded px-2 py-2"
                 value={form.confirm} onChange={e=>setForm({...form, confirm:e.target.value})} required />
        </label>
        <label className="block text-xs">
          <input type="checkbox" checked={form.agree}
                 onChange={e=>setForm({...form, agree:e.target.checked})} />{" "}
          J’accepte les <a href="/legal/terms" className="underline">CGU</a> et la{" "}
          <a href="/legal/privacy" className="underline">Confidentialité</a>.
        </label>
        <button className="px-3 py-2 rounded bg-black text-white w-full">Créer mon compte</button>
      </form>
      {msg && <p className="text-sm">{msg}</p>}
      <p className="text-sm">Déjà un compte ? <a href="/login" className="underline">Se connecter</a></p>
    </main>
  );
}