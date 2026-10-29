import { supabase } from "./supabase";

export type Producto = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoria: string;
  imagen_url: string | null;
  disponible: boolean;
  destacado: boolean;
};

const COLUMNAS = "id, nombre, descripcion, precio, categoria, imagen_url, disponible, destacado";

// Se muestran mientras Supabase no esté configurado, para poder ver el diseño.
const EJEMPLOS: Producto[] = [
  { id: "ejemplo-1", nombre: "Buda meditando", descripcion: "Figura decorativa de Buda en posición de meditación.", precio: 0, categoria: "Budas", imagen_url: null, disponible: true, destacado: true },
  { id: "ejemplo-2", nombre: "Buda dorado", descripcion: null, precio: 0, categoria: "Budas", imagen_url: null, disponible: true, destacado: false },
  { id: "ejemplo-3", nombre: "Elefante de la suerte", descripcion: "Elefante con la trompa hacia arriba.", precio: 0, categoria: "Elefantes", imagen_url: null, disponible: true, destacado: true },
  { id: "ejemplo-4", nombre: "Pareja de elefantes", descripcion: null, precio: 0, categoria: "Elefantes", imagen_url: null, disponible: false, destacado: false },
  { id: "ejemplo-5", nombre: "Ganesha sentado", descripcion: null, precio: 0, categoria: "Ganesha", imagen_url: null, disponible: true, destacado: false },
  { id: "ejemplo-6", nombre: "Ganesha con loto", descripcion: null, precio: 0, categoria: "Ganesha", imagen_url: null, disponible: true, destacado: false },
  { id: "ejemplo-7", nombre: "Monje en reposo", descripcion: null, precio: 0, categoria: "Otros", imagen_url: null, disponible: true, destacado: false },
  { id: "ejemplo-8", nombre: "Mano de loto", descripcion: null, precio: 0, categoria: "Otros", imagen_url: null, disponible: false, destacado: false },
  { id: "ejemplo-9", nombre: "Mano de loto", descripcion: null, precio: 0, categoria: "Tortugas", imagen_url: null, disponible: false, destacado: false },
];

/** Todos los productos: primero los disponibles, luego destacados, luego los más nuevos. */
export async function obtenerProductos(): Promise<Producto[]> {
  if (!supabase) return EJEMPLOS;

  const { data, error } = await supabase
    .from("productos")
    .select(COLUMNAS)
    .order("disponible", { ascending: false })
    .order("destacado", { ascending: false })
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error al cargar productos:", error.message);
    return [];
  }
  return data as Producto[];
}

export async function obtenerProducto(id: string): Promise<Producto | null> {
  if (!supabase) return EJEMPLOS.find((p) => p.id === id) ?? null;

  const { data, error } = await supabase
    .from("productos")
    .select(COLUMNAS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error al cargar el producto:", error.message);
    return null;
  }
  return data as Producto | null;
}
