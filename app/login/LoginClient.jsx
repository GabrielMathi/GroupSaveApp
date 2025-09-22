"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";
import TopBar from "@/app/_components/TopBar";

export default function LoginClient() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  // Si déjà connecté → redirection vers l’accueil
  useEffect(() => {
    (async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace("/"); // déjà loggé
    })();
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    const supabase = getSupabaseClient();
    if (!supabase) { setMsg("Configuration manquante."); return; }

    const { error } = await supabase.auth.signInWithPassword(form);
    if (error) setMsg("Erreur : " + error.message);
    else router.replace("/account");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <TopBar />
      <section className="max-w-md mx-auto p-6 space-y-3">
        <h1 className="text-2xl font-bold">Se connecter</h1>
        <form onSubmit={onSubmit} className="bg-white border rounded p-4 space-y-3">
          <label className="block text-sm">Email
            <input type="email" className="mt-1 w-full border rounded px-2 py-2"
              value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
          </label>
          <label className="block text-sm">Mot de passe
            <input type="password" className="mt-1 w-full border rounded px-2 py-2"
              value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
          </label>
          <button className="px-3 py-2 rounded bg-black text-white w-full">Se connecter</button>
        </form>
        {msg && <p className="text-sm">{msg}</p>}
        <p className="text-sm"><a className="underline" href="/forgot">Mot de passe oublié ?</a></p>
        <p className="text-sm"><a className="underline" href="/">← Retour à l’accueil</a></p>
      </section>
    </main>
  );
}