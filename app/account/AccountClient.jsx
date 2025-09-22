"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import TopBar from "@/app/_components/TopBar";

export default function AccountClient() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user) { location.href="/login"; return; }
      setUser(u.user);

      const { data: p } = await supabase
        .from("profiles").select("*")
        .eq("user_id", u.user.id).maybeSingle();

      setProfile({
        first_name: p?.first_name ?? "",
        last_name:  p?.last_name  ?? "",
        birth_date: p?.birth_date ?? "",
        gender:     p?.gender     ?? "H",
        city:       p?.city       ?? "",
        completed_at: p?.completed_at ?? null
      });
    })();
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    setMsg("");
    const supabase = getSupabaseClient();
    if (!supabase || !user) { setMsg("Configuration manquante."); return; }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name || null,
        last_name:  profile.last_name  || null,
        birth_date: profile.birth_date || null,
        gender:     profile.gender     || null,
        city:       profile.city       || null,
        completed_at: profile.completed_at || new Date().toISOString()
      })
      .eq("user_id", user.id);

    if (error) setMsg("Erreur : " + error.message);
    else { setMsg("Profil mis à jour."); setEdit(false); }
  }

  async function sendPasswordReset() {
    setMsg("");
    const supabase = getSupabaseClient();
    if (!supabase || !user?.email) { setMsg("Configuration manquante."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${location.origin}/auth/reset`,
    });
    setMsg(error ? "Erreur : " + error.message : "Email envoyé pour changer le mot de passe.");
  }

  if (!user || !profile) return <main className="p-6">Chargement…</main>;

  return (
    <main className="min-h-screen bg-gray-50">
      <TopBar />
      <section className="max-w-lg mx-auto p-6 space-y-8">
        <div className="text-sm"><a href="/" className="underline">← Retour à l’accueil</a></div>

        <header className="space-y-1">
          <h1 className="text-2xl font-bold">Mon compte</h1>
          <p className="text-sm text-gray-600">Connecté : <b>{user.email}</b></p>
        </header>

        <section className="bg-white border rounded p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Profil</h2>
            {!edit ? (
              <button onClick={()=>setEdit(true)} className="text-sm underline">Modifier</button>
            ) : (
              <button onClick={()=>setEdit(false)} className="text-sm underline">Annuler</button>
            )}
          </div>

          {!edit ? (
            <div className="mt-3 space-y-1 text-sm">
              <p>Prénom : <b>{profile.first_name || "—"}</b></p>
              <p>Nom : <b>{profile.last_name || "—"}</b></p>
              <p>Date de naissance : <b>{profile.birth_date || "—"}</b></p>
              <p>Sexe : <b>{profile.gender === "H" ? "Homme" : "Femme"}</b></p>
              <p>Ville : <b>{profile.city || "—"}</b></p>
            </div>
          ) : (
            <form onSubmit={saveProfile} className="mt-3 grid grid-cols-1 gap-3">
              <label className="block text-sm">Prénom
                <input className="mt-1 w-full border rounded px-2 py-2"
                  value={profile.first_name}
                  onChange={e=>setProfile({...profile, first_name:e.target.value})}/>
              </label>
              <label className="block text-sm">Nom
                <input className="mt-1 w-full border rounded px-2 py-2"
                  value={profile.last_name}
                  onChange={e=>setProfile({...profile, last_name:e.target.value})}/>
              </label>
              <label className="block text-sm">Date de naissance
                <input type="date" className="mt-1 w-full border rounded px-2 py-2"
                  value={profile.birth_date}
                  onChange={e=>setProfile({...profile, birth_date:e.target.value})}/>
              </label>
              <label className="block text-sm">Sexe
                <select className="mt-1 w-full border rounded px-2 py-2"
                  value={profile.gender}
                  onChange={e=>setProfile({...profile, gender:e.target.value})}>
                  <option value="H">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </label>
              <label className="block text-sm">Ville
                <input className="mt-1 w-full border rounded px-2 py-2"
                  value={profile.city}
                  onChange={e=>setProfile({...profile, city:e.target.value})}/>
              </label>
              <button className="mt-2 px-3 py-2 rounded bg-black text-white">Enregistrer</button>
            </form>
          )}
        </section>

        <section className="bg-white border rounded p-4 space-y-2">
          <h2 className="font-semibold">Sécurité</h2>
          <button onClick={sendPasswordReset} className="px-3 py-2 rounded border border-black">
            Changer mon mot de passe (email)
          </button>
          {msg && <p className="text-sm">{msg}</p>}
        </section>
      </section>
    </main>
  );
}