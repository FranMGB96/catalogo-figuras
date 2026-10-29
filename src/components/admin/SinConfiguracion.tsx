/** Aviso que se muestra en el panel si Supabase todavía no está conectado. */
export function SinConfiguracion() {
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16">
      <h1 className="font-titulo text-2xl font-medium">Falta conectar Supabase</h1>
      <p className="text-texto-suave">
        El panel de administración necesita la base de datos. Completa{" "}
        <code className="rounded bg-tarjeta px-1.5 py-0.5 text-sm">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
        <code className="rounded bg-tarjeta px-1.5 py-0.5 text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en{" "}
        <code className="rounded bg-tarjeta px-1.5 py-0.5 text-sm">.env.local</code> y reinicia{" "}
        <code className="rounded bg-tarjeta px-1.5 py-0.5 text-sm">npm run dev</code>. Los pasos están en el README.
      </p>
    </main>
  );
}
