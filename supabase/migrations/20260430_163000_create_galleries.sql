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
