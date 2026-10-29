import Image from "next/image";
import { IconoImagen } from "./Iconos";

type Props = {
  src: string | null;
  alt: string;
  sizes: string;
  prioridad?: boolean;
  className?: string;
};

/** Foto del producto, o un espacio reservado si todavía no tiene foto. */
export function FotoProducto({ src, alt, sizes, prioridad = false, className = "" }: Props) {
  return (
    <div className={`relative overflow-hidden bg-foto ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={prioridad} className="object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-primario">
          <IconoImagen />
          <span className="text-sm font-semibold">Sin foto</span>
        </div>
      )}
    </div>
  );
}
