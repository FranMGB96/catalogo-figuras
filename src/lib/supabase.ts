import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** true cuando las variables de Supabase están configuradas en .env.local */
export const supabaseConfigurado = Boolean(url && anonKey);

/**
 * Cliente público (solo lectura gracias a las políticas RLS).
 * Es null si Supabase todavía no está configurado; en ese caso se usan datos de ejemplo.
 */
export const supabase: SupabaseClient | null = supabaseConfigurado
  ? createClient(url!, anonKey!, { auth: { persistSession: false } })
  : null;
