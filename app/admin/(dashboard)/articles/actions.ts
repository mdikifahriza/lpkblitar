"use server";
import { createClient } from "@/lib/supabase/server";

export async function upsertArticle(data: any) {
  try {
    const supabase = await createClient();

    if (!data.slug && data.judul) {
      data.slug = data.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (data.id) {
      const { error } = await supabase.from('articles').update(data).eq('id', data.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('articles').insert([data]);
      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Article upsert error:", error);
    return { error: error.message || "Gagal menyimpan artikel." };
  }
}

export async function deleteArticle(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menghapus artikel." };
  }
}

export async function toggleArticleStatus(id: string, published: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('articles').update({ published, published_at: published ? new Date().toISOString() : null }).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal mengubah status." };
  }
}
