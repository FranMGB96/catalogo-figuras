import type { Metadata } from "next";
import { Nunito_Sans, Rubik } from "next/font/google";
import "./globals.css";
import { SITIO } from "@/lib/sitio";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-rubik",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: {
    default: `${SITIO.nombre} | Figuras decorativas`,
    template: `%s | ${SITIO.nombre}`,
  },
  description: SITIO.descripcion,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${rubik.variable} ${nunito.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
