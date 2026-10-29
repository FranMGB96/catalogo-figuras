"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { revalidarSitio } from "@/app/admin/acciones";
import { IconoImagen } from "@/components/Iconos";
import { comprimirImagen, rutaEnBucket } from "@/lib/imagenes";
import type { Producto } from "@/lib/productos";
import { BUCKET_FOTOS, supabaseNavegador } from "@/lib/supabase-navegador";
import { Interruptor } from "./Interruptor";

const estiloCampo =
  "min-h-12 rounded-xl border border-[#d6d3d1] bg-white px-4 text-base outline-none focus:border-primario";

/** Formulario para crear (sin `producto`) o editar (con `producto`) una figura. */
export function FormularioProducto({ producto }: { producto?: Producto }) {
  const supabase = supabaseNavegador!;
  const router = useRouter();

  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [precio, setPrecio] = useState(producto && producto.precio > 0 ? String(producto.precio) : "");
  const [categoria, setCategoria] = useState(producto?.categoria ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [disponible, setDisponible] = useState(producto?.disponible ?? true);
  const [destacado, setDestacado] = useState(producto?.destacado ?? false);

  const [archivo, setArchivo] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(producto?.imagen_url ?? null);
  const [quitarFoto, setQuitarFoto] = useState(false);

  const [categorias, setCategorias] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Categorías ya usadas, para sugerirlas y evitar duplicados como "Buda" / "Budas".
  useEffect(() => {
    supabase
      .from("productos")
      .select("categoria")
      .then(({ data }) => {
        const unicas = Array.from(new Set((data ?? []).map((f: { categoria: string }) => f.categoria)));
        setCategorias(unicas.sort((a, b) => a.localeCompare(b, "es")));
      });
  }, [supabase]);

  // Libera la memoria de la vista previa local al cambiarla.
  useEffect(() => {
    return () => {
      if (vistaPrevia?.startsWith("blob:")) URL.revokeObjectURL(vistaPrevia);
    };
  }, [vistaPrevia]);

  function elegirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("El archivo elegido no es una imagen.");
      return;
    }
    setError(null);
    setArchivo(f);
    setQuitarFoto(false);
    setVistaPrevia(URL.createObjectURL(f));
  }

  function sacarFoto() {
    setArchivo(null);
    setVistaPrevia(null);
    setQuitarFoto(true);
  }

  /** Usa la categoría existente si solo cambia en mayúsculas/minúsculas. */
  function normalizarCategoria(valor: string): string {
    const limpio = valor.trim().replace(/\s+/g, " ");
    const existente = categorias.find((c) => c.toLowerCase() === limpio.toLowerCase());
    if (existente) return existente;
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const precioNumero = precio.trim() === "" ? 0 : Number(precio.replace(/\D/g, ""));
    if (!nombre.trim()) return setError("Escribe el nombre de la figura.");
    if (!categoria.trim()) return setError("Escribe o elige una categoría.");
    if (!Number.isFinite(precioNumero)) return setError("El precio debe ser un número.");

    setGuardando(true);
    try {
      const fotoAnterior = producto?.imagen_url ?? null;
      let imagen_url = quitarFoto ? null : fotoAnterior;

      if (archivo) {
        const blob = await comprimirImagen(archivo);
        const ruta = `${crypto.randomUUID()}.webp`;
        const { error: errorSubida } = await supabase.storage
          .from(BUCKET_FOTOS)
          .upload(ruta, blob, { contentType: "image/webp", cacheControl: "31536000" });
        if (errorSubida) throw new Error("No se pudo subir la foto.");
        imagen_url = supabase.storage.from(BUCKET_FOTOS).getPublicUrl(ruta).data.publicUrl;
      }

      const datos = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        precio: precioNumero,
        categoria: normalizarCategoria(categoria),
        imagen_url,
        disponible,
        destacado,
      };

      const { error: errorGuardar } = producto
        ? await supabase.from("productos").update(datos).eq("id", producto.id)
        : await supabase.from("productos").insert(datos);
      if (errorGuardar) throw new Error("No se pudo guardar la figura.");

      // Si la foto se reemplazó o se quitó, se borra la anterior para no ocupar espacio.
      if (fotoAnterior && fotoAnterior !== imagen_url) {
        const ruta = rutaEnBucket(fotoAnterior, BUCKET_FOTOS);
        if (ruta) await supabase.storage.from(BUCKET_FOTOS).remove([ruta]);
      }

      await revalidarSitio();
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al guardar.");
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link href="/admin" className="inline-flex min-h-11 w-fit items-center text-[15px] font-semibold text-texto-suave hover:text-texto">
          ← Volver
        </Link>
        <h1 className="font-titulo text-2xl font-medium sm:text-3xl">{producto ? "Editar figura" : "Nueva figura"}</h1>
      </div>

      {/* Foto */}
      <div className="flex flex-col gap-2">
        <span className="font-semibold">Foto</span>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="relative size-48 shrink-0 overflow-hidden rounded-2xl border border-borde bg-foto">
            {vistaPrevia ? (
              // <img> normal porque la vista previa es un archivo local (blob:)
              <img src={vistaPrevia} alt="Vista previa" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-primario">
                <IconoImagen />
                <span className="text-sm font-semibold">Sin foto</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] border-primario px-5 font-semibold hover:bg-[#f2ebe6]">
              {vistaPrevia ? "Cambiar foto" : "Elegir foto"}
              <input type="file" accept="image/*" onChange={elegirFoto} className="sr-only" />
            </label>
            {vistaPrevia && (
              <button
                type="button"
                onClick={sacarFoto}
                className="min-h-11 cursor-pointer rounded-full px-4 font-semibold text-[#b91c1c] hover:bg-[#fef2f2]"
              >
                Quitar foto
              </button>
            )}
          </div>
        </div>
        <span className="text-sm text-texto-suave">Desde el celular puedes sacar la foto en el momento.</span>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">Nombre</span>
        <input required maxLength={120} value={nombre} onChange={(e) => setNombre(e.target.value)} className={estiloCampo} placeholder="Ej: Buda meditando" />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">Precio</span>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-texto-suave">$</span>
          <input
            inputMode="numeric"
            value={precio}
            onChange={(e) => setPrecio(e.target.value.replace(/\D/g, ""))}
            className={`${estiloCampo} w-full pl-8`}
            placeholder="15000"
          />
        </div>
        <span className="text-sm text-texto-suave">Sin puntos. Si lo dejas vacío, el sitio muestra “Consultar precio”.</span>
      </label>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="categoria" className="font-semibold">
          Categoría
        </label>
        <input
          id="categoria"
          required
          list="categorias-existentes"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={estiloCampo}
          placeholder="Ej: Budas"
        />
        <datalist id="categorias-existentes">
          {categorias.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {categorias.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {categorias.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoria(c)}
                aria-pressed={categoria === c}
                className={`min-h-9 cursor-pointer rounded-full border px-3 text-sm font-semibold ${
                  categoria === c ? "border-primario bg-primario text-white" : "border-[#d6d3d1] bg-white hover:border-primario"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">
          Descripción <span className="font-normal text-texto-suave">(opcional)</span>
        </span>
        <textarea
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="rounded-xl border border-[#d6d3d1] bg-white px-4 py-3 text-base outline-none focus:border-primario"
          placeholder="Material, tamaño, color…"
        />
      </label>

      <div className="flex flex-col gap-1 rounded-2xl border border-borde bg-tarjeta p-4">
        <Interruptor activo={disponible} onCambiar={setDisponible} etiqueta={disponible ? "Disponible" : "Sin stock"} />
        <Interruptor activo={destacado} onCambiar={setDestacado} etiqueta="Destacada (aparece primero)" />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-[#fef2f2] px-4 py-3 text-[15px] font-semibold text-[#b91c1c]">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 border-t border-borde bg-fondo/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <button
          type="submit"
          disabled={guardando}
          className="min-h-12 w-full cursor-pointer rounded-full bg-acento px-8 font-bold text-black transition-colors duration-200 hover:bg-acento-hover hover:text-white disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {guardando ? "Guardando…" : producto ? "Guardar cambios" : "Agregar figura"}
        </button>
      </div>
    </form>
  );
}
