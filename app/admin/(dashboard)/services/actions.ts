"use server";
import { createClient } from "@/lib/supabase/server";

export async function upsertService(data: any) {
  try {
    const supabase = await createClient();
    
    if (!data.slug && data.nama) {
      data.slug = data.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (data.id) {
      const { error } = await supabase.from('services').update(data).eq('id', data.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('services').insert([data]);
      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Service upsert error:", error);
    return { error: error.message || "Gagal menyimpan layanan." };
  }
}

export async function deleteService(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menghapus layanan." };
  }
}

export async function toggleServiceStatus(id: string, aktif: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('services').update({ aktif }).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal mengubah status." };
  }
}
