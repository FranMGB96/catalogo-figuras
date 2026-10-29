import { linkWhatsAppGeneral } from "@/lib/whatsapp";
import { IconoChat } from "./Iconos";

/** Botón redondo de WhatsApp fijo en la esquina, siempre visible. */
export function BotonFlotante({ href = linkWhatsAppGeneral() }: { href?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed right-4 bottom-5 z-30 flex size-14 items-center justify-center rounded-full bg-acento text-black shadow-[0_6px_20px_rgba(28,25,23,0.2)] transition-colors duration-200 hover:bg-acento-hover hover:text-white sm:right-6 sm:bottom-6 sm:size-[60px]"
    >
      <IconoChat className="size-[26px]" />
    </a>
  );
}
