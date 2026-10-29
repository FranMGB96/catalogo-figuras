"use client";

import { useMemo, useState } from "react";
import type { Producto } from "@/lib/productos";
import { TarjetaProducto } from "./TarjetaProducto";

const TODAS = "Todas";

export function Catalogo({ productos }: { productos: Producto[] }) {
  const [categoria, setCategoria] = useState(TODAS);

  // Las categorías salen de los mismos productos, así no hay que mantenerlas aparte.
  const categorias = useMemo(
    () => [TODAS, ...Array.from(new Set(productos.map((p) => p.categoria))).sort((a, b) => a.localeCompare(b, "es"))],
    [productos],
  );

  const visibles = categoria === TODAS ? productos : productos.filter((p) => p.categoria === categoria);

  return (
    <section id="catalogo" className="mx-auto flex max-w-6xl scroll-mt-20 flex-col gap-4 pt-4 pb-12 sm:gap-6 sm:px-6 md:pb-16">
      <div className="flex items-baseline justify-between gap-3 px-4 sm:px-0">
        <h2 className="font-titulo text-[26px] font-medium md:text-[32px]">Catálogo</h2>
        <span className="text-sm text-texto-suave sm:text-[15px]" aria-live="polite">
          {visibles.length} {visibles.length === 1 ? "figura" : "figuras"}
        </span>
      </div>

      <div
        role="group"
        aria-label="Filtrar por categoría"
        className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:flex-wrap sm:px-0"
      >
        {categorias.map((c) => {
          const activa = c === categoria;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={activa}
              onClick={() => setCategoria(c)}
              className={`min-h-11 shrink-0 cursor-pointer rounded-full border-[1.5px] px-5 text-[15px] transition-colors duration-200 ${
                activa
                  ? "border-primario bg-primario font-bold text-white"
                  : "border-[#d6d3d1] bg-tarjeta font-semibold text-texto hover:border-primario"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {visibles.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-6 sm:px-0 lg:grid-cols-4">
          {visibles.map((p) => (
            <TarjetaProducto key={p.id} producto={p} />
          ))}
        </div>
      ) : (
        <p className="mx-4 rounded-2xl border border-borde bg-tarjeta p-8 text-center text-texto-suave sm:mx-0">
          Todavía no hay figuras en esta categoría.
        </p>
      )}
    </section>
  );
}
