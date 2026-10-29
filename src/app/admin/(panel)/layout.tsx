"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SinConfiguracion } from "@/components/admin/SinConfiguracion";
import { supabaseNavegador } from "@/lib/supabase-navegador";

/** Protege todas las páginas del panel: sin sesión, redirige al login. */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseNavegador) return;
    const supabase = supabaseNavegador;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      // Verifica que la cuenta esté en la tabla "administradores" (ver supabase/seguridad.sql).
      const { data: esAdmin, error } = await supabase.rpc("es_admin");
      if (error || esAdmin !== true) {
        await supabase.auth.signOut();
        router.replace("/admin/login?sin-permiso=1");
        return;
      }
      setEmail(data.session.user.email ?? "");
    });

    const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      if (!sesion) router.replace("/admin/login");
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  if (!supabaseNavegador) return <SinConfiguracion />;

  if (email === null) {
    return <p className="px-4 py-16 text-center text-texto-suave">Cargando…</p>;
  }

  async function salir() {
    await supabaseNavegador?.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-borde bg-tarjeta">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="font-titulo text-lg font-medium">
            Panel
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold hover:bg-fondo"
            >
              Ver sitio
            </Link>
            <button
              type="button"
              onClick={salir}
              className="min-h-11 cursor-pointer rounded-full border border-[#d6d3d1] px-4 text-[15px] font-semibold hover:border-primario"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
