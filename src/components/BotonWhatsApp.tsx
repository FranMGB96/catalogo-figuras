import { IconoChat } from "./Iconos";

type Props = {
  href: string;
  children: React.ReactNode;
  variante?: "acento" | "contorno";
  className?: string;
};

/** Botón con forma de píldora que abre WhatsApp en una pestaña nueva. */
export function BotonWhatsApp({ href, children, variante = "acento", className = "" }: Props) {
  const estilos =
    variante === "acento"
      ? "bg-acento text-black hover:bg-acento-hover hover:text-white"
      : "border-[1.5px] border-primario text-texto hover:bg-[#f2ebe6]";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 font-bold transition-colors duration-200 ${estilos} ${className}`}
    >
      <IconoChat className="size-[18px]" />
      {children}
    </a>
  );
}
