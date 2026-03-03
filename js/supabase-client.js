/**
 * Supabase-Client-Konfiguration
 *
 * Credentials werden aus <meta>-Tags gelesen, die in index.html gesetzt sind.
 * Für lokale Entwicklung: .env.local anlegen und Werte dort eintragen.
 * Auf GitHub Pages: Werte direkt in die <meta>-Tags schreiben (Anon Key ist öffentlich).
 */

const SUPABASE_URL = document.querySelector('meta[name="supabase-url"]')?.content
  || 'https://xxxxxxxxxxxx.supabase.co';

const SUPABASE_ANON_KEY = document.querySelector('meta[name="supabase-anon-key"]')?.content
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase, SUPABASE_URL };
