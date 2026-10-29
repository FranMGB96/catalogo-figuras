import { SITIO } from "@/lib/sitio";
import { linkWhatsAppGeneral } from "@/lib/whatsapp";

export function PiePagina() {
  return (
    <footer id="contacto" className="mx-auto flex max-w-6xl scroll-mt-20 flex-col gap-4 px-4 pt-8 pb-28 sm:px-6 md:flex-row md:items-center md:justify-between md:pt-12">
      <div className="flex flex-col gap-1">
        <span className="font-titulo text-lg font-medium">{SITIO.nombre}</span>
        <span className="text-sm text-texto-suave md:text-[15px]">
          {SITIO.ubicacion} · {SITIO.horario}
        </span>
      </div>
      <div className="flex flex-wrap gap-6 text-[15px] font-semibold">
        <a href={linkWhatsAppGeneral()} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
          WhatsApp
        </a>
        {SITIO.instagram && (
          <a href={SITIO.instagram} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
            Instagram
          </a>
        )}
      </div>
    </footer>
  );
}
