"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { revalidarSitio } from "../acciones";
import { Interruptor } from "@/components/admin/Interruptor";
import { FotoProducto } from "@/components/FotoProducto";
import { formatearPrecio } from "@/lib/formato";
import { rutaEnBucket } from "@/lib/imagenes";
import type { Producto } from "@/lib/productos";
import { BUCKET_FOTOS, supabaseNavegador } from "@/lib/supabase-navegador";

export default function ListaProductos() {
  const supabase = supabaseNavegador!; // el layout ya verificó que existe
  const [productos, setProductos] = useState<Producto[] | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null); // id del producto que se está guardando

  const cargar = useCallback(async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("id, nombre, descripcion, precio, categoria, imagen_url, disponible, destacado")
      .order("creado_en", { ascending: false });
    if (error) setError("No se pudieron cargar los productos.");
    else setProductos(data as Producto[]);
  }, [supabase]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function cambiarStock(p: Producto, disponible: boolean) {
    setOcupado(p.id);
    setError(null);
    // Se actualiza la pantalla al tiro y se revierte si falla.
    setProductos((lista) => lista?.map((x) => (x.id === p.id ? { ...x, disponible } : x)) ?? null);
    const { error } = await supabase.from("productos").update({ disponible }).eq("id", p.id);
    if (error) {
      setError(`No se pudo cambiar el stock de "${p.nombre}".`);
      setProductos((lista) => lista?.map((x) => (x.id === p.id ? { ...x, disponible: !disponible } : x)) ?? null);
    } else {
      await revalidarSitio();
    }
    setOcupado(null);
  }

  async function eliminar(p: Producto) {
    if (!window.confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;
    setOcupado(p.id);
    setError(null);
    const { error } = await supabase.from("productos").delete().eq("id", p.id);
    if (error) {
      setError(`No se pudo eliminar "${p.nombre}".`);
      setOcupado(null);
      return;
    }
    const ruta = p.imagen_url ? rutaEnBucket(p.imagen_url, BUCKET_FOTOS) : null;
    if (ruta) await supabase.storage.from(BUCKET_FOTOS).remove([ruta]);
    setProductos((lista) => lista?.filter((x) => x.id !== p.id) ?? null);
    await revalidarSitio();
    setOcupado(null);
  }

  const texto = busqueda.trim().toLowerCase();
  const visibles = (productos ?? []).filter(
    (p) => !texto || p.nombre.toLowerCase().includes(texto) || p.categoria.toLowerCase().includes(texto),
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-titulo text-2xl font-medium sm:text-3xl">Figuras</h1>
        <Link
          href="/admin/nuevo"
          className="inline-flex min-h-12 items-center rounded-full bg-acento px-6 font-bold text-black transition-colors duration-200 hover:bg-acento-hover hover:text-white"
        >
          + Agregar figura
        </Link>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="sr-only">Buscar figura</span>
        <input
          type="search"
          placeholder="Buscar por nombre o categoría"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="min-h-12 rounded-xl border border-[#d6d3d1] bg-white px-4 text-base outline-none focus:border-primario"
        />
      </label>

      {error && (
        <p role="alert" className="rounded-xl bg-[#fef2f2] px-4 py-3 text-[15px] font-semibold text-[#b91c1c]">
          {error}
        </p>
      )}

      {productos === null && !error && <p className="text-texto-suave">Cargando productos…</p>}

      {productos !== null && visibles.length === 0 && (
        <p className="rounded-2xl border border-borde bg-tarjeta p-8 text-center text-texto-suave">
          {productos.length === 0 ? "Todavía no hay figuras. Agrega la primera." : "No hay figuras que coincidan."}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {visibles.map((p) => (
          <li key={p.id} className="flex flex-col gap-3 rounded-2xl border border-borde bg-tarjeta p-3 sm:flex-row sm:items-center sm:p-4">
            <div className="flex flex-1 items-center gap-3">
              <FotoProducto src={p.imagen_url} alt={p.nombre} sizes="72px" className="size-[72px] shrink-0 rounded-xl" />
              <div className="flex min-w-0 flex-col">
                <span className="text-xs font-bold tracking-wide text-etiqueta uppercase">{p.categoria}</span>
                <span className="truncate font-titulo text-[17px] font-medium">{p.nombre}</span>
                <span className="text-[15px] font-semibold text-texto-suave">{formatearPrecio(p.precio)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-borde pt-3 sm:border-0 sm:pt-0">
              <Interruptor
                activo={p.disponible}
                etiqueta={p.disponible ? "Disponible" : "Sin stock"}
                deshabilitado={ocupado === p.id}
                onCambiar={(v) => cambiarStock(p, v)}
              />
              <div className="flex gap-2">
                <Link
                  href={`/admin/editar/${p.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-[#d6d3d1] px-4 text-[15px] font-semibold hover:border-primario"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  disabled={ocupado === p.id}
                  onClick={() => eliminar(p)}
                  className="min-h-11 cursor-pointer rounded-full px-4 text-[15px] font-semibold text-[#b91c1c] hover:bg-[#fef2f2] disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
