/**
 * Achica y convierte una foto a WebP antes de subirla.
 * Las fotos del celular pesan 3–8 MB; así quedan en ~100–300 KB y el sitio carga rápido.
 */
export async function comprimirImagen(archivo: File, ladoMaximo = 1200, calidad = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, ladoMaximo / Math.max(bitmap.width, bitmap.height));
  const ancho = Math.round(bitmap.width * escala);
  const alto = Math.round(bitmap.height * escala);

  const canvas = document.createElement("canvas");
  canvas.width = ancho;
  canvas.height = alto;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen.");
  ctx.drawImage(bitmap, 0, 0, ancho, alto);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo convertir la imagen."))),
      "image/webp",
      calidad,
    );
  });
}

/** A partir de la URL pública de una foto, obtiene su ruta dentro del bucket (para poder borrarla). */
export function rutaEnBucket(urlPublica: string, bucket: string): string | null {
  const marca = `/storage/v1/object/public/${bucket}/`;
  const i = urlPublica.indexOf(marca);
  return i === -1 ? null : decodeURIComponent(urlPublica.slice(i + marca.length));
}
