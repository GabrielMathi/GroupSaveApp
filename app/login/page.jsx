"use client";
export const dynamic = 'force-dynamic';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });
    if (error) setMsg("Erreur : " + error.message);
    else router.replace("/account");
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">Connexion</h1>
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
      <p className="text-sm">Pas de compte ? <a href="/signup" className="underline">Créer un compte</a></p>
      
      <p className="text-sm">
        <a href="/forgot" className="underline">Mot de passe oublié ?</a>
    </p>
    </main>
  );
}