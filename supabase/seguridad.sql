-- =============================================================
-- Refuerzo de seguridad. Ejecútalo DESPUÉS de schema.sql
-- (Supabase > SQL Editor > New query > Run). Se puede volver a ejecutar sin problema.
--
-- Antes de ejecutarlo, reemplaza el correo del paso 1 por el del administrador.
-- =============================================================

-- 1. Lista de administradores
--    Solo los correos de esta tabla pueden crear, editar o borrar productos y fotos.
create table if not exists public.administradores (
  email text primary key check (email = lower(email))
);

-- RLS activado y sin políticas = nadie puede leer ni modificar esta tabla desde el sitio.
-- Solo se administra desde el SQL Editor o el Table Editor de Supabase.
alter table public.administradores enable row level security;

insert into public.administradores (email)
values (lower('frangarciab.dev@gmail.com')) 
on conflict do nothing;

-- ¿El usuario con sesión iniciada es administrador?
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.administradores
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated;

-- 2. Productos: lectura pública, escritura solo para administradores
drop policy if exists "Administrador gestiona productos" on public.productos;
create policy "Administrador gestiona productos"
  on public.productos for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

-- 3. Fotos: solo administradores suben, editan o borran
drop policy if exists "Administrador sube fotos" on storage.objects;
create policy "Administrador sube fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'productos' and public.es_admin());

drop policy if exists "Administrador edita fotos" on storage.objects;
create policy "Administrador edita fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'productos' and public.es_admin());

drop policy if exists "Administrador borra fotos" on storage.objects;
create policy "Administrador borra fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'productos' and public.es_admin());

-- 4. El bucket solo acepta imágenes de hasta 5 MB
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png']
where id = 'productos';

-- Para agregar otro administrador más adelante:
--   insert into public.administradores (email) values (lower('otro@correo.com'));
