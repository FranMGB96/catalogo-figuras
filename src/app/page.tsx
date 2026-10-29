import { BotonFlotante } from "@/components/BotonFlotante";
import { Catalogo } from "@/components/Catalogo";
import { ComoComprar } from "@/components/ComoComprar";
import { Encabezado } from "@/components/Encabezado";
import { PiePagina } from "@/components/PiePagina";
import { Portada } from "@/components/Portada";
import { obtenerProductos } from "@/lib/productos";

// Vuelve a consultar los productos como máximo cada 60 segundos.
export const revalidate = 60;

export default async function Inicio() {
  const productos = await obtenerProductos();

  return (
    <>
      <Encabezado />
      <main>
        <Portada />
        <Catalogo productos={productos} />
        <ComoComprar />
      </main>
      <PiePagina />
      <BotonFlotante />
    </>
  );
}
