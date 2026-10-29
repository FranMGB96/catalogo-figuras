"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SinConfiguracion } from "@/components/admin/SinConfiguracion";
import { supabaseNavegador } from "@/lib/supabase-navegador";
import { SITIO } from "@/lib/sitio";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  // Si ya hay sesión iniciada, ir directo al panel.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("sin-permiso")) {
      setError("Esta cuenta no tiene permiso para administrar el catálogo.");
    }
    supabaseNavegador?.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin");
    });
  }, [router]);

  if (!supabaseNavegador) return <SinConfiguracion />;
  const supabase = supabaseNavegador;

  async function ingresar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: clave });
    if (error) {
      setCargando(false);
      setError("El correo o la contraseña no son correctos.");
      return;
    }

    // La cuenta existe, pero ¿está en la lista de administradores?
    const { data: esAdmin, error: errorAdmin } = await supabase.rpc("es_admin");
    if (errorAdmin || esAdmin !== true) {
      await supabase.auth.signOut();
      setCargando(false);
      setError(
        errorAdmin
          ? "No se pudo verificar el permiso. ¿Ejecutaste supabase/seguridad.sql?"
          : "Esta cuenta no tiene permiso para administrar el catálogo.",
      );
      return;
    }
    router.replace("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <form
        onSubmit={ingresar}
        className="flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-borde bg-tarjeta p-6 sm:p-8"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold tracking-wide text-etiqueta uppercase">{SITIO.nombre}</span>
          <h1 className="font-titulo text-2xl font-medium">Administrar catálogo</h1>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Correo</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-12 rounded-xl border border-[#d6d3d1] bg-white px-4 text-base outline-none focus:border-primario"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Contraseña</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="min-h-12 rounded-xl border border-[#d6d3d1] bg-white px-4 text-base outline-none focus:border-primario"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-xl bg-[#fef2f2] px-4 py-3 text-[15px] font-semibold text-[#b91c1c]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="min-h-12 cursor-pointer rounded-full bg-acento font-bold text-black transition-colors duration-200 hover:bg-acento-hover hover:text-white disabled:cursor-wait disabled:opacity-60"
        >
          {cargando ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
