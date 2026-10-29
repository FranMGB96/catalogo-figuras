const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

/** 15000 → "$15.000". Un precio 0 se muestra como "Consultar precio". */
export function formatearPrecio(precio: number): string {
  return precio > 0 ? clp.format(precio) : "Consultar precio";
}
