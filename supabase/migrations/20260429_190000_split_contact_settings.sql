begin;

-- 1) Tabel utama untuk data kontak tunggal / singleton.
create table if not exists public.contact_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null unique default 'main',
  whatsapp_number text,
  whatsapp_message_default text,
  phone_number text,
  email text,
  alamat text,
  jam_operasional text,
  maps_embed_url text,
  maps_link_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint contact_settings_singleton_key_check check (singleton_key = 'main')
);

comment on table public.contact_settings is 'Menyimpan data kontak tunggal situs seperti WhatsApp, telepon, email, alamat, jam kerja, dan peta.';
comment on column public.contact_settings.singleton_key is 'Dikunci ke nilai main agar hanya ada satu record kontak utama.';
comment on column public.contact_settings.whatsapp_number is 'Nomor WhatsApp utama yang dipakai seluruh CTA konsultasi.';
comment on column public.contact_settings.whatsapp_message_default is 'Pesan default untuk tombol konsultasi WhatsApp.';
comment on column public.contact_settings.maps_embed_url is 'URL Google Maps untuk iframe embed.';
comment on column public.contact_settings.maps_link_url is 'URL Google Maps biasa untuk tombol buka peta.';

-- 2) Master dropdown platform media sosial.
create table if not exists public.social_platforms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  nama text not null,
  icon_key text not null,
  placeholder_url text,
  nomor_urut integer not null default 0,
  aktif boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint social_platforms_code_lower_check check (code = lower(code))
);

comment on table public.social_platforms is 'Master data platform media sosial untuk dropdown admin.';
comment on column public.social_platforms.code is 'Kode stabil internal, mis. instagram, facebook, x, youtube.';
comment on column public.social_platforms.icon_key is 'Kunci ikon yang nanti dipetakan di frontend.';

-- 3) Link media sosial yang bisa banyak, termasuk platform yang sama lebih dari satu kali.
create table if not exists public.contact_social_links (
  id uuid primary key default gen_random_uuid(),
  contact_settings_id uuid not null references public.contact_settings(id) on delete cascade,
  platform_id uuid not null references public.social_platforms(id) on delete restrict,
  url text not null,
  nomor_urut integer not null default 0,
  aktif boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint contact_social_links_unique_url unique (contact_settings_id, platform_id, url)
);

create index if not exists idx_contact_social_links_contact_order
  on public.contact_social_links (contact_settings_id, nomor_urut, created_at);

create index if not exists idx_contact_social_links_platform
  on public.contact_social_links (platform_id);

comment on table public.contact_social_links is 'Menyimpan link media sosial terhubung ke contact_settings. Platform boleh berulang, misalnya dua Facebook.';

-- 4) Seed master platform populer untuk dropdown.
insert into public.social_platforms (
  code,
  nama,
  icon_key,
  placeholder_url,
  nomor_urut,
  aktif
)
values
  ('instagram', 'Instagram', 'instagram', 'https://instagram.com/namaakun', 1, true),
  ('facebook', 'Facebook', 'facebook', 'https://facebook.com/namahalaman', 2, true),
  ('x', 'X', 'x', 'https://x.com/namaakun', 3, true),
  ('youtube', 'YouTube', 'youtube', 'https://youtube.com/@namachannel', 4, true),
  ('linkedin', 'LinkedIn', 'linkedin', 'https://linkedin.com/company/namaperusahaan', 5, true),
  ('tiktok', 'TikTok', 'tiktok', 'https://tiktok.com/@namaakun', 6, true),
  ('threads', 'Threads', 'threads', 'https://threads.net/@namaakun', 7, true),
  ('telegram', 'Telegram', 'telegram', 'https://t.me/namaakun', 8, true)
on conflict (code) do update
set
  nama = excluded.nama,
  icon_key = excluded.icon_key,
  placeholder_url = excluded.placeholder_url,
  nomor_urut = excluded.nomor_urut,
  aktif = excluded.aktif,
  updated_at = now();

-- 5) Migrasi data tunggal dari site_settings ke contact_settings.
with source_settings as (
  select
    max(value) filter (where key = 'whatsapp_number') as whatsapp_number,
    max(value) filter (where key = 'whatsapp_message_default') as whatsapp_message_default,
    max(value) filter (where key = 'phone_number') as phone_number,
    max(value) filter (where key = 'email') as email,
    max(value) filter (where key = 'alamat') as alamat,
    max(value) filter (where key = 'jam_operasional') as jam_operasional,
    max(value) filter (where key = 'maps_embed_url') as maps_embed_url
  from public.site_settings
)
insert into public.contact_settings (
  singleton_key,
  whatsapp_number,
  whatsapp_message_default,
  phone_number,
  email,
  alamat,
  jam_operasional,
  maps_embed_url
)
select
  'main',
  whatsapp_number,
  whatsapp_message_default,
  phone_number,
  email,
  alamat,
  jam_operasional,
  maps_embed_url
from source_settings
on conflict (singleton_key) do update
set
  whatsapp_number = coalesce(excluded.whatsapp_number, public.contact_settings.whatsapp_number),
  whatsapp_message_default = coalesce(excluded.whatsapp_message_default, public.contact_settings.whatsapp_message_default),
  phone_number = coalesce(excluded.phone_number, public.contact_settings.phone_number),
  email = coalesce(excluded.email, public.contact_settings.email),
  alamat = coalesce(excluded.alamat, public.contact_settings.alamat),
  jam_operasional = coalesce(excluded.jam_operasional, public.contact_settings.jam_operasional),
  maps_embed_url = coalesce(excluded.maps_embed_url, public.contact_settings.maps_embed_url),
  updated_at = now();

-- 6) Migrasi link sosial lama dari site_settings ke tabel baru.
with main_contact as (
  select id
  from public.contact_settings
  where singleton_key = 'main'
),
raw_social_links as (
  select 'instagram'::text as code, value as url, 1 as nomor_urut
  from public.site_settings
  where key = 'instagram_url'

  union all

  select 'facebook'::text as code, value as url, 2 as nomor_urut
  from public.site_settings
  where key = 'facebook_url'

  union all

  select 'linkedin'::text as code, value as url, 3 as nomor_urut
  from public.site_settings
  where key = 'linkedin_url'
)
insert into public.contact_social_links (
  contact_settings_id,
  platform_id,
  url,
  nomor_urut,
  aktif
)
select
  main_contact.id,
  social_platforms.id,
  raw_social_links.url,
  raw_social_links.nomor_urut,
  true
from raw_social_links
join main_contact
  on true
join public.social_platforms
  on social_platforms.code = raw_social_links.code
where nullif(btrim(raw_social_links.url), '') is not null
on conflict (contact_settings_id, platform_id, url) do update
set
  nomor_urut = excluded.nomor_urut,
  aktif = excluded.aktif,
  updated_at = now();

-- 7) View bantu untuk kebutuhan query frontend/admin.
create or replace view public.contact_social_links_view as
select
  csl.id,
  csl.contact_settings_id,
  sp.code as platform_code,
  sp.nama as platform_nama,
  sp.icon_key,
  csl.url,
  csl.nomor_urut,
  csl.aktif,
  csl.created_at,
  csl.updated_at
from public.contact_social_links csl
join public.social_platforms sp
  on sp.id = csl.platform_id;

comment on view public.contact_social_links_view is 'View gabungan link sosial dengan metadata platform untuk memudahkan query frontend.';

-- 8) Opsional: jalankan BAGIAN INI SETELAH kode aplikasi selesai dipindah ke tabel baru.
-- delete from public.site_settings
-- where key in (
--   'whatsapp_number',
--   'whatsapp_message_default',
--   'phone_number',
--   'email',
--   'alamat',
--   'jam_operasional',
--   'maps_embed_url',
--   'instagram_url',
--   'facebook_url',
--   'linkedin_url'
-- );

commit;
