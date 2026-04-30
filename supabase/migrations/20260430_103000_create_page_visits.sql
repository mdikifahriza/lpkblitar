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
