import Link from "next/link";
import { Encabezado } from "@/components/Encabezado";

export default function NoEncontrado() {
  return (
    <>
      <Encabezado />
      <main className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-titulo text-3xl font-medium">No encontramos esta figura</h1>
        <p className="text-texto-suave">Puede que ya no esté en el catálogo.</p>
        <Link
          href="/#catalogo"
          className="inline-flex min-h-12 items-center rounded-full bg-acento px-6 font-bold text-black transition-colors duration-200 hover:bg-acento-hover hover:text-white"
        >
          Ver catálogo
        </Link>
      </main>
    </>
  );
}
