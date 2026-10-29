import type { Producto } from "./productos";
import { formatearPrecio } from "./formato";

const NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/** Link a WhatsApp con un mensaje ya escrito. */
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

export function linkWhatsAppGeneral(): string {
  return linkWhatsApp("Hola, quiero consultar por las figuras del catálogo.");
}

export function linkWhatsAppProducto(p: Producto): string {
  const precio = p.precio > 0 ? ` (${formatearPrecio(p.precio)})` : "";
  return linkWhatsApp(`Hola, me interesa la figura "${p.nombre}"${precio}. ¿Hay stock?`);
}
