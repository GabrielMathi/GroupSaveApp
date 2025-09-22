"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function OnboardingClient() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    first_name:"", last_name:"", birth_date:"", gender:"H", city:""
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data: u } = await supabase.auth.getUser();
      if (!u?.user) { router.replace("/login"); return; }
      setUser(u.user);

      // Pré-remplir si déjà partiel
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", u.user.id)
        .maybeSingle();

      if (p) {
        setForm({
          first_name: p.first_name ?? "",
          last_name:  p.last_name  ?? "",
          birth_date: p.birth_date ?? "",
          gender:     p.gender     ?? "H",
          city:       p.city       ?? ""
        });
        if (p.completed_at) {
          // Si déjà complété, on va à l’app
          router.replace("/");
        }
      }
    })();
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    const supabase = getSupabaseClient();
    if (!supabase || !user) { setMsg("Configuration manquante."); return; }

    // mini-validation côté client
    if (!form.first_name || !form.last_name || !form.birth_date || !form.gender || !form.city) {
      setMsg("Merci de compléter tous les champs.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: form.first_name,
        last_name:  form.last_name,
        birth_date: form.birth_date,
        gender:     form.gender,
        city:       form.city,
        completed_at: new Date().toISOString()
      })
      .eq("user_id", user.id);

    if (error) { setMsg("Erreur : " + error.message); return; }

    router.replace("/"); // Aller à l’app (Accueil)
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Finaliser l’inscription</h1>
      <p className="text-sm text-gray-600">Indique tes informations pour continuer.</p>

      <form onSubmit={onSubmit} className="bg-white border rounded p-4 space-y-3">
        <label className="block text-sm">Prénom
          <input className="mt-1 w-full border rounded px-2 py-2"
                 value={form.first_name}
                 onChange={e=>setForm({...form, first_name:e.target.value})} required/>
        </label>
        <label className="block text-sm">Nom
          <input className="mt-1 w-full border rounded px-2 py-2"
                 value={form.last_name}
                 onChange={e=>setForm({...form, last_name:e.target.value})} required/>
        </label>
        <label className="block text-sm">Date de naissance
          <input type="date" className="mt-1 w-full border rounded px-2 py-2"
                 value={form.birth_date}
                 onChange={e=>setForm({...form, birth_date:e.target.value})} required/>
        </label>
        <label className="block text-sm">Sexe
          <select className="mt-1 w-full border rounded px-2 py-2"
                  value={form.gender}
                  onChange={e=>setForm({...form, gender:e.target.value})} required>
            <option value="H">Homme</option>
            <option value="F">Femme</option>
          </select>
        </label>
        <label className="block text-sm">Ville
          <input className="mt-1 w-full border rounded px-2 py-2"
                 value={form.city}
                 onChange={e=>setForm({...form, city:e.target.value})} required/>
        </label>

        <button className="px-3 py-2 rounded bg-black text-white w-full">
          Enregistrer et continuer
        </button>
        {msg && <p className="text-sm mt-1">{msg}</p>}
      </form>
    </main>
  );
}