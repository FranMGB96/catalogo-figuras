import Link from "next/link";
import type { Producto } from "@/lib/productos";
import { formatearPrecio } from "@/lib/formato";
import { linkWhatsAppProducto } from "@/lib/whatsapp";
import { BotonWhatsApp } from "./BotonWhatsApp";
import { FotoProducto } from "./FotoProducto";

export function TarjetaProducto({ producto }: { producto: Producto }) {
  const sinStock = !producto.disponible;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-borde bg-tarjeta transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(28,25,23,0.08)]">
      <Link href={`/productos/${producto.id}`} className="relative block">
        <FotoProducto
          src={producto.imagen_url}
          alt={producto.nombre}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
          className="aspect-square"
        />
        {sinStock && (
          <span className="absolute top-2 left-2 rounded-full bg-texto px-2.5 py-0.5 text-xs font-bold text-white sm:top-3 sm:left-3 sm:text-[13px]">
            Sin stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <span className="text-xs font-bold tracking-wide text-etiqueta uppercase">{producto.categoria}</span>
        <h3 className="font-titulo text-base leading-snug font-medium sm:text-lg">
          <Link href={`/productos/${producto.id}`} className="hover:text-primario">
            {producto.nombre}
          </Link>
        </h3>
        <p className="mb-2 text-[17px] font-bold sm:text-xl">{formatearPrecio(producto.precio)}</p>

        <BotonWhatsApp href={linkWhatsAppProducto(producto)} className="mt-auto w-full px-3 text-sm sm:text-[15px]">
          <span className="sm:hidden">{sinStock ? "Disponibilidad" : "Consultar"}</span>
          <span className="hidden sm:inline">{sinStock ? "Consultar disponibilidad" : "Consultar por WhatsApp"}</span>
        </BotonWhatsApp>
      </div>
    </article>
  );
}
