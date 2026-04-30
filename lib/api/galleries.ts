import { createAdminClient } from "@/lib/supabase/admin";
import {
  type GalleryItemRecord,
  type GalleryRecord,
  sortGalleries,
  sortGalleryItems,
} from "@/lib/gallery";

export type GalleriesResult = {
  galleries: GalleryRecord[];
  tableReady: boolean;
};

export type GalleryBySlugResult = {
  gallery: GalleryRecord | null;
  tableReady: boolean;
};

type RawGalleryRow = {
  id: string;
  judul: string;
  slug: string;
  deskripsi: string | null;
  kategori: string;
  cover_url: string | null;
  nomor_urut: number | null;
  published: boolean | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  gallery_items?: Array<{
    id: string;
    gallery_id: string;
    image_url: string;
    caption: string | null;
    alt_text: string | null;
    nomor_urut: number | null;
    featured: boolean | null;
    created_at: string | null;
    updated_at: string | null;
  }> | null;
};

function isMissingRelationError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  return error.code === "42P01" || error.code === "PGRST205" || error.message?.includes("does not exist") || false;
}

function normalizeGalleryItem(row: NonNullable<RawGalleryRow["gallery_items"]>[number]): GalleryItemRecord {
  return {
    id: row.id,
    gallery_id: row.gallery_id,
    image_url: row.image_url,
    caption: row.caption ?? null,
    alt_text: row.alt_text ?? null,
    nomor_urut: row.nomor_urut ?? 0,
    featured: Boolean(row.featured),
    created_at: row.created_at ?? new Date(0).toISOString(),
    updated_at: row.updated_at ?? row.created_at ?? new Date(0).toISOString(),
  };
}

function normalizeGallery(row: RawGalleryRow): GalleryRecord {
  const galleryItems = sortGalleryItems((row.gallery_items ?? []).map(normalizeGalleryItem));

  return {
    id: row.id,
    judul: row.judul,
    slug: row.slug,
    deskripsi: row.deskripsi ?? null,
    kategori: row.kategori,
    cover_url: row.cover_url ?? null,
    nomor_urut: row.nomor_urut ?? 0,
    published: Boolean(row.published),
    published_at: row.published_at ?? null,
    created_at: row.created_at ?? new Date(0).toISOString(),
    updated_at: row.updated_at ?? row.created_at ?? new Date(0).toISOString(),
    gallery_items: galleryItems,
  };
}

export async function getAdminGalleries(): Promise<GalleriesResult> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("galleries")
    .select("*, gallery_items(*)")
    .order("nomor_urut", { ascending: true })
    .order("created_at", { ascending: false });

  if (isMissingRelationError(error)) {
    return { galleries: [], tableReady: false };
  }

  if (error) {
    console.error("Failed to load admin galleries:", error.message);
    return { galleries: [], tableReady: true };
  }

  return {
    galleries: sortGalleries((data ?? []).map((row) => normalizeGallery(row as RawGalleryRow))),
    tableReady: true,
  };
}

export async function getPublicGalleries(): Promise<GalleriesResult> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("galleries")
    .select("*, gallery_items(*)")
    .eq("published", true)
    .order("nomor_urut", { ascending: true })
    .order("published_at", { ascending: false });

  if (isMissingRelationError(error)) {
    return { galleries: [], tableReady: false };
  }

  if (error) {
    console.error("Failed to load public galleries:", error.message);
    return { galleries: [], tableReady: true };
  }

  return {
    galleries: sortGalleries((data ?? []).map((row) => normalizeGallery(row as RawGalleryRow))),
    tableReady: true,
  };
}

export async function getGalleryBySlug(slug: string): Promise<GalleryBySlugResult> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("galleries")
    .select("*, gallery_items(*)")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (isMissingRelationError(error)) {
    return { gallery: null, tableReady: false };
  }

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Failed to load gallery detail:", error.message);
    }

    return { gallery: null, tableReady: true };
  }

  return {
    gallery: data ? normalizeGallery(data as RawGalleryRow) : null,
    tableReady: true,
  };
}
