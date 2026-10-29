import Link from "next/link";
import { linkWhatsAppGeneral } from "@/lib/whatsapp";
import { BotonWhatsApp } from "./BotonWhatsApp";
import { IconoImagen } from "./Iconos";

export function Portada() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pt-8 pb-6 sm:px-6 md:flex-row md:items-center md:gap-12 md:pt-16 md:pb-12">
      <div className="flex flex-1 flex-col gap-4 md:gap-5">
        <span className="font-titulo text-[13px] font-medium tracking-[1.5px] text-acento-oscuro uppercase">
          Figuras decorativas
        </span>
        <h1 className="font-titulo text-[32px] leading-[1.15] font-medium tracking-tight text-balance md:text-[52px] md:leading-[1.1]">
          Budas, elefantes y figuras para dar calma a tu hogar
        </h1>
        <p className="max-w-xl text-base text-texto-suave md:text-lg">
          Mira el catálogo, elige tu figura y consúltanos por WhatsApp para saber si hay stock y
          coordinar la compra.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="#catalogo"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-acento px-6 font-bold text-black transition-colors duration-200 hover:bg-acento-hover hover:text-white"
          >
            Ver catálogo
          </Link>
          <BotonWhatsApp href={linkWhatsAppGeneral()} variante="contorno" className="min-h-12 px-6">
            Consultar por WhatsApp
          </BotonWhatsApp>
        </div>
      </div>

      {/* Espacio para la foto principal: reemplazar por <Image src="/portada.webp" ... /> */}
      <div
        role="img"
        aria-label="Espacio para la foto principal"
        className="flex h-56 flex-1 flex-col items-center justify-center gap-3 rounded-3xl border-[1.5px] border-dashed border-[#c9bdb4] bg-[#efe6df] text-etiqueta md:h-[420px]"
      >
        <IconoImagen className="size-10" />
        <span className="text-[15px] font-semibold">Foto principal (figuras ambientadas)</span>
      </div>
    </section>
  );
}
