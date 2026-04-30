"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaPreview } from "@/components/ui/media-preview";
import {
  type GalleryItemRecord,
  type GalleryRecord,
  getGalleryCategoryLabel,
  getGalleryCoverUrl,
} from "@/lib/gallery";

export function GaleriDetailClient({
  gallery,
  relatedGalleries,
}: {
  gallery: GalleryRecord;
  relatedGalleries: GalleryRecord[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const items = gallery.gallery_items;
  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  const galleryStats = useMemo(
    () => [
      { label: "Jumlah Foto", value: items.length },
      { label: "Kategori", value: getGalleryCategoryLabel(gallery.kategori) },
      { label: "Foto Utama", value: items.find((item) => item.featured)?.caption || "Otomatis" },
    ],
    [gallery.kategori, items]
  );

  const movePreview = (direction: "next" | "prev") => {
    if (activeIndex === null || items.length === 0) {
      return;
    }

    if (direction === "next") {
      setActiveIndex((activeIndex + 1) % items.length);
      return;
    }

    setActiveIndex((activeIndex - 1 + items.length) % items.length);
  };

  return (
    <>
      <section className="border-b border-border bg-background pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <Link href="/galeri" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke galeri
          </Link>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="outline">{getGalleryCategoryLabel(gallery.kategori)}</Badge>
                <Badge variant="outline">{items.length} foto</Badge>
              </div>
              <h1 className="font-serif text-4xl font-bold leading-tight text-foreground md:text-6xl">{gallery.judul}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {gallery.deskripsi || "Dokumentasi visual dari kegiatan dan momen penting yang telah dipublikasikan."}
              </p>
            </div>

            <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {galleryStats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

        <section className="bg-background py-10 md:py-14">
          <div className="container mx-auto px-4 md:px-8">
            <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-sm">
              <MediaPreview
                key={getGalleryCoverUrl(gallery)}
                src={getGalleryCoverUrl(gallery)}
                alt={gallery.judul}
                className="aspect-[16/8] w-full object-cover"
                showPlayIcon={false}
              />
            </div>
        </div>
      </section>

      <section className="bg-background pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          {items.length === 0 ? (
            <div className="rounded-[28px] border border-border bg-card px-6 py-16 text-center shadow-sm">
              <Images className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <h2 className="font-serif text-2xl font-semibold text-foreground">Belum ada foto dalam album ini</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Album sudah dipublikasikan, tetapi item fotonya belum ditambahkan dari panel admin.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={
                    index === 0
                      ? "group overflow-hidden rounded-[28px] border border-border bg-card text-left shadow-sm md:col-span-2"
                      : "group overflow-hidden rounded-[28px] border border-border bg-card text-left shadow-sm"
                  }
                >
                    <div className="overflow-hidden">
                      <MediaPreview
                        key={item.image_url}
                        src={item.image_url}
                        alt={item.alt_text || item.caption || gallery.judul}
                        className={
                          index === 0
                            ? "aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            : "aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        }
                      />
                    </div>
                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {item.featured ? <Badge className="border-primary/30 bg-primary/10 text-primary">Featured</Badge> : null}
                      <Badge variant="outline">Foto {index + 1}</Badge>
                    </div>
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                      {item.caption || `Dokumentasi ${gallery.judul}`}
                    </h2>
                    {item.alt_text ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.alt_text}</p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {relatedGalleries.length > 0 ? (
        <section className="border-t border-border bg-background py-20 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">Album Lainnya</h2>
                <p className="mt-2 text-sm text-muted-foreground">Lihat dokumentasi publik lain yang sudah tersedia.</p>
              </div>

              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link href="/galeri">Semua Album</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedGalleries.map((relatedGallery) => (
                <Link
                  key={relatedGallery.id}
                  href={`/galeri/${relatedGallery.slug}`}
                  className="group overflow-hidden rounded-[28px] border border-border bg-card shadow-sm transition-colors hover:border-primary/30"
                >
                    <div className="overflow-hidden border-b border-border">
                      <MediaPreview
                        key={getGalleryCoverUrl(relatedGallery)}
                        src={getGalleryCoverUrl(relatedGallery)}
                        alt={relatedGallery.judul}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  <div className="p-6">
                    <Badge variant="outline">{relatedGallery.gallery_items.length} foto</Badge>
                    <h3 className="mt-4 font-serif text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
                      {relatedGallery.judul}
                    </h3>
                    <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
                      Buka album
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Dialog open={activeIndex !== null} onOpenChange={(open) => setActiveIndex(open ? activeIndex : null)}>
        <DialogContent className="max-w-6xl border-border bg-background p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview galeri {gallery.judul}</DialogTitle>
          </DialogHeader>
          {activeItem ? (
              <div className="grid min-h-[520px] lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="relative flex items-center justify-center overflow-hidden bg-black">
                  {activeItem.image_url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (
                    <video 
                      src={activeItem.image_url} 
                      className="max-h-[80vh] w-full object-contain" 
                      controls 
                      autoPlay 
                      playsInline 
                    />
                  ) : (
                    <MediaPreview
                      key={activeItem.image_url}
                      src={activeItem.image_url}
                      alt={activeItem.alt_text || activeItem.caption || gallery.judul}
                      className="max-h-[80vh] w-full object-contain"
                    />
                  )}
                </div>

              <div className="flex flex-col p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{getGalleryCategoryLabel(gallery.kategori)}</Badge>
                    <Badge variant="outline">
                      {activeIndex !== null ? activeIndex + 1 : 1} / {items.length}
                    </Badge>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveIndex(null)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <h2 className="font-serif text-3xl font-semibold text-foreground">
                  {activeItem.caption || `Foto ${activeIndex !== null ? activeIndex + 1 : 1}`}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {activeItem.alt_text || "Belum ada deskripsi tambahan untuk foto ini."}
                </p>

                <div className="mt-auto grid gap-3 pt-8">
                  {items.map((item: GalleryItemRecord, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                    className={
                        activeIndex === index
                          ? "flex items-center gap-3 rounded-2xl border border-primary bg-primary/5 p-3 text-left"
                          : "flex items-center gap-3 rounded-2xl border border-border p-3 text-left transition-colors hover:border-primary/30"
                      }
                    >
                      <MediaPreview
                        key={item.image_url}
                        src={item.image_url}
                        alt={item.alt_text || item.caption || gallery.judul}
                        className="h-16 w-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{item.caption || `Foto ${index + 1}`}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.featured ? "Foto utama album" : "Klik untuk melihat"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
