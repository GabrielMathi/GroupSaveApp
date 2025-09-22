"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ password: "", confirm: "" });

  useEffect(() => {
    (async () => {
      try {
        // 1) Cas moderne: ?code=XXXX (PKCE)
        const code = sp.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setReady(true);
          return;
        }

        // 2) Cas hash (ancien format): #access_token=...&refresh_token=...&type=recovery
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (hash?.startsWith("#")) {
          const p = new URLSearchParams(hash.slice(1));
          const access_token = p.get("access_token");
          const refresh_token = p.get("refresh_token");
          const type = p.get("type");
          if (type === "recovery" && access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) throw error;
            setReady(true);
            return;
          }
        }

        setMsg("Lien invalide ou expiré.");
      } catch (e) {
        setMsg("Erreur d’authentification : " + (e?.message || String(e)));
      }
    })();
  }, [sp]);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (form.password !== form.confirm) {
      setMsg("Les mots de passe ne correspondent pas.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: form.password });
    if (error) {
      setMsg("Erreur : " + error.message);
      return;
    }
    setMsg("Mot de passe mis à jour. Redirection…");
    setTimeout(() => router.replace("/login"), 800);
  }

  if (!ready && !msg) return <main className="p-6">Vérification du lien…</main>;

  return (
    <main className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>
      {msg && <p className="text-sm">{msg}</p>}
      {ready && (
        <form onSubmit={onSubmit} className="bg-white border rounded p-4 space-y-3">
          <label className="block text-sm">
            Nouveau mot de passe
            <input
              type="password"
              className="mt-1 w-full border rounded px-2 py-2"
              value={form.password}
              onChange={(e)=>setForm({...form, password:e.target.value})}
              required
              minLength={8}
            />
          </label>
          <label className="block text-sm">
            Confirmer
            <input
              type="password"
              className="mt-1 w-full border rounded px-2 py-2"
              value={form.confirm}
              onChange={(e)=>setForm({...form, confirm:e.target.value})}
              required
              minLength={8}
            />
          </label>
          <button className="px-3 py-2 rounded bg-black text-white w-full">Mettre à jour</button>
        </form>
      )}
    </main>
  );
}