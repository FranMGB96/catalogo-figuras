import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite mostrar las fotos guardadas en Supabase Storage
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default nextConfig;
