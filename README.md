# Catálogo Figuras

Catálogo web de figuras decorativas con consulta por WhatsApp.
Stack: **Next.js (React) + Tailwind CSS + Supabase**, pensado para publicarse en **Vercel**.

## 1. Correrlo en tu computador

Requisitos: Node.js 20 o superior.

```bash
npm install
cp .env.example .env.local   # en Windows: copy .env.example .env.local
npm run dev
```

Abre http://localhost:3000. Sin configurar Supabase, el sitio muestra 8 productos de ejemplo.

## 2. Conectar Supabase

1. Crea un proyecto gratis en https://supabase.com.
2. En **SQL Editor**, pega el contenido de `supabase/schema.sql` y ejecútalo.
   Crea la tabla `productos`, el bucket de fotos `productos`, las reglas de seguridad y 4 productos de ejemplo.
3. En **Project Settings → API**, copia la *Project URL* y la *anon public key* en `.env.local`.
4. Pon el número de WhatsApp en `NEXT_PUBLIC_WHATSAPP_NUMBER` (ej: `56912345678`).
5. Reinicia `npm run dev`.

**Seguridad:** cualquiera puede *ver* productos, pero solo un usuario con sesión puede crear, editar o borrar.
Por eso, en **Authentication → Sign In / Providers**, desactiva *Allow new users to sign up* y crea a mano
el único usuario administrador (tu familiar) en **Authentication → Users → Add user**.

## 3. Estructura

```
src/
  app/
    page.tsx                 Inicio: portada, catálogo, cómo comprar
    productos/[id]/page.tsx  Detalle de cada figura
    globals.css              Colores y fuentes (tokens del diseño)
  components/                Encabezado, Portada, Catalogo, TarjetaProducto, ...
  lib/
    productos.ts             Lectura de productos desde Supabase (o ejemplos)
    whatsapp.ts              Links wa.me con mensaje prellenado
    sitio.ts                 Nombre, ubicación, horario, Instagram
supabase/schema.sql          Base de datos, bucket y políticas
```

## 4. Cambiar el diseño

- **Colores:** `src/app/globals.css`, bloque `@theme`.
- **Nombre, ubicación, horario, Instagram:** `src/lib/sitio.ts`.
- **Logo y foto de portada:** hay espacios marcados con comentarios en `Encabezado.tsx` y `Portada.tsx`.

## 5. Publicar

Sube el proyecto a GitHub, impórtalo en https://vercel.com y agrega las mismas variables de `.env.local`
en *Settings → Environment Variables*.

## Próximo paso

Panel de administración (`/admin`) con inicio de sesión para agregar, editar y marcar productos sin stock.
