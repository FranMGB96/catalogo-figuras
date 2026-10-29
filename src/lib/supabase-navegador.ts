"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Cliente de Supabase para el panel de administración (se ejecuta en el navegador).
 * Guarda la sesión del administrador en el navegador. La seguridad real la ponen
 * las políticas RLS de la base de datos: sin sesión, nadie puede escribir.
 */
export const supabaseNavegador: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

/** Nombre del bucket de Storage donde se guardan las fotos. */
export const BUCKET_FOTOS = "productos";
