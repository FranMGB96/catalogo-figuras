"use server";

import { revalidatePath } from "next/cache";

/**
 * Le pide a Next.js que vuelva a generar las páginas públicas,
 * para que un cambio hecho en el panel se vea de inmediato en el sitio.
 */
export async function revalidarSitio() {
  revalidatePath("/", "layout");
}
