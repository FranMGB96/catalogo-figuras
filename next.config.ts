import type { NextConfig } from "next";

// Cabeceras de seguridad que se envían en todas las páginas.
const cabecerasSeguridad = [
  // Obliga al navegador a usar siempre HTTPS en este dominio (2 años).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Impide que otro sitio muestre esta página dentro de un iframe (evita engaños tipo clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // El navegador no "adivina" el tipo de archivo: usa el que declara el servidor.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Al hacer clic hacia otro sitio, solo se comparte el dominio, no la ruta completa.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // El sitio no usa cámara, micrófono ni ubicación mediante APIs del navegador.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    // Permite mostrar las fotos guardadas en Supabase Storage
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: cabecerasSeguridad }];
  },
};

export default nextConfig;
