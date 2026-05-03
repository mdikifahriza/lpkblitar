"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { slugifyArticleTitle } from "@/lib/article";
import { getStorageBucketName, getStoragePathFromUrl } from "@/lib/storage";

type ArticlePayload = {
  id?: string | null;
  judul?: string | null;
  slug?: string | null;
  thumbnail_url?: string | null;
  previous_thumbnail_url?: string | null;
  [key: string]: unknown;
};

export async function upsertArticle(data: ArticlePayload) {
  try {
    const supabase = await createClient();
    const { previous_thumbnail_url, id, ...payload } = data;

    const normalizedTitle = typeof payload.judul === "string" ? payload.judul : "";
    const normalizedSlugSource =
      typeof payload.slug === "string" && payload.slug.trim()
        ? payload.slug
        : normalizedTitle;
    const normalizedSlug = slugifyArticleTitle(normalizedSlugSource);

    if (!normalizedSlug) {
      return { error: "Judul artikel wajib diisi agar slug dapat dibuat." };
    }

    payload.slug = normalizedSlug;

    if (id) {
      const { error } = await supabase.from("articles").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      const insertPayload = {
        id: crypto.randomUUID(),
        ...payload,
      };

      const { error } = await supabase.from("articles").insert([insertPayload]);
      if (error) throw error;
    }

    if (
      typeof previous_thumbnail_url === "string" &&
      typeof payload.thumbnail_url === "string" &&
      previous_thumbnail_url &&
      previous_thumbnail_url !== payload.thumbnail_url
    ) {
      const previousPath = getStoragePathFromUrl(previous_thumbnail_url);

      if (previousPath) {
        const adminClient = createAdminClient();
        await adminClient.storage.from(getStorageBucketName()).remove([previousPath]);
      }
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Article upsert error:", error);
    return { error: error instanceof Error ? error.message : "Gagal menyimpan artikel." };
  }
}

export async function deleteArticle(id: string) {
  try {
    const adminClient = createAdminClient();
    const { data: existingArticle } = await adminClient
      .from("articles")
      .select("thumbnail_url")
      .eq("id", id)
      .maybeSingle();

    const { error } = await adminClient.from("articles").delete().eq("id", id);
    if (error) throw error;

    if (existingArticle?.thumbnail_url) {
      const filePath = getStoragePathFromUrl(existingArticle.thumbnail_url);

      if (filePath) {
        await adminClient.storage.from(getStorageBucketName()).remove([filePath]);
      }
    }

    return { success: true };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus artikel." };
  }
}

export async function deleteAllArticles() {
  try {
    const adminClient = createAdminClient();
    
    // Get all articles to delete images
    const { data: existingArticles } = await adminClient
      .from("articles")
      .select("thumbnail_url");

    const { error } = await adminClient.from("articles").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;

    // Delete images
    if (existingArticles && existingArticles.length > 0) {
      const filePaths = existingArticles
        .map(a => getStoragePathFromUrl(a.thumbnail_url))
        .filter((path): path is string => Boolean(path));
      
      if (filePaths.length > 0) {
        await adminClient.storage.from(getStorageBucketName()).remove(filePaths);
      }
    }

    return { success: true };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus semua artikel." };
  }
}

export async function toggleArticleStatus(id: string, published: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("articles")
      .update({ published, published_at: published ? new Date().toISOString() : null })
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Gagal mengubah status." };
  }
}
