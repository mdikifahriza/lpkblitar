"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronRight, Images } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MediaPreview } from "@/components/ui/media-preview";
import {
  GALLERY_CATEGORY_OPTIONS,
  type GalleryRecord,
  getGalleryCategoryLabel,
  getGalleryCoverUrl,
} from "@/lib/gallery";

export function GaleriClient({
  initialGalleries,
  tableReady,
}: {
  initialGalleries: GalleryRecord[];
  tableReady: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const categoryOptions = useMemo(() => {
    const availableCategories = new Set(initialGalleries.map((gallery) => gallery.kategori));

    return [
      "Semua",
      ...GALLERY_CATEGORY_OPTIONS.filter((option) => availableCategories.has(option.value)).map((option) => option.label),
    ];
  }, [initialGalleries]);

  const filteredGalleries = useMemo(() => {
    if (activeCategory === "Semua") {
      return initialGalleries;
    }

    return initialGalleries.filter((gallery) => getGalleryCategoryLabel(gallery.kategori) === activeCategory);
  }, [activeCategory, initialGalleries]);

  return (
    <>
      <section className="border-b border-border bg-background pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">
              Beranda
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">Galeri</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-end">
            <div className="max-w-3xl">
              <span className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Dokumentasi Publik
              </span>
              <h1 className="font-serif text-4xl font-bold leading-tight text-foreground md:text-6xl">
                Galeri Kegiatan, Edukasi, dan Jejak Profesional
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Kumpulan dokumentasi kegiatan kantor, edukasi hukum, media, serta momen penting yang memperlihatkan cara
                kerja dan kehadiran kami di lapangan.
              </p>
            </div>

            <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Album Publik</p>
                  <h2 className="mt-2 text-3xl font-semibold text-foreground">{initialGalleries.length}</h2>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Foto</p>
                  <h2 className="mt-2 text-3xl font-semibold text-foreground">
                    {initialGalleries.reduce((count, gallery) => count + gallery.gallery_items.length, 0)}
                  </h2>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kategori Aktif</p>
                  <h2 className="mt-2 text-3xl font-semibold text-foreground">
                    {new Set(initialGalleries.map((gallery) => gallery.kategori)).size}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">Album Galeri</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pilih kategori untuk menelusuri dokumentasi yang paling relevan.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={
                    activeCategory === category
                      ? "rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                      : "rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {!tableReady || filteredGalleries.length === 0 ? (
            <div className="rounded-[28px] border border-border bg-card px-6 py-16 text-center shadow-sm">
              <Images className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="font-serif text-2xl font-semibold text-foreground">Galeri sedang disiapkan</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Dokumentasi publik akan tampil di sini begitu album dan foto mulai dipublikasikan dari panel admin.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredGalleries.map((gallery) => (
                <article
                  key={gallery.id}
                  className="group overflow-hidden rounded-[28px] border border-border bg-card shadow-sm transition-colors hover:border-primary/30"
                >
                  <Link href={`/galeri/${gallery.slug}`} className="block">
                      <div className="overflow-hidden border-b border-border bg-muted">
                        <MediaPreview
                          key={getGalleryCoverUrl(gallery)}
                          src={getGalleryCoverUrl(gallery)}
                          alt={gallery.judul}
                          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>

                    <div className="p-6">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <Badge variant="outline">{getGalleryCategoryLabel(gallery.kategori)}</Badge>
                        <Badge variant="outline">{gallery.gallery_items.length} foto</Badge>
                      </div>

                      <h3 className="font-serif text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
                        {gallery.judul}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {gallery.deskripsi || "Album dokumentasi kegiatan dan momen penting yang telah dipublikasikan."}
                      </p>

                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Lihat Detail
                        </span>
                        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
