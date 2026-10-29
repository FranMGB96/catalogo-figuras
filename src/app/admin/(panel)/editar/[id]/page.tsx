"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormularioProducto } from "@/components/admin/FormularioProducto";
import type { Producto } from "@/lib/productos";
import { supabaseNavegador } from "@/lib/supabase-navegador";

export default function EditarFigura() {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null | undefined>(undefined);

  useEffect(() => {
    supabaseNavegador!
      .from("productos")
      .select("id, nombre, descripcion, precio, categoria, imagen_url, disponible, destacado")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => setProducto((data as Producto | null) ?? null));
  }, [id]);

  if (producto === undefined) return <p className="text-texto-suave">Cargando…</p>;

  if (producto === null) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-texto-suave">No se encontró esta figura. Puede que ya se haya eliminado.</p>
        <Link href="/admin" className="font-semibold underline">
          Volver al panel
        </Link>
      </div>
    );
  }

  return <FormularioProducto producto={producto} />;
}
