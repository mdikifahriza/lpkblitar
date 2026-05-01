"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Images,
  Loader2,
  Maximize2,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MediaPreview } from "@/components/ui/media-preview";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import {
  type GalleryItemRecord,
  type GalleryRecord,
  getGalleryCategoryLabel,
  getGalleryCoverUrl,
} from "@/lib/gallery";

function isVideoItem(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export function GaleriDetailClient({
  gallery,
}: {
  gallery: GalleryRecord;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const items = gallery.gallery_items;
  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const handleSelect = () => {
      setCarouselIndex(carouselApi.selectedScrollSnap());
    };

    handleSelect();
    carouselApi.on("select", handleSelect);
    carouselApi.on("reInit", handleSelect);

    return () => {
      carouselApi.off("select", handleSelect);
      carouselApi.off("reInit", handleSelect);
    };
  }, [carouselApi]);

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

  const selectCarouselItem = (index: number) => {
    carouselApi?.scrollTo(index);
    setCarouselIndex(index);
  };

  const buildDownloadFilename = (item: GalleryItemRecord, index: number) => {
    const rawName = item.caption || item.alt_text || `${gallery.judul}-${index + 1}`;
    const safeName =
      rawName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || `galeri-${index + 1}`;
    const extensionMatch = item.image_url.match(/\.([a-z0-9]+)(?:[?#].*)?$/i);
    const extension = extensionMatch?.[1]?.toLowerCase() || "jpg";

    return `${safeName}.${extension}`;
  };

  const handleDownloadItem = async (item: GalleryItemRecord, index: number) => {
    setIsDownloading(true);

    try {
      const response = await fetch(item.image_url);

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = buildDownloadFilename(item, index);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch (error) {
      console.error("Gallery download error:", error);
      toast.error("File tidak bisa diunduh langsung. Periksa izin file di storage.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <section className="border-b border-border bg-background pb-12 pt-32 md:pb-16 md:pt-40">
        <div className="container mx-auto px-4 md:px-8">
          <Link
            href="/galeri"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke galeri
          </Link>

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
            <div className="mx-auto max-w-6xl space-y-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">Dokumentasi Album</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Geser untuk meninjau tiap foto. Sorot atau ketuk slide untuk membuka preview penuh.
                  </p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{carouselIndex + 1}</span>
                  <span>/</span>
                  <span>{items.length}</span>
                </div>
              </div>

              <Carousel
                setApi={setCarouselApi}
                opts={{ align: "start", loop: items.length > 1 }}
                className="w-full"
              >
                <CarouselContent className="-ml-0">
                  {items.map((item, index) => (
                    <CarouselItem key={item.id} className="pl-0">
                      <button
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className="group block w-full overflow-hidden rounded-[28px] border border-border bg-card text-left shadow-sm"
                      >
                        <div className="relative">
                          <MediaPreview
                            key={item.image_url}
                            src={item.image_url}
                            alt={item.alt_text || item.caption || gallery.judul}
                            className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                            {item.featured ? (
                              <Badge variant="outline" className="border-white/15 bg-black/55 text-white">
                                Featured
                              </Badge>
                            ) : null}
                            <Badge variant="outline" className="border-white/15 bg-black/55 text-white">
                              Foto {index + 1}
                            </Badge>
                            {isVideoItem(item.image_url) ? (
                              <Badge variant="outline" className="border-white/15 bg-black/55 text-white">
                                Video
                              </Badge>
                            ) : null}
                          </div>

                          <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                            <div className="flex items-end justify-between gap-4">
                              <div className="max-w-3xl">
                                <h3 className="font-serif text-2xl font-semibold text-white md:text-4xl">
                                  {item.caption || `Dokumentasi ${gallery.judul}`}
                                </h3>
                                <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
                                  {item.alt_text || "Klik untuk membuka preview ukuran penuh dan menelusuri tiap gambar."}
                                </p>
                              </div>

                              <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/95 transition-all duration-300 md:inline-flex md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                                Buka Preview
                                <Maximize2 className="h-4 w-4" />
                              </div>
                            </div>
                          </div>

                          <div className="absolute inset-x-0 bottom-4 flex justify-center md:hidden">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                              Ketuk untuk preview
                              <Maximize2 className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {items.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => carouselApi?.scrollPrev()}
                      className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                      aria-label="Foto sebelumnya"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => carouselApi?.scrollNext()}
                      className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                      aria-label="Foto berikutnya"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                ) : null}
              </Carousel>

              {items.length > 1 ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectCarouselItem(index)}
                      className={
                        carouselIndex === index
                          ? "shrink-0 overflow-hidden rounded-2xl border border-primary bg-primary/5 p-1"
                          : "shrink-0 overflow-hidden rounded-2xl border border-border p-1 transition-colors hover:border-primary/30"
                      }
                      aria-label={`Pilih foto ${index + 1}`}
                    >
                      <MediaPreview
                        key={`${item.image_url}-thumb`}
                        src={item.image_url}
                        alt={item.alt_text || item.caption || gallery.judul}
                        className="h-20 w-28 rounded-xl object-cover md:h-24 md:w-36"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => setActiveIndex(open ? activeIndex : null)}>
        <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto overscroll-contain border-border bg-background p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview galeri {gallery.judul}</DialogTitle>
          </DialogHeader>
          {activeItem ? (
            <div className="grid min-h-[520px] lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="relative flex items-center justify-center overflow-hidden bg-black">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void handleDownloadItem(activeItem, activeIndex ?? 0);
                  }}
                  disabled={isDownloading}
                  aria-label="Download file galeri"
                  className="absolute left-4 top-4 z-30 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-black/65 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors [touch-action:manipulation] hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  <span className="hidden sm:inline">Download</span>
                </button>

                {items.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => movePreview("prev")}
                      className="absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                      aria-label="Preview sebelumnya"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePreview("next")}
                      className="absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                      aria-label="Preview berikutnya"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                ) : null}

                {isVideoItem(activeItem.image_url) ? (
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
                  {items.map((item, index) => (
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
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
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
