"use server";
import { createClient } from "@/lib/supabase/server";

export async function upsertTeamMember(data: any) {
  try {
    const supabase = await createClient();

    if (data.id) {
      const { error } = await supabase.from('team_members').update(data).eq('id', data.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('team_members').insert([data]);
      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Team upsert error:", error);
    return { error: error.message || "Gagal menyimpan anggota tim." };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menghapus anggota." };
  }
}

export async function toggleTeamStatus(id: string, aktif: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('team_members').update({ aktif }).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal mengubah status." };
  }
}
