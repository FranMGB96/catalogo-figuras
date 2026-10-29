import Link from "next/link";
import { SITIO } from "@/lib/sitio";
import { linkWhatsAppGeneral } from "@/lib/whatsapp";
import { IconoChat } from "./Iconos";

export function Encabezado() {
  return (
    <header className="sticky top-0 z-20 border-b border-borde bg-tarjeta/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-texto no-underline">
          {/* Espacio para el logo: reemplazar por <Image src="/logo.svg" ... /> cuando exista */}
          <span className="flex size-9 items-center justify-center rounded-full border-[1.5px] border-dashed border-secundario font-titulo text-[10px] text-etiqueta sm:size-10">
            Logo
          </span>
          <span className="font-titulo text-lg font-medium sm:text-xl">{SITIO.nombre}</span>
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-6">
          <Link href="/#catalogo" className="hidden text-[15px] font-semibold hover:text-primario md:inline">
            Catálogo
          </Link>
          <Link href="/#como-comprar" className="hidden text-[15px] font-semibold hover:text-primario md:inline">
            Cómo comprar
          </Link>
          <Link href="/#contacto" className="hidden text-[15px] font-semibold hover:text-primario md:inline">
            Contacto
          </Link>
          <a
            href={linkWhatsAppGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-acento px-3 font-bold text-black transition-colors duration-200 hover:bg-acento-hover hover:text-white sm:px-5"
          >
            <IconoChat className="size-[18px]" />
            <span className="hidden sm:inline">Escríbenos</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
