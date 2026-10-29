import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BotonFlotante } from "@/components/BotonFlotante";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import { Encabezado } from "@/components/Encabezado";
import { FotoProducto } from "@/components/FotoProducto";
import { IconoFlechaIzquierda } from "@/components/Iconos";
import { PiePagina } from "@/components/PiePagina";
import { formatearPrecio } from "@/lib/formato";
import { obtenerProducto } from "@/lib/productos";
import { linkWhatsAppProducto } from "@/lib/whatsapp";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const producto = await obtenerProducto(id);
  if (!producto) return { title: "Figura no encontrada" };
  return {
    title: producto.nombre,
    description: producto.descripcion ?? `${producto.nombre} — ${producto.categoria}`,
    openGraph: producto.imagen_url ? { images: [producto.imagen_url] } : undefined,
  };
}

export default async function DetalleProducto({ params }: Props) {
  const { id } = await params;
  const producto = await obtenerProducto(id);
  if (!producto) notFound();

  const sinStock = !producto.disponible;
  const whatsapp = linkWhatsAppProducto(producto);

  return (
    <>
      <Encabezado />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-12">
        <Link
          href="/#catalogo"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-texto-suave hover:text-texto"
        >
          <IconoFlechaIzquierda />
          Volver al catálogo
        </Link>

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <div className="relative">
            <FotoProducto
              src={producto.imagen_url}
              alt={producto.nombre}
              sizes="(min-width: 768px) 50vw, 100vw"
              prioridad
              className="aspect-square rounded-3xl border border-borde"
            />
            {sinStock && (
              <span className="absolute top-4 left-4 rounded-full bg-texto px-3 py-1 text-sm font-bold text-white">
                Sin stock
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-sm font-bold tracking-wide text-etiqueta uppercase">{producto.categoria}</span>
            <h1 className="font-titulo text-3xl leading-tight font-medium md:text-[42px]">{producto.nombre}</h1>
            {producto.precio > 0 ? (
              <p className="text-2xl font-bold md:text-3xl">{formatearPrecio(producto.precio)}</p>
            ) : (
              <p className="text-lg font-semibold text-texto-suave">Precio a consultar por WhatsApp</p>
            )}
            {producto.descripcion && (
              <p className="max-w-prose text-base text-texto-suave md:text-lg">{producto.descripcion}</p>
            )}
            <p className={`text-[15px] font-semibold ${sinStock ? "text-etiqueta" : "text-[#15803d]"}`}>
              {sinStock ? "Por ahora sin stock. Pregúntanos cuándo vuelve a llegar." : "Disponible"}
            </p>
            <BotonWhatsApp href={whatsapp} className="mt-2 min-h-12 w-full px-6 text-base sm:w-auto sm:self-start">
              {sinStock ? "Consultar disponibilidad" : "Consultar por WhatsApp"}
            </BotonWhatsApp>
          </div>
        </div>
      </main>
      <PiePagina />
      <BotonFlotante href={whatsapp} />
    </>
  );
}
