-- =============================================================
-- Catálogo de figuras: esquema de base de datos para Supabase
-- Ejecútalo una vez en Supabase > SQL Editor > New query > Run
-- =============================================================

-- 1. Tabla de productos
create table if not exists public.productos (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null check (char_length(nombre) between 1 and 120),
  descripcion  text,
  precio       integer not null check (precio >= 0),   -- en pesos chilenos, sin decimales
  categoria    text not null default 'Otros',
  imagen_url   text,
  disponible   boolean not null default true,          -- false = "Sin stock"
  destacado    boolean not null default false,
  creado_en    timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists productos_categoria_idx on public.productos (categoria);

-- Mantiene actualizado_en al editar
create or replace function public.tocar_actualizado_en()
returns trigger language plpgsql as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists productos_actualizado_en on public.productos;
create trigger productos_actualizado_en
  before update on public.productos
  for each row execute function public.tocar_actualizado_en();

-- 2. Seguridad (Row Level Security)
--    Cualquiera puede LEER productos; solo un usuario con sesión iniciada puede crear, editar o borrar.
alter table public.productos enable row level security;

drop policy if exists "Lectura pública de productos" on public.productos;
create policy "Lectura pública de productos"
  on public.productos for select
  using (true);

drop policy if exists "Administrador gestiona productos" on public.productos;
create policy "Administrador gestiona productos"
  on public.productos for all
  to authenticated
  using (true)
  with check (true);

-- 3. Almacenamiento de fotos (bucket público "productos")
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

drop policy if exists "Administrador sube fotos" on storage.objects;
create policy "Administrador sube fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'productos');

drop policy if exists "Administrador edita fotos" on storage.objects;
create policy "Administrador edita fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'productos');

drop policy if exists "Administrador borra fotos" on storage.objects;
create policy "Administrador borra fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'productos');

-- 4. Productos de ejemplo (puedes borrarlos después)
insert into public.productos (nombre, descripcion, precio, categoria, disponible, destacado) values
  ('Buda meditando',        'Figura decorativa de Buda en posición de meditación.', 0, 'Budas',     true,  true),
  ('Elefante de la suerte', 'Elefante con la trompa hacia arriba.',                 0, 'Elefantes', true,  true),
  ('Ganesha sentado',       'Figura de Ganesha.',                                   0, 'Ganesha',   true,  false),
  ('Pareja de elefantes',   'Dos elefantes decorativos.',                           0, 'Elefantes', false, false);
