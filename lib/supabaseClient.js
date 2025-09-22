import { createClient } from "@supabase/supabase-js";

// Ne crée PAS le client au chargement du module.
// On le crée seulement quand du code client l'appelle.
let _client = null;

export function getSupabaseClient() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Ne jette pas d'erreur pendant le build : renvoie null.
  if (!url || !anon) return null;
  _client = createClient(url, anon);
  return _client;
}