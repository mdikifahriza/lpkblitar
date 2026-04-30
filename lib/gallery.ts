export const GALLERY_CATEGORY_OPTIONS = [
  { value: "kegiatan-kantor", label: "Kegiatan Kantor" },
  { value: "edukasi-hukum", label: "Edukasi Hukum" },
  { value: "media-liputan", label: "Media & Liputan" },
  { value: "penghargaan", label: "Penghargaan" },
  { value: "dokumentasi-acara", label: "Dokumentasi Acara" },
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORY_OPTIONS)[number]["value"];

export type GalleryItemRecord = {
  id: string;
  gallery_id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  nomor_urut: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryRecord = {
  id: string;
  judul: string;
  slug: string;
  deskripsi: string | null;
  kategori: string;
  cover_url: string | null;
  nomor_urut: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  gallery_items: GalleryItemRecord[];
};

export function slugifyGalleryTitle(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getGalleryCategoryLabel(category: string) {
  return (
    GALLERY_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
    category
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (match) => match.toUpperCase())
  );
}

export function sortGalleryItems<T extends Pick<GalleryItemRecord, "featured" | "nomor_urut" | "created_at">>(
  items: T[]
) {
  return [...items].sort((left, right) => {
    if (Boolean(left.featured) !== Boolean(right.featured)) {
      return Number(Boolean(right.featured)) - Number(Boolean(left.featured));
    }

    if ((left.nomor_urut ?? 0) !== (right.nomor_urut ?? 0)) {
      return (left.nomor_urut ?? 0) - (right.nomor_urut ?? 0);
    }

    return new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
  });
}

export function sortGalleries<T extends Pick<GalleryRecord, "nomor_urut" | "created_at" | "published_at">>(
  galleries: T[]
) {
  return [...galleries].sort((left, right) => {
    if ((left.nomor_urut ?? 0) !== (right.nomor_urut ?? 0)) {
      return (left.nomor_urut ?? 0) - (right.nomor_urut ?? 0);
    }

    const leftPublished = left.published_at ? new Date(left.published_at).getTime() : 0;
    const rightPublished = right.published_at ? new Date(right.published_at).getTime() : 0;

    if (leftPublished !== rightPublished) {
      return rightPublished - leftPublished;
    }

    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });
}

export function getGalleryCoverUrl(gallery: Pick<GalleryRecord, "cover_url" | "gallery_items">) {
  if (gallery.cover_url) {
    return gallery.cover_url;
  }

  const featuredItem = gallery.gallery_items.find((item) => item.featured);
  
  // Prefer non-video for cover if possible, unless no other choice
  const firstImageItem = gallery.gallery_items.find(item => !isVideoUrl(item.image_url));

  return featuredItem?.image_url || firstImageItem?.image_url || gallery.gallery_items[0]?.image_url || "/fallback-gambar.jpeg";
}

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}
