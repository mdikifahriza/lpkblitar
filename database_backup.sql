-- ==========================================
-- 1. DDL: CREATE TABLES AND POLICIES
-- ==========================================

-- File: 20260429_190000_split_contact_settings.sql
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


-- File: 20260430_103000_create_page_visits.sql
begin;

create table if not exists public.page_visits (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  page_type text not null,
  page_slug text,
  session_id text not null,
  referrer text,
  visitor_hash text,
  metadata jsonb not null default '{}'::jsonb,
  visited_at timestamp with time zone not null default now(),
  constraint page_visits_path_not_blank check (char_length(btrim(path)) > 0),
  constraint page_visits_page_type_not_blank check (char_length(btrim(page_type)) > 0),
  constraint page_visits_session_id_not_blank check (char_length(btrim(session_id)) > 0)
);

create index if not exists idx_page_visits_path
  on public.page_visits (path);

create index if not exists idx_page_visits_page_type_slug
  on public.page_visits (page_type, page_slug);

create index if not exists idx_page_visits_session_id
  on public.page_visits (session_id);

create index if not exists idx_page_visits_visited_at
  on public.page_visits (visited_at desc);

comment on table public.page_visits is 'Menyimpan kunjungan halaman untuk analytics internal berbasis Supabase.';
comment on column public.page_visits.path is 'Path halaman yang dikunjungi, misalnya /, /kontak, /artikel/slug.';
comment on column public.page_visits.page_type is 'Kelompok halaman, misalnya home, article, service, contact, consultation.';
comment on column public.page_visits.page_slug is 'Slug halaman dinamis bila ada, misalnya slug artikel atau layanan.';
comment on column public.page_visits.session_id is 'ID sesi anonim untuk menghitung unique visit tanpa login.';
comment on column public.page_visits.referrer is 'Sumber rujukan bila tersedia.';
comment on column public.page_visits.visitor_hash is 'Hash identitas anonim opsional untuk deduplikasi tambahan.';
comment on column public.page_visits.metadata is 'Payload tambahan fleksibel seperti device, campaign, atau nama halaman.';

alter table public.page_visits enable row level security;

create policy "page_visits_no_public_access"
  on public.page_visits
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

comment on policy "page_visits_no_public_access"
  on public.page_visits
  is 'Tabel analytics dikunci dulu. Insert/select publik sebaiknya lewat server action atau route handler.';

commit;


-- File: 20260430_163000_create_galleries.sql
begin;

create table if not exists public.galleries (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  slug text not null unique,
  deskripsi text,
  kategori text not null check (
    kategori = any (
      array[
        'kegiatan-kantor'::text,
        'edukasi-hukum'::text,
        'media-liputan'::text,
        'penghargaan'::text,
        'dokumentasi-acara'::text
      ]
    )
  ),
  cover_url text,
  nomor_urut integer not null default 0,
  published boolean not null default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint galleries_judul_not_blank check (char_length(btrim(judul)) > 0),
  constraint galleries_slug_not_blank check (char_length(btrim(slug)) > 0)
);

create index if not exists idx_galleries_published_order
  on public.galleries (published, nomor_urut, published_at desc, created_at desc);

create index if not exists idx_galleries_kategori
  on public.galleries (kategori);

comment on table public.galleries is 'Album galeri publik untuk menampilkan dokumentasi kantor, edukasi, acara, dan media.';
comment on column public.galleries.cover_url is 'Cover album. Jika kosong, frontend bisa memakai foto featured atau foto pertama.';
comment on column public.galleries.nomor_urut is 'Urutan tampil album di panel admin dan halaman publik.';

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  image_url text not null,
  caption text,
  alt_text text,
  nomor_urut integer not null default 0,
  featured boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint gallery_items_image_url_not_blank check (char_length(btrim(image_url)) > 0)
);

create index if not exists idx_gallery_items_gallery_order
  on public.gallery_items (gallery_id, nomor_urut, created_at);

create unique index if not exists idx_gallery_items_one_featured_per_gallery
  on public.gallery_items (gallery_id)
  where featured = true;

comment on table public.gallery_items is 'Foto-foto milik satu album galeri.';
comment on column public.gallery_items.caption is 'Caption singkat yang tampil di halaman detail galeri.';
comment on column public.gallery_items.alt_text is 'Teks alternatif gambar untuk aksesibilitas dan SEO.';
comment on column public.gallery_items.featured is 'Menandai satu foto utama dalam album.';

commit;


-- File: 20260430_190000_unify_contact_number_to_whatsapp.sql
begin;

insert into public.site_settings (key, value, tipe, label)
select
  'whatsapp_number',
  legacy.value,
  'text',
  'Nomor WhatsApp'
from public.site_settings as legacy
where legacy.key = 'phone_number'
  and coalesce(nullif(legacy.value, ''), '') <> ''
  and not exists (
    select 1
    from public.site_settings as existing
    where existing.key = 'whatsapp_number'
  );

update public.site_settings as target
set value = source.value
from public.site_settings as source
where target.key = 'whatsapp_number'
  and source.key = 'phone_number'
  and coalesce(nullif(target.value, ''), '') = ''
  and coalesce(nullif(source.value, ''), '') <> '';

delete from public.site_settings
where key = 'phone_number';

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'contact_settings'
      and column_name = 'phone_number'
  ) then
    execute $sql$
      update public.contact_settings
      set whatsapp_number = phone_number
      where coalesce(nullif(whatsapp_number, ''), '') = ''
        and coalesce(nullif(phone_number, ''), '') <> ''
    $sql$;

    execute 'alter table public.contact_settings drop column phone_number';
  end if;
end
$$;

commit;


-- ==========================================
-- 2. DML: INSERT DATA
-- ==========================================

-- Data untuk tabel site_settings
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('f7c04e5d-7a8e-4ef3-9ed0-5af6e8f934e8', 'favicon_url', 'https://placehold.co/32x32/0d1117/c9a84c?text=H', 'image', 'Favicon', 'Ikon kecil di tab browser. Format ICO atau PNG 32x32', '2026-04-28T09:34:03.037406+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('a3100fb2-bdd6-4251-8a51-c189282e2072', 'hero_heading', 'Analisa Tajam. Tim Kuat. Sengketa Tuntas.', 'text', 'Heading Hero', 'Teks besar utama di section hero landing page', '2026-04-28T09:34:03.037406+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('7e3b0c50-1c05-4c64-be17-6fca033a4033', 'hero_subheading', 'Kantor konsultan hukum dan perlindungan konsumen di Blitar yang berfokus pada penyelesaian sengketa finance, perbankan, dan pengembangan usaha secara efektif.', 'text', 'Subheading Hero', 'Teks di bawah heading hero', '2026-04-28T09:34:03.037406+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('4983b37e-9fe7-441e-8d31-d61f85d912fb', 'hero_cta_primary', 'Konsultasi via WhatsApp', 'text', 'Teks Tombol Utama Hero', 'Tombol CTA pertama di hero', '2026-04-28T09:34:03.037406+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('a7d37a77-9f1f-4c38-9c33-223fc02e529c', 'hero_cta_secondary', 'Lihat Layanan', 'text', 'Teks Tombol Kedua Hero', 'Tombol CTA kedua di hero', '2026-04-28T09:34:03.037406+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('bf41acbc-8b14-464b-b045-6d1e68154896', 'hero_badge', 'Konsultan Hukum & Perlindungan Konsumen', 'text', 'Label Kecil Hero', 'Teks kecil uppercase di atas heading hero', '2026-04-28T09:34:03.037406+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('55a383e3-e678-43b2-bd79-4c2590bdc2be', 'logo_url', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/site-settings/logo-1777519381429.png', 'image', 'Logo Utama', 'Logo yang tampil di navbar. Rekomendasi ukuran 200x60px format PNG transparan', '2026-04-30T03:23:04.457+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('01da02dc-31ec-4407-a036-08096a257e72', 'site_name', 'Kantor Konsultan Hukum Hari Mulana Hutabarat, S.H., CPLA', 'text', 'Nama Kantor', 'Nama lengkap kantor yang tampil di footer dan metadata', '2026-04-28T09:34:03.037406+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('687e1cd7-074b-47e1-adf2-e019ecce09eb', 'site_description', 'Kantor konsultan hukum di Blitar yang berfokus pada sengketa finance, perlindungan konsumen, mediasi bisnis, dan pengembangan usaha.', 'text', 'Deskripsi Singkat', 'Dipakai di metadata global dan footer', '2026-04-28T09:34:03.037406+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('9a8dd185-7ee2-43a5-a437-f96ca9d0ea8f', 'og_image_default_url', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/site-settings/og-image-1777526772417.png', 'image', 'OG Image Default', 'Gambar preview default saat halaman dibagikan di WhatsApp atau media sosial. Ukuran 1200x630px', '2026-04-30T05:26:14.217+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('6ff3be00-c620-447d-8883-24a395bbedf6', 'tab_title_template', '%s | Hutabarat Law', 'text', 'Template Judul Tab', 'Format judul untuk halaman dalam. %s diganti nama halaman', '2026-04-30T05:26:18.76+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('1204c268-05cd-43ad-ae9f-b8054479b8a2', 'google_verification', '', 'text', 'Google Search Console Verification', 'Meta tag verifikasi dari Google Search Console', '2026-04-30T05:26:18.761+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('55336269-2dac-4369-9288-4aed6f2de714', 'tab_title', 'Hutabarat Law — Konsultan Hukum & Perlindungan Konsumen Blitar', 'text', 'Judul Tab Browser', 'Muncul di tab browser dan hasil pencarian Google', '2026-04-30T05:26:18.76+00:00');
INSERT INTO "public"."site_settings" ("id", "key", "value", "tipe", "label", "keterangan", "updated_at") VALUES ('bdc22450-fe2a-440b-b290-a835b7084bf8', 'hero_image_url', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/site-settings/hero-1777532185972.png', 'image', 'Foto Hero', 'Foto profesional yang tampil di sisi kanan hero', '2026-04-30T06:56:28.204+00:00');

-- Data untuk tabel contact_settings
INSERT INTO "public"."contact_settings" ("id", "singleton_key", "whatsapp_number", "whatsapp_message_default", "email", "alamat", "jam_operasional", "maps_embed_url", "maps_link_url", "created_at", "updated_at") VALUES ('1dd21af3-9947-4d2b-a15d-88d44ed28fa1', 'main', '085123759525', 'Halo Kantor Hukum dan LPK Blitar, saya ingin konsultasi mengenai masalah hukum saya.', 'info@hutabaratlawoffice.com', 'Jalan Menur RT 003 / RW 007, Desa Kaweron, Kecamatan Talun, Kabupaten Blitar, Jawa Timur', 'Senin - Jumat: 08.00 - 17.00 WIB', 'https://maps.google.com/maps?q=Blitar&output=embed', NULL, '2026-04-29T11:42:32.598282+00:00', '2026-04-29T11:42:32.598282+00:00');

-- Data untuk tabel services
INSERT INTO "public"."services" ("id", "nama", "slug", "kategori", "deskripsi_singkat", "deskripsi_lengkap", "nomor_urut", "aktif", "created_at") VALUES ('acb5b3b0-b172-4f70-bd49-d5314347be29', 'Gugatan Perbuatan Melawan Hukum', 'gugatan-pmh', 'litigasi', 'Penanganan gugatan atas tindakan sepihak, intimidasi, penarikan jaminan tanpa prosedur, dan kerugian akibat pelaku usaha.', 'Gugatan Perbuatan Melawan Hukum (PMH) digunakan apabila terdapat penarikan jaminan tanpa prosedur yang benar, intimidasi oleh debt collector, lelang yang cacat hukum, penagihan melampaui kewenangan, tindakan sepihak oleh pihak finance, atau kerugian konsumen akibat pelaku usaha. Kami menyusun gugatan secara sistematis, didukung analisa dokumen mendalam dan tim litigasi berpengalaman yang siap mendampingi hingga persidangan selesai.', 1, TRUE, '2026-04-28T09:05:33.522562+00:00');
INSERT INTO "public"."services" ("id", "nama", "slug", "kategori", "deskripsi_singkat", "deskripsi_lengkap", "nomor_urut", "aktif", "created_at") VALUES ('676f54e5-7f14-4c0d-8894-c679f864800e', 'Gugatan Wanprestasi', 'gugatan-wanprestasi', 'litigasi', 'Penanganan gugatan ingkar janji kontrak, ketidaksesuaian perjanjian, dan pelanggaran kewajiban oleh pelaku usaha.', 'Gugatan wanprestasi diajukan ketika terjadi ingkar janji kontrak, gagal serah terima objek perjanjian, ketidaksesuaian antara perjanjian tertulis dan pelaksanaan, pelanggaran jadwal pembayaran, atau ketidakpatuhan pelaku usaha terhadap kewajiban yang telah disepakati. Tim kami menganalisa perjanjian secara menyeluruh untuk membangun argumentasi hukum yang kuat bagi klien.', 2, TRUE, '2026-04-28T09:05:33.522562+00:00');
INSERT INTO "public"."services" ("id", "nama", "slug", "kategori", "deskripsi_singkat", "deskripsi_lengkap", "nomor_urut", "aktif", "created_at") VALUES ('6a3f26b7-952b-41d1-8f81-4f1b4f110365', 'Gugatan Ganti Kerugian', 'gugatan-ganti-kerugian', 'litigasi', 'Mewakili klien dalam gugatan atas kerugian materil, imateril, kehilangan aset, dan kehilangan peluang usaha.', 'Kami mewakili klien dalam gugatan ganti kerugian yang mencakup kerugian materil berupa nilai uang atau aset yang hilang, kerugian imateril berupa nama baik dan tekanan psikologis, kehilangan aset akibat tindakan pihak lain, serta kehilangan peluang usaha. Setiap gugatan didukung dengan perhitungan kerugian yang dapat dibuktikan secara hukum.', 3, TRUE, '2026-04-28T09:05:33.522562+00:00');
INSERT INTO "public"."services" ("id", "nama", "slug", "kategori", "deskripsi_singkat", "deskripsi_lengkap", "nomor_urut", "aktif", "created_at") VALUES ('fb29f5fc-352a-41b6-8b65-1f7e5a20a3d0', 'Bantahan & Perlawanan Eksekusi', 'bantahan-perlawanan-eksekusi', 'litigasi', 'Penanganan bantahan lelang, bantahan penyitaan, dan perlindungan atas objek jaminan dari eksekusi yang tidak sah.', 'Layanan ini mencakup bantahan terhadap proses lelang yang tidak sesuai prosedur KPKNL, bantahan penyitaan aset yang dilakukan tanpa dasar hukum yang kuat, dan perlindungan objek jaminan fidusia atau hak tanggungan dari eksekusi sepihak. Kami menganalisa legalitas setiap tahap eksekusi untuk menemukan celah hukum yang dapat digunakan sebagai dasar bantahan.', 4, TRUE, '2026-04-28T09:05:33.522562+00:00');
INSERT INTO "public"."services" ("id", "nama", "slug", "kategori", "deskripsi_singkat", "deskripsi_lengkap", "nomor_urut", "aktif", "created_at") VALUES ('3e55ad35-d70d-4c59-8884-2c7e7b54756e', 'Analisa Lelang, Cessie & Hak Tanggungan', 'analisa-lelang-cessie-hak-tanggungan', 'non-litigasi', 'Analisa mendalam atas prosedur lelang KPKNL, keabsahan cessie, APHT, SKMHT, dan sertifikat hak tanggungan.', 'Keunggulan utama kantor kami adalah kemampuan deep legal document analysis — membaca dan membedah dokumen secara detail untuk menemukan celah hukum. Meliputi analisa prosedur KPKNL termasuk pemberitahuan lelang dan harga limit, analisa keabsahan pengalihan cessie dan hak tagih kreditur baru, serta analisa APHT, SKMHT, dan sertifikat hak tanggungan secara menyeluruh.', 5, TRUE, '2026-04-28T09:05:33.522562+00:00');
INSERT INTO "public"."services" ("id", "nama", "slug", "kategori", "deskripsi_singkat", "deskripsi_lengkap", "nomor_urut", "aktif", "created_at") VALUES ('9b2c5d67-11eb-4c43-9f1f-a7824678e292', 'Mediasi & Negosiasi Bisnis', 'mediasi-negosiasi-bisnis', 'non-litigasi', 'Penyelesaian sengketa melalui somasi terukur, mediasi tertutup, restrukturisasi, dan settlement agreement.', 'Tidak semua perkara harus berujung sidang panjang. Melalui pengalaman, jaringan, dan legal pressure yang kuat, banyak perkara justru dapat diselesaikan melalui somasi terukur, mediasi tertutup, pressure legal document, negosiasi hutang, settlement agreement, dan kesepakatan damai yang menguntungkan. Prinsip kami: cepat dianalisa, tepat ditekan, singkat diselesaikan.', 6, TRUE, '2026-04-28T09:05:33.522562+00:00');
INSERT INTO "public"."services" ("id", "nama", "slug", "kategori", "deskripsi_singkat", "deskripsi_lengkap", "nomor_urut", "aktif", "created_at") VALUES ('4477068c-a103-41d6-b56b-c23099411270', 'Perlindungan Konsumen', 'perlindungan-konsumen', 'perlindungan-konsumen', 'Penanganan komplain konsumen, gugatan perlindungan konsumen, dan pendampingan ke OJK, BPSK, dan instansi terkait.', 'Dengan pengalaman aktif berdasarkan Undang-Undang Nomor 8 Tahun 1999 tentang Perlindungan Konsumen, kami menangani komplain konsumen secara sistematis, menyusun legal notice dan pengaduan ke OJK, BPSK, Dinas Koperasi, Satgas Waspada Investasi, dan Disperindag. Kami juga memahami cara mitigasi gugatan konsumen dari sisi pelaku usaha.', 7, TRUE, '2026-04-28T09:05:33.522562+00:00');
INSERT INTO "public"."services" ("id", "nama", "slug", "kategori", "deskripsi_singkat", "deskripsi_lengkap", "nomor_urut", "aktif", "created_at") VALUES ('93c8d289-8b59-4f17-b734-159eb635ced9', 'Konsultasi Pengembangan Usaha', 'konsultasi-pengembangan-usaha', 'konsultasi-usaha', 'Membantu pelaku usaha restoran, kafe, wisata, dan retail membangun sistem usaha yang aman secara hukum dan minim konflik.', 'Bagi dunia usaha modern, masalah terbesar bukan hanya penjualan, tetapi komplain pelanggan, legalitas transaksi, refund, keamanan pelayanan, gugatan konsumen, reputasi bisnis, dan kebocoran manajemen. Kami membantu menyusun SOP customer complaint, sistem disclaimer, keamanan transaksi, retur barang, dan syarat promo yang aman secara hukum — sehingga usaha Anda berkembang, dipercaya, dan berjaya.', 8, TRUE, '2026-04-28T09:05:33.522562+00:00');

-- Data untuk tabel team_members
INSERT INTO "public"."team_members" ("id", "nama", "jabatan", "spesialisasi", "bio", "foto_url", "is_pimpinan", "nomor_urut", "aktif") VALUES ('9aec5123-4672-4ab3-bbed-230ec7b21dfc', 'Hari Mulana Hutabarat, S.H., CPLA', 'Pimpinan Kantor', 'Finance & Perbankan, Perlindungan Konsumen, Sengketa Bisnis, Negosiasi', 'Hari Mulana Hutabarat, S.H., CPLA adalah seorang praktisi hukum, konsultan finance dan perbankan, negosiator penyelesaian sengketa bisnis, serta konsultan perlindungan konsumen. Beliau memimpin kantor konsultan hukum yang berfokus pada penyelesaian sengketa finance, gugatan perdata, perlindungan konsumen, mediasi dan negosiasi bisnis, serta pengembangan sistem usaha yang aman secara hukum. Di bawah kepemimpinannya, kantor ini dibangun dengan prinsip ketajaman analisa hukum, kekuatan tim, penyelesaian efektif, dan orientasi hasil nyata bagi klien.', 'https://placehold.co/400x500/0d1117/c9a84c?text=HMH', TRUE, 1, TRUE);
INSERT INTO "public"."team_members" ("id", "nama", "jabatan", "spesialisasi", "bio", "foto_url", "is_pimpinan", "nomor_urut", "aktif") VALUES ('8b9edb23-7482-4b8a-9a98-5d9388643c43', 'Team Lawyer Litigasi', 'Divisi Persidangan', 'PMH, Wanprestasi, Bantahan Lelang', 'Menangani proses Gugatan Perbuatan Melawan Hukum (PMH), Wanprestasi, Ganti Rugi, Pembatalan Perjanjian, Bantahan dan Perlawanan Lelang, Gugatan Objek Jaminan Fidusia, Pembatalan Cessie, Permohonan sita jaminan, sampai dengan pendampingan persidangan.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/team/team-f2e3cdeb-3915-48ea-ac47-d2d8a72b0a98.jpeg', FALSE, 2, TRUE);
INSERT INTO "public"."team_members" ("id", "nama", "jabatan", "spesialisasi", "bio", "foto_url", "is_pimpinan", "nomor_urut", "aktif") VALUES ('52b9206c-1a16-4299-8e42-49a9fc332b6c', 'Team Non Litigasi dan Negosiasi', 'Penyelesaian Luar Pengadilan', 'Somasi, Mediasi, Restrukturisasi', 'Bekerja secara persuasif untuk menangani somasi, mediasi, restrukturisasi, legal settlement, perdamaian kreditur dan debitur, penyelesaian komplain konsumen, serta penyusunan legal notice.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/team/team-c2f79721-2dfa-43b7-85d8-008c845459e9.jpeg', FALSE, 3, TRUE);
INSERT INTO "public"."team_members" ("id", "nama", "jabatan", "spesialisasi", "bio", "foto_url", "is_pimpinan", "nomor_urut", "aktif") VALUES ('aee5c060-9bde-4960-8a15-ae90a215d2c7', 'Team Analisa Dokumen & Pembuktian', 'Kajian Dokumen Hukum', 'Perjanjian Kredit, APHT, Fidusia', 'Mengkaji secara mendalam perjanjian kredit, akta pembiayaan, APHT/SKMHT, cessie, fidusia, surat penagihan, berita acara penarikan, dokumen lelang, bukti wanprestasi, dan legal standing lawan.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/team/team-6673c342-a0c1-414d-a7df-eeb91c4dbb70.jpeg', FALSE, 4, TRUE);
INSERT INTO "public"."team_members" ("id", "nama", "jabatan", "spesialisasi", "bio", "foto_url", "is_pimpinan", "nomor_urut", "aktif") VALUES ('ac9f545a-1f78-47a7-aed0-667475be55bb', 'Team Pengaduan Instansi', 'Pidana & Administratif', 'Kepolisian, OJK, BPSK', 'Mengkaji unsur pidana serta langkah administratif ke berbagai instansi berwenang seperti Kepolisian, OJK, BPSK, Dinas Koperasi, Satgas Waspada Investasi, Disperindag, dan instansi perlindungan konsumen.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/team/team-9a370b29-c14d-4897-accf-51fda1f6f606.jpeg', FALSE, 5, TRUE);

-- Data untuk tabel testimonials
INSERT INTO "public"."testimonials" ("id", "nama_klien", "isi", "layanan_id", "ditampilkan", "created_at") VALUES ('c86032b2-8a66-406e-a06b-87edf47d340a', 'B.S. — Nasabah Leasing, Blitar', 'Awalnya saya sudah pasrah karena kendaraan sudah ditarik tanpa pemberitahuan yang jelas. Setelah konsultasi dengan Pak Hari, ternyata ada pelanggaran prosedur yang bisa dipermasalahkan. Alhamdulillah masalah selesai tanpa harus ke sidang panjang.', NULL, TRUE, '2026-04-28T09:06:00.115147+00:00');
INSERT INTO "public"."testimonials" ("id", "nama_klien", "isi", "layanan_id", "ditampilkan", "created_at") VALUES ('4093b899-b2d1-4b58-8390-8e509590e0c7', 'P.W. — Pelaku Usaha, Tulungagung', 'Saya punya masalah dengan mitra bisnis yang ingkar janji kontrak. Kantor ini membantu dari analisa dokumen sampai negosiasi. Hasilnya memuaskan dan prosesnya tidak berlarut-larut seperti yang saya bayangkan.', NULL, TRUE, '2026-04-28T09:06:00.115147+00:00');
INSERT INTO "public"."testimonials" ("id", "nama_klien", "isi", "layanan_id", "ditampilkan", "created_at") VALUES ('2f53ac0d-db8c-47ed-9ba2-b93f7f857c1a', 'R.H. — Pemilik Kafe, Kediri', 'Sebagai pemilik usaha kafe, saya sering dapat komplain pelanggan yang tidak tahu mau saya hadapi seperti apa. Pak Hari membantu saya menyusun SOP komplain dan aturan yang aman secara hukum. Sekarang usaha saya lebih terlindungi.', NULL, TRUE, '2026-04-28T09:06:00.115147+00:00');
INSERT INTO "public"."testimonials" ("id", "nama_klien", "isi", "layanan_id", "ditampilkan", "created_at") VALUES ('d9a1568f-f612-4ae9-b7a5-7b86106aeb86', 'A.N. — Debitur Finance, Blitar', 'Saya mendapat surat penagihan yang isinya mengancam dan tidak sesuai dengan perjanjian awal. Tim kantor ini menganalisa dokumen saya dan membantu menyusun somasi balik yang tepat. Penagihan yang tidak wajar akhirnya berhenti.', NULL, TRUE, '2026-04-28T09:06:00.115147+00:00');
INSERT INTO "public"."testimonials" ("id", "nama_klien", "isi", "layanan_id", "ditampilkan", "created_at") VALUES ('086c4358-4639-4497-8f45-da80cd37b3a0', 'D.K. — Pengusaha Retail, Malang', 'Sangat profesional dan responsif. Analisa hukumnya tajam dan penjelasannya mudah dipahami meskipun saya bukan orang hukum. Rekomendasi untuk siapapun yang punya masalah sengketa bisnis.', NULL, TRUE, '2026-04-28T09:06:00.115147+00:00');
INSERT INTO "public"."testimonials" ("id", "nama_klien", "isi", "layanan_id", "ditampilkan", "created_at") VALUES ('bc430c1f-00c8-4eba-91fd-e815f051d620', 'B.S. — Nasabah Leasing, Blitar', 'Awalnya saya sudah pasrah karena kendaraan sudah ditarik tanpa pemberitahuan yang jelas. Setelah konsultasi dengan Pak Hari, ternyata ada pelanggaran prosedur yang bisa dipermasalahkan. Alhamdulillah masalah selesai tanpa harus ke sidang panjang.', NULL, TRUE, '2026-04-28T09:06:06.329937+00:00');
INSERT INTO "public"."testimonials" ("id", "nama_klien", "isi", "layanan_id", "ditampilkan", "created_at") VALUES ('a7746630-deba-4a67-a508-6a8b589909f9', 'P.W. — Pelaku Usaha, Tulungagung', 'Saya punya masalah dengan mitra bisnis yang ingkar janji kontrak. Kantor ini membantu dari analisa dokumen sampai negosiasi. Hasilnya memuaskan dan prosesnya tidak berlarut-larut seperti yang saya bayangkan.', NULL, TRUE, '2026-04-28T09:06:06.329937+00:00');
INSERT INTO "public"."testimonials" ("id", "nama_klien", "isi", "layanan_id", "ditampilkan", "created_at") VALUES ('700cb441-ca67-4576-b8a5-d1a9998f31bf', 'R.H. — Pemilik Kafe, Kediri', 'Sebagai pemilik usaha kafe, saya sering dapat komplain pelanggan yang tidak tahu mau saya hadapi seperti apa. Pak Hari membantu saya menyusun SOP komplain dan aturan yang aman secara hukum. Sekarang usaha saya lebih terlindungi.', NULL, TRUE, '2026-04-28T09:06:06.329937+00:00');
INSERT INTO "public"."testimonials" ("id", "nama_klien", "isi", "layanan_id", "ditampilkan", "created_at") VALUES ('f40442b1-4423-4d93-bf52-a5471e90d5c9', 'A.N. — Debitur Finance, Blitar', 'Saya mendapat surat penagihan yang isinya mengancam dan tidak sesuai dengan perjanjian awal. Tim kantor ini menganalisa dokumen saya dan membantu menyusun somasi balik yang tepat. Penagihan yang tidak wajar akhirnya berhenti.', NULL, TRUE, '2026-04-28T09:06:06.329937+00:00');
INSERT INTO "public"."testimonials" ("id", "nama_klien", "isi", "layanan_id", "ditampilkan", "created_at") VALUES ('9759782f-4830-49ad-87c6-dd2f72f133f7', 'D.K. — Pengusaha Retail, Malang', 'Sangat profesional dan responsif. Analisa hukumnya tajam dan penjelasannya mudah dipahami meskipun saya bukan orang hukum. Rekomendasi untuk siapapun yang punya masalah sengketa bisnis.', NULL, TRUE, '2026-04-28T09:06:06.329937+00:00');

-- Data untuk tabel faqs
INSERT INTO "public"."faqs" ("id", "pertanyaan", "jawaban", "layanan_id", "nomor_urut", "aktif") VALUES ('4722f770-6fb1-4205-9cc2-be98518bc67b', 'Berapa biaya konsultasi awal?', 'Konsultasi awal dapat dilakukan via WhatsApp untuk menjelaskan gambaran umum masalah Anda. Biaya penanganan perkara akan diinformasikan setelah kami memahami detail masalah dan dokumen yang ada. Kami percaya setiap klien berhak mendapat gambaran biaya yang jelas sebelum memutuskan.', NULL, 1, TRUE);
INSERT INTO "public"."faqs" ("id", "pertanyaan", "jawaban", "layanan_id", "nomor_urut", "aktif") VALUES ('02feff9a-55dd-4c46-8ac8-d1902e650156', 'Apakah masalah saya harus langsung dibawa ke pengadilan?', 'Tidak selalu. Filosofi kami adalah mengutamakan penyelesaian yang efektif dan efisien. Banyak perkara yang dapat selesai melalui somasi terukur, mediasi tertutup, atau negosiasi tanpa harus melalui sidang panjang yang menguras waktu dan biaya. Kami akan merekomendasikan jalur terbaik setelah menganalisa situasi Anda.', NULL, 2, TRUE);
INSERT INTO "public"."faqs" ("id", "pertanyaan", "jawaban", "layanan_id", "nomor_urut", "aktif") VALUES ('7260a78a-2881-40a0-89b5-a973b7ff9e21', 'Wilayah mana saja yang dilayani?', 'Kantor kami berkedudukan di Kabupaten Blitar dan melayani klien dari wilayah Blitar Kota, Blitar Kabupaten, Tulungagung, Kediri, Malang, dan sekitarnya. Untuk konsultasi awal, kami dapat melayani via WhatsApp atau pertemuan online terlebih dahulu.', NULL, 3, TRUE);
INSERT INTO "public"."faqs" ("id", "pertanyaan", "jawaban", "layanan_id", "nomor_urut", "aktif") VALUES ('2cfa2bbb-6c58-49bf-9247-c706563669a7', 'Dokumen apa yang perlu saya siapkan untuk konsultasi?', 'Siapkan dokumen yang berkaitan langsung dengan masalah Anda, misalnya: perjanjian kredit atau kontrak, surat penagihan, berita acara, akta pembiayaan, atau bukti korespondensi. Tidak perlu khawatir jika dokumen belum lengkap — kami akan membantu mengidentifikasi dokumen apa yang dibutuhkan.', NULL, 4, TRUE);
INSERT INTO "public"."faqs" ("id", "pertanyaan", "jawaban", "layanan_id", "nomor_urut", "aktif") VALUES ('e414427f-f3f9-4735-8b1a-499974fe8dd5', 'Berapa lama proses penyelesaian perkara?', 'Durasi sangat bergantung pada jenis dan kompleksitas perkara. Penyelesaian melalui mediasi dan negosiasi umumnya lebih cepat dibanding litigasi. Setelah analisa dokumen, kami akan memberikan estimasi waktu yang realistis agar Anda dapat mempersiapkan diri dengan baik.', NULL, 5, TRUE);
INSERT INTO "public"."faqs" ("id", "pertanyaan", "jawaban", "layanan_id", "nomor_urut", "aktif") VALUES ('34cc41fe-a679-46e2-a933-f84e4efa2157', 'Apakah kerahasiaan masalah saya terjamin?', 'Absolut. Seluruh informasi yang Anda sampaikan kepada kami tunduk pada prinsip kerahasiaan profesional yang wajib kami jaga. Tidak ada informasi klien yang akan dibagikan kepada pihak manapun tanpa izin Anda.', NULL, 6, TRUE);

-- Data untuk tabel articles
INSERT INTO "public"."articles" ("id", "judul", "slug", "konten", "thumbnail_url", "kategori", "estimasi_baca", "published", "published_at", "created_at") VALUES ('1397a689-08f0-44db-9bb9-583d5218205f', 'Profil Pimpinan dan Kantor Konsultan Hukum', 'profil-pimpinan-konsultan-hukum-finance', 'Hari Mulana Hutabarat, S.H., CPLA adalah seorang praktisi hukum, konsultan finance/perbankan, negosiator penyelesaian sengketa bisnis, serta konsultan perlindungan konsumen. Berkedudukan di Desa Kaweron, Kecamatan Talun, Kabupaten Blitar, kantor ini hadir sebagai pusat layanan hukum terpadu yang berfokus pada penyelesaian sengketa finance, perlindungan konsumen, mediasi bisnis, hingga analisa aset jaminan. Kami dibangun dengan prinsip ketajaman analisa hukum, kekuatan tim, penyelesaian efektif, dan orientasi hasil nyata bagi klien.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/articles/079fb67f-557c-4047-9d95-5a6520e67008.jpeg', 'konsultasi-usaha', 4, TRUE, '2026-04-30T08:19:30.546+00:00', '2026-04-28T09:06:17.582519+00:00');
INSERT INTO "public"."articles" ("id", "judul", "slug", "konten", "thumbnail_url", "kategori", "estimasi_baca", "published", "published_at", "created_at") VALUES ('ac113ca8-f61c-44c0-87d9-eb87a4da24dc', 'Gugatan Perbuatan Melawan Hukum (PMH)', 'gugatan-perbuatan-melawan-hukum-pmh', 'Gugatan PMH sering digunakan apabila terdapat penarikan jaminan tanpa prosedur yang jelas, intimidasi oleh debt collector, proses lelang cacat hukum, penagihan yang melampaui kewenangan, hingga tindakan sepihak dari pihak finance. Kami memiliki pengalaman tinggi di lembaga perlindungan konsumen dalam mewakili klien untuk menuntut hak-haknya atas kerugian materil maupun immateril.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/articles/964ffea7-02cb-49a4-b601-f63ddc277741.jpeg', 'panduan-hukum', 5, TRUE, '2026-04-30T08:19:03.529+00:00', '2026-04-28T09:06:17.582519+00:00');
INSERT INTO "public"."articles" ("id", "judul", "slug", "konten", "thumbnail_url", "kategori", "estimasi_baca", "published", "published_at", "created_at") VALUES ('ac429cdf-2477-42a2-8859-8a53f87318bb', 'Pentingnya Legal Criminal Assessment Sebelum Melapor ke Polisi', 'legal-criminal-assessment-laporan-kepolisian', 'Tidak semua sengketa harus langsung dibawa ke proses pidana. Karena itu, kantor kami memiliki sistem ''Legal Criminal Assessment'', yaitu menganalisa secara mendalam apakah unsur penipuan terpenuhi, ada tidaknya penggelapan atau pemalsuan dokumen, serta mengevaluasi unsur pemerasan dan pelanggaran pidana perlindungan konsumen. Laporan kepolisian hanya dilakukan apabila secara yuridis alat buktinya kuat dan langkah tersebut memberi tekanan strategis bagi penyelesaian.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/articles/57e794d5-79b5-48ba-9391-a2e864f2925c.jpeg', 'sengketa-bisnis', 6, TRUE, '2026-04-30T08:19:03.529+00:00', '2026-04-28T09:06:17.582519+00:00');
INSERT INTO "public"."articles" ("id", "judul", "slug", "konten", "thumbnail_url", "kategori", "estimasi_baca", "published", "published_at", "created_at") VALUES ('47d09199-a6c6-499e-b0b3-68969784d084', 'Analisa Mendalam Lelang, Cessie, Hak Tanggungan dan Fidusia', 'analisa-lelang-cessie-hak-tanggungan', 'Salah satu keunggulan utama Hari Mulana Hutabarat, S.H., CPLA adalah kemampuan ''Deep Legal Document Analysis''. Kami membaca dan membedah dokumen secara mendetail untuk menemukan celah hukum. Ini meliputi analisa lelang (prosedur KPKNL, harga limit), analisa cessie (keabsahan pengalihan, hak tagih kreditur baru), hak tanggungan (APHT, SKMHT), hingga analisa objek jaminan fidusia.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/articles/7ec9f674-ad1a-4d6d-afc2-5de4aedecf6e.jpeg', 'finance-perbankan', 6, TRUE, '2026-04-30T08:19:03.529+00:00', '2026-04-28T09:06:17.582519+00:00');
INSERT INTO "public"."articles" ("id", "judul", "slug", "konten", "thumbnail_url", "kategori", "estimasi_baca", "published", "published_at", "created_at") VALUES ('b5bc5c5b-be41-4a16-9a98-74123ad3ddf7', 'Penyelesaian Sengketa Bisnis Tanpa Proses Sidang yang Panjang', 'penyelesaian-sengketa-tanpa-proses-panjang', 'Filosofi kantor kami sangat jelas: tidak semua perkara harus berujung pada sidang panjang yang menghabiskan biaya besar dan energi. Melalui pengalaman, jaringan, ''legal pressure'', serta negosiasi yang kuat, banyak perkara dapat selesai melalui somasi terukur, mediasi tertutup, negosiasi hutang, dan ''settlement agreement''. Prinsip kami: Cepat dianalisa, tepat ditekan, singkat diselesaikan.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/articles/124623f1-2317-4c18-be1e-4e845c5a27a5.jpeg', 'sengketa-bisnis', 4, TRUE, '2026-04-30T08:19:03.529+00:00', '2026-04-28T09:06:17.582519+00:00');
INSERT INTO "public"."articles" ("id", "judul", "slug", "konten", "thumbnail_url", "kategori", "estimasi_baca", "published", "published_at", "created_at") VALUES ('3f6c079d-c324-4aba-a38c-3315358e0e89', 'Konsultan Pelaku Usaha: Restoran, Cafe, Wisata, dan Retail', 'konsultan-pelaku-usaha-restoran-retail', 'Bagi dunia usaha modern, masalah terbesar bukan hanya penjualan, tetapi komplain pelanggan, legalitas transaksi, keamanan pelayanan, hingga reputasi bisnis. Hari Mulana Hutabarat sangat tepat menjadi ''Legal Business Consultant'' Anda. Kami membantu menyusun SOP komplain pelanggan yang aman secara hukum, memitigasi klaim pengunjung, mengatur sistem disclaimer untuk pariwisata, hingga menangani retur barang di toko modern.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/articles/ba4b7fd3-03d7-4b91-b778-399ea2fc7f32.jpeg', 'konsultasi-usaha', 7, TRUE, '2026-04-30T08:19:03.529+00:00', '2026-04-30T08:19:04.864682+00:00');
INSERT INTO "public"."articles" ("id", "judul", "slug", "konten", "thumbnail_url", "kategori", "estimasi_baca", "published", "published_at", "created_at") VALUES ('6f2493db-86e8-4e62-bf9c-c6082f0ec647', 'Menghadapi Gugatan Wanprestasi dan Ganti Kerugian', 'menghadapi-gugatan-wanprestasi', 'Tim lawyer litigasi kami siap menangani proses gugatan wanprestasi yang mencakup ingkar janji kontrak, gagal serah terima objek perjanjian, ketidaksesuaian perjanjian, maupun pelanggaran pembayaran. Kami mewakili klien untuk menuntut ganti kerugian, baik kerugian materil, immateril, kehilangan aset, maupun hilangnya peluang usaha yang seharusnya menjadi hak Anda.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/articles/532ace52-74a2-4b53-80c1-be8d9cd511ca.jpeg', 'panduan-hukum', 5, TRUE, '2026-04-30T08:19:03.529+00:00', '2026-04-30T08:19:05.03086+00:00');
INSERT INTO "public"."articles" ("id", "judul", "slug", "konten", "thumbnail_url", "kategori", "estimasi_baca", "published", "published_at", "created_at") VALUES ('fb188612-a765-4eb1-b3a1-4b889ef6512f', 'Perlindungan Konsumen: Hak Anda Menghadapi Leasing', 'perlindungan-konsumen-menghadapi-leasing', 'Dengan pengalaman aktif di dunia perlindungan konsumen berdasarkan UU No. 8 Tahun 1999, kami memahami secara mendalam hak dan kewajiban Anda. Jika terjadi masalah dengan pelaku usaha atau leasing yang menekan secara sepihak, kami siap mendampingi untuk memastikan tidak ada klausula baku yang memberatkan Anda serta menyelesaikan konflik secara aman.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/articles/7bda4de3-b986-4a25-96c4-ff99b7d5b064.jpeg', 'perlindungan-konsumen', 5, TRUE, '2026-04-30T08:19:03.529+00:00', '2026-04-30T08:19:05.174008+00:00');
INSERT INTO "public"."articles" ("id", "judul", "slug", "konten", "thumbnail_url", "kategori", "estimasi_baca", "published", "published_at", "created_at") VALUES ('3c46c511-ebb2-4fae-8f6d-4ea3411c5948', 'Bantahan dan Perlawanan Eksekusi Objek Jaminan', 'bantahan-perlawanan-eksekusi-jaminan', 'Ketika aset atau jaminan Anda akan disita atau dilelang, tidak berarti semua sudah berakhir. Kami memiliki tim yang ahli dalam melakukan bantahan lelang, bantahan penyitaan, dan perlindungan hukum atas objek jaminan. Kami akan menginvestigasi prosedur KPKNL dan memastikan seluruh legalitas eksekusi berjalan sesuai dengan perundang-undangan.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/articles/964ffea7-02cb-49a4-b601-f63ddc277741.jpeg', 'finance-perbankan', 6, TRUE, '2026-04-30T08:19:03.529+00:00', '2026-04-30T08:19:05.309971+00:00');
INSERT INTO "public"."articles" ("id", "judul", "slug", "konten", "thumbnail_url", "kategori", "estimasi_baca", "published", "published_at", "created_at") VALUES ('3436d59b-0310-4063-8d35-cd3f721daffa', 'Pengembangan Usaha Secara Profesional dan Aman Hukum', 'pengembangan-usaha-profesional-aman-hukum', 'Kami tidak hanya menyelesaikan sengketa yang ada, tetapi juga berperan dalam membangun sistem usaha Anda agar minim masalah. Dengan pendampingan hukum yang tepat, Anda bisa meningkatkan kepercayaan pelanggan, menjaga nama baik (brand), dan menciptakan struktur usaha yang lebih profesional. Tujuannya agar usaha Anda semakin berkembang, dipercaya, dan berjaya di tengah persaingan bisnis yang ketat.', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/articles/57e794d5-79b5-48ba-9391-a2e864f2925c.jpeg', 'konsultasi-usaha', 4, TRUE, '2026-04-30T08:19:03.529+00:00', '2026-04-30T08:19:05.450177+00:00');

-- Data untuk tabel galleries
INSERT INTO "public"."galleries" ("id", "judul", "slug", "deskripsi", "kategori", "cover_url", "nomor_urut", "published", "published_at", "created_at", "updated_at") VALUES ('c2850e9e-2d42-408a-a649-42822f4ee8f1', 'Dokumentasi', 'dokumentasi-1777536697863', 'Dokumentasi kegiatan LPK Blitar', 'kegiatan-kantor', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/galleries/dokumentasi-1777536697863/7800cfdb-33ef-450e-955f-b0266dc57d9b.jpeg', 1, TRUE, '2026-04-30T08:11:37.863+00:00', '2026-04-30T08:11:39.337908+00:00', '2026-04-30T08:11:40.273746+00:00');

-- Data untuk tabel gallery_items
INSERT INTO "public"."gallery_items" ("id", "gallery_id", "image_url", "caption", "alt_text", "nomor_urut", "featured", "created_at", "updated_at") VALUES ('4047dcb1-c1d3-41f1-88bf-974bff1d5788', 'c2850e9e-2d42-408a-a649-42822f4ee8f1', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/galleries/dokumentasi-1777536697863/7800cfdb-33ef-450e-955f-b0266dc57d9b.jpeg', 'foto bersama', 'foto bersama', 1, FALSE, '2026-04-30T08:11:40.69728+00:00', '2026-04-30T08:11:40.69728+00:00');
INSERT INTO "public"."gallery_items" ("id", "gallery_id", "image_url", "caption", "alt_text", "nomor_urut", "featured", "created_at", "updated_at") VALUES ('8fa691de-3726-457c-998d-491247e0671d', 'c2850e9e-2d42-408a-a649-42822f4ee8f1', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/galleries/dokumentasi-1777536697863/37dbcea0-90b1-45fe-89f0-795d31b3e51a.jpeg', 'mencermati dokumen', 'mencermati dokumen', 3, FALSE, '2026-04-30T08:11:42.097891+00:00', '2026-04-30T08:11:42.097891+00:00');
INSERT INTO "public"."gallery_items" ("id", "gallery_id", "image_url", "caption", "alt_text", "nomor_urut", "featured", "created_at", "updated_at") VALUES ('91479bd5-05a9-4330-89bb-e2a01b222941', 'c2850e9e-2d42-408a-a649-42822f4ee8f1', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/galleries/dokumentasi-1777536697863/a5793dc7-6450-4511-b2f6-dcad2c1ebb5f.jpeg', 'menunggi antrian panggilan', 'menunggi antrian panggilan', 4, FALSE, '2026-04-30T08:11:42.694141+00:00', '2026-04-30T08:11:42.694141+00:00');
INSERT INTO "public"."gallery_items" ("id", "gallery_id", "image_url", "caption", "alt_text", "nomor_urut", "featured", "created_at", "updated_at") VALUES ('84bcc0d2-2ad7-463b-ac4b-2a09cfcdd074', 'c2850e9e-2d42-408a-a649-42822f4ee8f1', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/galleries/dokumentasi-1777536697863/956c66a0-222d-4b88-b498-5d8131e2c764.jpeg', 'menunggu di ruang sidang', 'menunggu di ruang sidang', 5, FALSE, '2026-04-30T08:11:43.374912+00:00', '2026-04-30T08:11:43.374912+00:00');
INSERT INTO "public"."gallery_items" ("id", "gallery_id", "image_url", "caption", "alt_text", "nomor_urut", "featured", "created_at", "updated_at") VALUES ('dab1655c-bbd4-4ff1-85b2-94c3116d0391', 'c2850e9e-2d42-408a-a649-42822f4ee8f1', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/galleries/dokumentasi-1777536697863/28244865-bc97-441d-b019-25f582559067.jpeg', 'ngopi santai', 'ngopi santai', 6, FALSE, '2026-04-30T08:11:43.883097+00:00', '2026-04-30T08:11:43.883097+00:00');
INSERT INTO "public"."gallery_items" ("id", "gallery_id", "image_url", "caption", "alt_text", "nomor_urut", "featured", "created_at", "updated_at") VALUES ('aecdbb31-cf8d-47ef-aa4b-0dd56cf4d911', 'c2850e9e-2d42-408a-a649-42822f4ee8f1', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/galleries/dokumentasi-1777536697863/6829c7a3-b6f7-48d5-ac12-ddec29453abf.jpeg', 'penandatanganan dokumen', 'penandatanganan dokumen', 7, FALSE, '2026-04-30T08:11:44.374683+00:00', '2026-04-30T08:11:44.374683+00:00');
INSERT INTO "public"."gallery_items" ("id", "gallery_id", "image_url", "caption", "alt_text", "nomor_urut", "featured", "created_at", "updated_at") VALUES ('03473ae6-0362-4a31-aa5b-c74931eb9c0c', 'c2850e9e-2d42-408a-a649-42822f4ee8f1', 'https://zrywzjseqekljwaqfzqb.supabase.co/storage/v1/object/public/assets/galleries/dokumentasi-1777536697863/38a1c623-e3bb-487a-9ae2-355b7f60047b.jpeg', 'menangani kasus di jakarta selatan', 'menangani kasus di jakarta selatan', 2, FALSE, '2026-04-30T08:11:41.230877+00:00', '2026-04-30T08:37:40.860134+00:00');

-- Data untuk tabel inquiries
INSERT INTO "public"."inquiries" ("id", "nama", "no_hp", "email", "layanan_id", "pesan", "status", "catatan_internal", "created_at", "tempat_tinggal") VALUES ('afe41cc3-8b4b-4f2f-b529-8cc2dedc8e05', 'M. Diki Fahriza', '09989899898', 'mdikifahriza2@gmail.com', '3e55ad35-d70d-4c59-8884-2c7e7b54756e', 'Jenis Masalah: Sengketa Perbankan / Kredit
Kota: Kab. Blitar

Kronologi:
kljljlnkjkjnkjnjknjlkjsdklajsdklajdakljdklsjskdjskdjskdsdskdskdjskdskdjsknnv  fdfdkfjdfdkfdkfdfkdfjdkfdkfd', 'selesai', NULL, '2026-04-29T08:32:32.763965+00:00', NULL);
INSERT INTO "public"."inquiries" ("id", "nama", "no_hp", "email", "layanan_id", "pesan", "status", "catatan_internal", "created_at", "tempat_tinggal") VALUES ('5ebae4a3-7d67-49e7-a9b4-9e7d58c02118', 'M. Diki Fahriza', '1232323232', 'mdikifahriza2@gmail.com', NULL, 'Jenis Masalah: Sengketa Bisnis & Perusahaan
Kota: Kab. Blitar

Kronologi:
alsdalkdadasldksssssssssssssssssssssssssssssssssssssssssssssssssssssss', 'baru', '', '2026-04-29T08:48:56.520776+00:00', NULL);
INSERT INTO "public"."inquiries" ("id", "nama", "no_hp", "email", "layanan_id", "pesan", "status", "catatan_internal", "created_at", "tempat_tinggal") VALUES ('d856e037-e547-4a25-80fd-cafe80697080', 'M. Diki Fahriza', '0232332323232', 'mdikifahriza2@gmail.com', '93c8d289-8b59-4f17-b734-159eb635ced9', 'dakljlskjakldaldjksdsds', 'selesai', NULL, '2026-04-29T09:17:44.840861+00:00', 'Kab. Blitar');
INSERT INTO "public"."inquiries" ("id", "nama", "no_hp", "email", "layanan_id", "pesan", "status", "catatan_internal", "created_at", "tempat_tinggal") VALUES ('8d8e7e9d-9c1d-4bdb-8099-98969bd789b9', 'M. Diki Fahriza', '083232323232323', 'mdikifahriza2@gmail.com', '4477068c-a103-41d6-b56b-c23099411270', ',amsda,msm,dsmdssmdsd x x x x  xsdsmdsdsmdsdsmdsmdsndmsdsdsdsdlkqjqlkddm,m,m,m,sm,dsndmsdssmdsdsmdsmdsmddmsdm', 'baru', NULL, '2026-04-29T09:23:35.90283+00:00', 'Kab. Blitar');
INSERT INTO "public"."inquiries" ("id", "nama", "no_hp", "email", "layanan_id", "pesan", "status", "catatan_internal", "created_at", "tempat_tinggal") VALUES ('b9fcf5d3-c53b-44ac-81a2-854b6da33cef', 'Coba', '0823232234444', 'mdikifahriza3@gmail.com', 'acb5b3b0-b172-4f70-bd49-d5314347be29', 'sasdl;asklajsdajddksjdksdskjdjksdjskdjewwwx
asdlaksaldlksjdklsdskdskld
askdskdjskljada
dnasnda,anxsddksdsd
asdksdajlsdaldalwewewsds
daksdj', 'baru', NULL, '2026-04-30T05:56:50.312288+00:00', 'Blitar');
INSERT INTO "public"."inquiries" ("id", "nama", "no_hp", "email", "layanan_id", "pesan", "status", "catatan_internal", "created_at", "tempat_tinggal") VALUES ('511e7295-b3d9-428f-88f0-70d069f0a724', 'Tes 1', '03283228323232', 'coba@gmail.com', '676f54e5-7f14-4c0d-8894-c679f864800e', 'mencoba upload mencoba upload mencoba upload mencoba upload mencoba upload 
mencoba upload mencoba upload mencoba upload mencoba upload mencoba upload 
mencoba upload mencoba upload mencoba upload mencoba upload mencoba upload 
mencoba upload mencoba upload mencoba upload mencoba upload mencoba upload 
mencoba upload mencoba upload mencoba upload mencoba upload mencoba upload 
mencoba upload mencoba upload mencoba upload mencoba upload mencoba upload ', 'baru', 'adalkdjakldjaklsddsds', '2026-04-30T06:00:10.446084+00:00', 'Blitar');
INSERT INTO "public"."inquiries" ("id", "nama", "no_hp", "email", "layanan_id", "pesan", "status", "catatan_internal", "created_at", "tempat_tinggal") VALUES ('2ce3e319-1fe0-4ad3-adda-40d1a0a49b6c', 'M. Diki Fahriza', '085123759525', 'mdikifahriza3@gmail.com', '676f54e5-7f14-4c0d-8894-c679f864800e', '123slasaklsasasasasasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasasadddd
123slasaklsasasasasasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasasadddd
123slasaklsasasasasasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasasadddd
123slasaklsasasasasasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasasadddd
123slasaklsasasasasasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasasadddd
123slasaklsasasasasasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasasadddd
123slasaklsasasasasasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasasadddd123slasaklsasasasasasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasasadddd
123slasaklsasasasasasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasasadddd', 'baru', NULL, '2026-04-30T06:47:06.759419+00:00', 'Blitar');

-- Data untuk tabel page_visits
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('aa37a9fe-9c74-4318-893b-25b488249fe1', '/kontak', 'contact', NULL, 'manual-check-session', '/', NULL, '{"title":"Kontak | Manual Check"}', '2026-04-29T22:07:07.558819+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('62e06078-b370-4b1a-ae9d-969ba7c03d5b', '/kontak', 'contact', NULL, 'manual-direct-script', '/', NULL, '{"title":"Direct Insert Check"}', '2026-04-29T22:07:53.258663+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('4d58f1be-9551-4d98-9323-167c251f7f1d', '/kontak', 'contact', NULL, 'manual-check-session-2', '/', NULL, '{"title":"Kontak | Manual Check 2"}', '2026-04-29T22:07:53.258074+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('4e14274d-f9ef-408f-b987-f589637cb4e0', '/kontak', 'contact', NULL, '796f2876-786d-419e-b581-ba1a1b0016da', NULL, NULL, '{"title":"Kontak | Hutabarat Law"}', '2026-04-29T22:08:45.814922+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('a0a6b218-ea88-45e9-bc4d-00f521ff642e', '/', 'home', NULL, '9a07fffe-642c-4d7c-ba7d-4bff0c831295', '/admin/galleries', NULL, '{"title":"Hutabarat Law — Konsultan Hukum & Perlindungan Konsumen Blitar"}', '2026-04-30T02:01:10.61956+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('8a33aef5-cf85-4db2-9a10-2fd09d0ba9f6', '/galeri', 'gallery_index', NULL, '9a07fffe-642c-4d7c-ba7d-4bff0c831295', '/', NULL, '{}', '2026-04-30T02:01:14.455437+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('79bc2e28-81e7-4580-bb8e-bc5289d75a16', '/artikel', 'article_index', NULL, '9a07fffe-642c-4d7c-ba7d-4bff0c831295', '/galeri', NULL, '{"title":"Hutabarat Law — Konsultan Hukum & Perlindungan Konsumen Blitar"}', '2026-04-30T02:01:53.647512+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('b9793a4c-f936-44e6-ba1f-e46655f0dcd1', '/galeri', 'gallery_index', NULL, '9a07fffe-642c-4d7c-ba7d-4bff0c831295', '/artikel', NULL, '{"title":"Galeri | Hutabarat Law"}', '2026-04-30T02:02:00.645871+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('23293b83-2e26-4016-ac3a-a234857e38a6', '/tim', 'team', NULL, '9a07fffe-642c-4d7c-ba7d-4bff0c831295', '/galeri', NULL, '{}', '2026-04-30T02:02:11.782453+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('8c9bbbf6-e81d-4d70-97b6-65b4ff6e0b99', '/', 'home', NULL, '9a07fffe-642c-4d7c-ba7d-4bff0c831295', '/tim', NULL, '{"title":"Hutabarat Law — Konsultan Hukum & Perlindungan Konsumen Blitar"}', '2026-04-30T02:02:16.924976+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('53127f97-577a-4a7e-8ab8-8c760953df01', '/kontak', 'contact', NULL, '9a07fffe-642c-4d7c-ba7d-4bff0c831295', '/', NULL, '{"title":"Kontak | Hutabarat Law"}', '2026-04-30T02:02:41.423897+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('395afba1-b51e-4700-a51c-eea3cfc6520c', '/', 'home', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', NULL, NULL, '{"title":"Hutabarat Law — Konsultan Hukum & Perlindungan Konsumen Blitar"}', '2026-04-30T02:31:17.237087+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('a3799d2b-d8e3-4034-9d86-0a6deab9c841', '/kontak', 'contact', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/', NULL, '{"title":"Kontak | Hutabarat Law"}', '2026-04-30T02:31:38.565817+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('827df4b4-d483-4b1d-94b2-aa5db1dceaf2', '/layanan', 'service_index', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/kontak', NULL, '{}', '2026-04-30T02:31:53.560083+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('529924d7-32f6-47c2-bc77-86d7052f8031', '/', 'home', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/layanan', NULL, '{"title":"Hutabarat Law — Konsultan Hukum & Perlindungan Konsumen Blitar"}', '2026-04-30T02:36:10.428002+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('ca7e9341-682c-479b-afd8-06e2bad2e1e0', '/', 'home', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', NULL, NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T03:23:37.142651+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('3948b442-fb96-4757-b1e8-4dd8936705b6', '/', 'home', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', NULL, NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T05:29:31.282807+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('acbab215-2bb9-4bca-bc49-ce0a1bc781bd', '/', 'home', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', NULL, NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T05:31:48.034526+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('8240e248-3a89-4820-b02d-6f1aec9d4904', '/', 'home', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', NULL, NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T05:34:20.929444+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('3278ebf8-9704-4efd-bb18-ae626da59b76', '/layanan', 'service_index', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/', NULL, '{}', '2026-04-30T05:37:44.120659+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('671f3436-aa88-4deb-b4d5-eef91d50a924', '/layanan/gugatan-perbuatan-melawan-hukum', 'service_detail', 'gugatan-perbuatan-melawan-hukum', '4dab884b-ee06-4231-997b-f535aeb50f2e', '/layanan', NULL, '{"title":"Layanan Tidak Ditemukan | Kantor Konsultan Hukum Hari Mulana Hutabarat, S.H., CPLA"}', '2026-04-30T05:37:48.300404+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('31fee631-29fe-44cd-b7e2-e9ce3c84be5e', '/layanan/gugatan-perbuatan-melawan-hukum', 'service_detail', 'gugatan-perbuatan-melawan-hukum', '4dab884b-ee06-4231-997b-f535aeb50f2e', NULL, NULL, '{"title":"Gugatan Perbuatan Melawan Hukum | Kantor Konsultan Hukum Hari Mulana Hutabarat, S.H., CPLA"}', '2026-04-30T05:40:06.594171+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('cbc7fc13-2d6e-44dc-bc1c-f8915fb8d285', '/layanan/gugatan-perbuatan-melawan-hukum', 'service_detail', 'gugatan-perbuatan-melawan-hukum', '4dab884b-ee06-4231-997b-f535aeb50f2e', NULL, NULL, '{"title":"Gugatan Perbuatan Melawan Hukum | Kantor Konsultan Hukum Hari Mulana Hutabarat, S.H., CPLA"}', '2026-04-30T05:42:21.099269+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('7cba2cf1-21ca-4880-95a3-695d155c1784', '/konsultasi', 'consultation', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/layanan/gugatan-perbuatan-melawan-hukum', NULL, '{"title":"Konsultasi Hukum Online — Hutabarat Law Blitar"}', '2026-04-30T05:56:03.827985+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('d8260764-e149-4b29-973c-b6df3226ab78', '/', 'home', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/konsultasi', NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T05:57:59.171895+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('3e7ee187-3812-4350-9834-b9c37c681246', '/konsultasi', 'consultation', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/', NULL, '{"title":"Konsultasi Hukum Online — Hutabarat Law Blitar"}', '2026-04-30T05:59:04.214907+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('4ee6f0c6-3fba-4e3d-a015-ba25064af06e', '/', 'home', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/konsultasi', NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T06:46:24.429248+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('ebf7c10a-50d9-4243-95ae-57fbcb2ac6b7', '/konsultasi', 'consultation', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/', NULL, '{"title":"Konsultasi Hukum Online — Hutabarat Law Blitar"}', '2026-04-30T06:46:28.898014+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('c7a93da8-0df0-4af5-b554-b0b6415e352a', '/', 'home', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/konsultasi', NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T06:47:57.615054+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('f2d5a638-1234-4097-8a62-0ca51d70b5df', '/galeri', 'gallery_index', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/', NULL, '{}', '2026-04-30T06:48:28.432085+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('982ffe3c-11ba-4423-bb5c-56ecad9d4b65', '/', 'home', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/galeri', NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T06:48:35.788392+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('a7311c55-4e57-4c6b-97c9-c61390071900', '/', 'home', NULL, '9a07fffe-642c-4d7c-ba7d-4bff0c831295', '/kontak', NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T06:52:44.966486+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('60f8098f-6475-492c-b838-0effc5437470', '/layanan', 'service_index', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/', NULL, '{}', '2026-04-30T06:53:27.835615+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('7e78def6-c5b3-4ea0-9dba-b204a4d1df4f', '/', 'home', NULL, '4dab884b-ee06-4231-997b-f535aeb50f2e', '/layanan', NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T06:53:30.900494+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('40523b24-962a-4518-8788-1a2b53bd49bc', '/', 'home', NULL, 'e4dd76c5-dc61-4241-acf4-8d3576589be1', NULL, NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T07:02:10.810168+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('72f02bc0-cf5f-4cbb-9386-df6361472125', '/', 'home', NULL, 'e4dd76c5-dc61-4241-acf4-8d3576589be1', NULL, NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T07:02:49.175521+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('18ac82d9-1daf-4b01-9b52-caffcf27a078', '/', 'home', NULL, 'e4dd76c5-dc61-4241-acf4-8d3576589be1', NULL, NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T07:02:56.353967+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('6c00ee2c-7a4c-4af2-901f-43fcdae99936', '/', 'home', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', NULL, NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T08:18:29.318342+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('714d7025-6d49-49d5-9b8e-2073b4f34ac1', '/galeri', 'gallery_index', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', '/', NULL, '{}', '2026-04-30T08:18:32.967727+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('760ad3a0-744a-4904-8589-feb6e5f9b384', '/', 'home', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', '/galeri', NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T08:19:16.486423+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('00afc10f-bdd1-4bb2-9e9b-8cc5026369fc', '/layanan', 'service_index', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', '/', NULL, '{}', '2026-04-30T08:19:19.061775+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('4ff193b0-d5bb-446c-8d21-848ec6a37a9d', '/', 'home', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', '/layanan', NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T08:19:22.219809+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('cce7b14d-c9f0-427f-9813-fca06638b2e1', '/tim', 'team', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', '/', NULL, '{"title":"Tim Profesional Kami — Hutabarat Law Blitar"}', '2026-04-30T08:20:22.776778+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('f3937127-40ee-42f0-9098-cfc84e08d228', '/galeri', 'gallery_index', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', '/tim', NULL, '{"title":"Galeri | Hutabarat Law"}', '2026-04-30T08:21:13.790807+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('c1ceb8a5-1a1b-40a6-880a-7acd97513d72', '/artikel', 'article_index', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', '/galeri', NULL, '{"title":"Insight & Artikel Hukum — Hutabarat Law Blitar"}', '2026-04-30T08:21:17.061155+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('046a538d-aad6-4fd0-a7f7-2161ee61e4ee', '/tim', 'team', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', '/artikel', NULL, '{}', '2026-04-30T08:21:36.864318+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('5446660f-444e-4954-9830-273a1d8c23d8', '/galeri', 'gallery_index', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', '/tim', NULL, '{}', '2026-04-30T08:21:39.360144+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('40ecd1b5-b046-49c2-a4a2-415fbe76c504', '/galeri', 'gallery_index', NULL, 'e4dd76c5-dc61-4241-acf4-8d3576589be1', '/', NULL, '{}', '2026-04-30T08:24:43.556696+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('d333014a-b8e0-402f-8459-cd07a0abde6d', '/', 'home', NULL, 'e4dd76c5-dc61-4241-acf4-8d3576589be1', '/galeri', NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T08:25:51.906773+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('3388335f-02b4-4594-b571-15dcb9e708cd', '/', 'home', NULL, 'e4dd76c5-dc61-4241-acf4-8d3576589be1', NULL, NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T08:30:55.634686+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('21f483f8-e45c-4b70-beca-b1a1deaa807e', '/galeri', 'gallery_index', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', NULL, NULL, '{"title":"Galeri | Hutabarat Law"}', '2026-04-30T08:46:52.648747+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('06e73eb3-c384-491d-9290-72d55508ea78', '/', 'home', NULL, 'e4dd76c5-dc61-4241-acf4-8d3576589be1', NULL, NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T08:55:05.94925+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('bd15d950-5d6b-4596-9d7b-024424ea2652', '/galeri', 'gallery_index', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', NULL, NULL, '{"title":"Galeri | Hutabarat Law"}', '2026-04-30T08:57:25.995819+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('c7f630e2-ca46-47a7-9f26-3b224ed58142', '/galeri', 'gallery_index', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', NULL, NULL, '{"title":"Galeri | Hutabarat Law"}', '2026-04-30T09:30:59.63966+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('48ccd411-c5f3-4d90-af36-9b7546b1761e', '/', 'home', NULL, 'e4dd76c5-dc61-4241-acf4-8d3576589be1', NULL, NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T09:31:01.203753+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('7e342f7a-5424-4cb4-9833-624e2e4af119', '/tim', 'team', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', '/galeri', NULL, '{"title":"Tim Profesional Kami — Hutabarat Law Blitar"}', '2026-04-30T09:38:51.000169+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('07c383ff-d6bc-4a1b-a33b-f15a4d09bdc3', '/tim', 'team', NULL, '0ece8575-1411-4e2a-83b0-66b2a5be9972', NULL, NULL, '{"title":"Tim Profesional Kami — Hutabarat Law Blitar"}', '2026-04-30T10:00:37.544131+00:00');
INSERT INTO "public"."page_visits" ("id", "path", "page_type", "page_slug", "session_id", "referrer", "visitor_hash", "metadata", "visited_at") VALUES ('a3b7abe2-1c47-4438-a802-cbbf705f3a83', '/', 'home', NULL, 'e4dd76c5-dc61-4241-acf4-8d3576589be1', NULL, NULL, '{"title":"Konsultan Hukum & Perlindungan Konsumen Blitar | Hutabarat Law"}', '2026-04-30T10:00:39.928426+00:00');

