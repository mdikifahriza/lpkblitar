"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronRight, Images } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FilterChipRail } from "@/components/ui/filter-chip-rail";
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
      <section className="border-b border-border bg-background pb-14 pt-28 md:pb-20 md:pt-36">
        <div className="container mx-auto px-4 md:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground md:mb-8">
            <Link href="/" className="transition-colors hover:text-primary">
              Beranda
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">Galeri</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl font-bold leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
              Galeri Kegiatan, Edukasi, dan Jejak Profesional
            </h1>
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

            <FilterChipRail
              options={categoryOptions.map((category) => ({
                value: category,
                label: category,
              }))}
              activeValue={activeCategory}
              onChange={setActiveCategory}
              desktopClassName="md:gap-2"
              buttonClassName="md:px-4 md:py-2 md:text-xs md:font-semibold md:tracking-[0.14em]"
            />
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
