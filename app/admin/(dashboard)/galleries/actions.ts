"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { slugifyGalleryTitle } from "@/lib/gallery";
import { getStorageBucketName, getStoragePathFromUrl } from "@/lib/storage";

type GalleryPayload = {
  id?: string | null;
  judul?: string | null;
  slug?: string | null;
  deskripsi?: string | null;
  kategori?: string | null;
  cover_url?: string | null;
  previous_cover_url?: string | null;
  previous_slug?: string | null;
  nomor_urut?: number | null;
  published?: boolean | null;
  published_at?: string | null;
};

type GalleryItemPayload = {
  id?: string | null;
  gallery_id?: string | null;
  image_url?: string | null;
  previous_image_url?: string | null;
  caption?: string | null;
  alt_text?: string | null;
  nomor_urut?: number | null;
  featured?: boolean | null;
};

function isMissingRelationError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  return error.code === "42P01" || error.code === "PGRST205" || error.message?.includes("does not exist") || false;
}

function getUniquePaths(urls: Array<string | null | undefined>) {
  return [...new Set(urls.map((url) => getStoragePathFromUrl(url)).filter((path): path is string => Boolean(path)))];
}

function revalidateGalleryPages(slugs: Array<string | null | undefined> = []) {
  revalidatePath("/galeri");
  revalidatePath("/admin/galleries");
  revalidatePath("/sitemap.xml");

  slugs
    .filter((slug): slug is string => Boolean(slug))
    .forEach((slug) => revalidatePath(`/galeri/${slug}`));
}

export async function upsertGallery(data: GalleryPayload) {
  try {
    const supabase = createAdminClient();
    const { previous_cover_url, previous_slug, ...payload } = data;
    const now = new Date().toISOString();
    const slug = (payload.slug || payload.judul || "").trim()
      ? slugifyGalleryTitle(String(payload.slug || payload.judul))
      : "";

    if (!payload.judul?.trim()) {
      return { error: "Judul album wajib diisi." };
    }

    if (!slug) {
      return { error: "Slug album tidak valid." };
    }

    const galleryPayload = {
      judul: payload.judul.trim(),
      slug,
      deskripsi: payload.deskripsi?.trim() || null,
      kategori: payload.kategori?.trim() || "kegiatan-kantor",
      cover_url: payload.cover_url?.trim() || null,
      nomor_urut: Number(payload.nomor_urut) || 0,
      published: Boolean(payload.published),
      published_at: payload.published ? payload.published_at || now : null,
      updated_at: now,
    };

    if (payload.id) {
      const { error } = await supabase.from("galleries").update(galleryPayload).eq("id", payload.id);

      if (error) {
        if (isMissingRelationError(error)) {
          return { error: "Jalankan migration galeri terlebih dahulu." };
        }

        throw error;
      }
    } else {
      const { error } = await supabase.from("galleries").insert([
        {
          ...galleryPayload,
          created_at: now,
        },
      ]);

      if (error) {
        if (isMissingRelationError(error)) {
          return { error: "Jalankan migration galeri terlebih dahulu." };
        }

        throw error;
      }
    }

    if (
      typeof previous_cover_url === "string" &&
      galleryPayload.cover_url &&
      previous_cover_url &&
      previous_cover_url !== galleryPayload.cover_url
    ) {
      const adminClient = createAdminClient();
      const previousPath = getStoragePathFromUrl(previous_cover_url);

      if (previousPath) {
        await adminClient.storage.from(getStorageBucketName()).remove([previousPath]);
      }
    }

    revalidateGalleryPages([previous_slug, slug]);
    return { success: true };
  } catch (error: unknown) {
    console.error("Gallery upsert error:", error);
    return {
      error: error instanceof Error ? error.message : "Gagal menyimpan album galeri.",
    };
  }
}

export async function deleteAllGalleries() {
  try {
    const adminClient = createAdminClient();

    // Get all galleries and their items to know which files to delete
    const { data: galleries, error: galleryError } = await adminClient
      .from("galleries")
      .select("slug, cover_url");

    if (galleryError && !isMissingRelationError(galleryError)) {
      throw galleryError;
    }

    const { data: galleryItems, error: itemsError } = await adminClient
      .from("gallery_items")
      .select("image_url");

    if (itemsError && !isMissingRelationError(itemsError)) {
      throw itemsError;
    }

    // Delete all from galleries (cascade will delete items)
    const { error } = await adminClient
      .from("galleries")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      if (isMissingRelationError(error)) {
        return { error: "Jalankan migration galeri terlebih dahulu." };
      }
      throw error;
    }

    // Clean up storage
    const allUrls = [
      ...(galleries ?? []).map(g => g.cover_url),
      ...(galleryItems ?? []).map(i => i.image_url)
    ];

    const filePaths = getUniquePaths(allUrls);

    if (filePaths.length > 0) {
      await adminClient.storage.from(getStorageBucketName()).remove(filePaths);
    }

    revalidateGalleryPages((galleries ?? []).map(g => g.slug));
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete all galleries error:", error);
    return { error: error instanceof Error ? error.message : "Gagal menghapus semua album." };
  }
}

export async function deleteGallery(id: string) {
  try {
    const adminClient = createAdminClient();
    const { data: existingGallery, error: galleryError } = await adminClient
      .from("galleries")
      .select("slug, cover_url")
      .eq("id", id)
      .maybeSingle();

    if (galleryError && !isMissingRelationError(galleryError)) {
      throw galleryError;
    }

    const { data: galleryItems, error: itemsError } = await adminClient
      .from("gallery_items")
      .select("image_url")
      .eq("gallery_id", id);

    if (itemsError && !isMissingRelationError(itemsError)) {
      throw itemsError;
    }

    const { error } = await adminClient.from("galleries").delete().eq("id", id);

    if (error) {
      if (isMissingRelationError(error)) {
        return { error: "Jalankan migration galeri terlebih dahulu." };
      }

      throw error;
    }

    const filePaths = getUniquePaths([
      existingGallery?.cover_url,
      ...(galleryItems ?? []).map((item) => item.image_url),
    ]);

    if (filePaths.length > 0) {
      await adminClient.storage.from(getStorageBucketName()).remove(filePaths);
    }

    revalidateGalleryPages([existingGallery?.slug]);
    return { success: true };
  } catch (error: unknown) {
    console.error("Gallery delete error:", error);
    return {
      error: error instanceof Error ? error.message : "Gagal menghapus album galeri.",
    };
  }
}

export async function toggleGalleryStatus(id: string, published: boolean) {
  try {
    const adminClient = createAdminClient();
    const now = new Date().toISOString();
    const { data: existingGallery, error: existingError } = await adminClient
      .from("galleries")
      .select("slug, published_at")
      .eq("id", id)
      .maybeSingle();

    if (existingError && !isMissingRelationError(existingError)) {
      throw existingError;
    }

    const { error } = await adminClient
      .from("galleries")
      .update({
        published,
        published_at: published ? existingGallery?.published_at || now : null,
        updated_at: now,
      })
      .eq("id", id);

    if (error) {
      if (isMissingRelationError(error)) {
        return { error: "Jalankan migration galeri terlebih dahulu." };
      }

      throw error;
    }

    revalidateGalleryPages([existingGallery?.slug]);
    return { success: true };
  } catch (error: unknown) {
    console.error("Gallery status toggle error:", error);
    return {
      error: error instanceof Error ? error.message : "Gagal mengubah status album.",
    };
  }
}

export async function upsertGalleryItem(data: GalleryItemPayload) {
  try {
    const adminClient = createAdminClient();
    const now = new Date().toISOString();

    if (!data.gallery_id) {
      return { error: "Album galeri belum dipilih." };
    }

    if (!data.image_url?.trim()) {
      return { error: "Foto galeri wajib diisi." };
    }

    if (data.featured) {
      let clearFeaturedQuery = adminClient
        .from("gallery_items")
        .update({ featured: false, updated_at: now })
        .eq("gallery_id", data.gallery_id);

      if (data.id) {
        clearFeaturedQuery = clearFeaturedQuery.neq("id", data.id);
      }

      const { error: clearError } = await clearFeaturedQuery;

      if (clearError && !isMissingRelationError(clearError)) {
        throw clearError;
      }
    }

    const itemPayload = {
      gallery_id: data.gallery_id,
      image_url: data.image_url.trim(),
      caption: data.caption?.trim() || null,
      alt_text: data.alt_text?.trim() || null,
      nomor_urut: Number(data.nomor_urut) || 0,
      featured: Boolean(data.featured),
      updated_at: now,
    };

    if (data.id) {
      const { error } = await adminClient.from("gallery_items").update(itemPayload).eq("id", data.id);

      if (error) {
        if (isMissingRelationError(error)) {
          return { error: "Jalankan migration galeri terlebih dahulu." };
        }

        throw error;
      }
    } else {
      const { error } = await adminClient.from("gallery_items").insert([
        {
          ...itemPayload,
          created_at: now,
        },
      ]);

      if (error) {
        if (isMissingRelationError(error)) {
          return { error: "Jalankan migration galeri terlebih dahulu." };
        }

        throw error;
      }
    }

    if (
      typeof data.previous_image_url === "string" &&
      data.previous_image_url &&
      data.previous_image_url !== data.image_url
    ) {
      const previousPath = getStoragePathFromUrl(data.previous_image_url);

      if (previousPath) {
        await adminClient.storage.from(getStorageBucketName()).remove([previousPath]);
      }
    }

    const { data: galleryData } = await adminClient
      .from("galleries")
      .select("slug")
      .eq("id", data.gallery_id)
      .maybeSingle();

    revalidateGalleryPages([galleryData?.slug]);
    return { success: true };
  } catch (error: unknown) {
    console.error("Gallery item upsert error:", error);
    return {
      error: error instanceof Error ? error.message : "Gagal menyimpan foto galeri.",
    };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    const adminClient = createAdminClient();
    const { data: existingItem, error: itemError } = await adminClient
      .from("gallery_items")
      .select("gallery_id, image_url")
      .eq("id", id)
      .maybeSingle();

    if (itemError && !isMissingRelationError(itemError)) {
      throw itemError;
    }

    const { error } = await adminClient.from("gallery_items").delete().eq("id", id);

    if (error) {
      if (isMissingRelationError(error)) {
        return { error: "Jalankan migration galeri terlebih dahulu." };
      }

      throw error;
    }

    const imagePath = getStoragePathFromUrl(existingItem?.image_url);

    if (imagePath) {
      await adminClient.storage.from(getStorageBucketName()).remove([imagePath]);
    }

    const { data: galleryData } = await adminClient
      .from("galleries")
      .select("slug")
      .eq("id", existingItem?.gallery_id || "")
      .maybeSingle();

    revalidateGalleryPages([galleryData?.slug]);
    return { success: true };
  } catch (error: unknown) {
    console.error("Gallery item delete error:", error);
    return {
      error: error instanceof Error ? error.message : "Gagal menghapus foto galeri.",
    };
  }
}
